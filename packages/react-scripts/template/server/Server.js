import Options from "./options/Options";
import check from "check-types";

import bodyParser from "body-parser";
import compression from "compression";
import connect from "connect";
import serveStatic from "serve-static";
import querystring from "querystring";
import http from "http";
import fs from "fs";

import { LocalCacheManager } from '@adactive/adsum-client-api';

/**
 *
 */
class Server {
    /**
     * Create a new server
     *
     * Note: the provided option will be frozen to prevent modifications
     *
     * @param {ServerOptions} options
     */
    constructor(options) {
        check.assert.instance(options, Options, "options are required");

        if (!options.isValid()) {
            throw new Error("Invalid provided options");
        }
        options.freeze();

        this.options = options;

        this.app = null;
        this.server = null;
        this.routes = [];

        /**
        *
        * @type {LocalCacheManager}
        */
        this.cacheManager = new LocalCacheManager(this.options.)

        //Object.freeze(this); // Don't want to freeze it for now
    }

    start() {
        const time = Date.now();

        this.cacheManager.update(
            this.options.config.site, // Site Id
            this.options.cache, // Cache options
        ).then((updated) => {
            console.log(`Sync success in ${parseInt((Date.now() - time) / 1000)} seconds`);

            if (updated) {
                console.log('Cache up-to-date');
            } else {
                console.log('Cache is present but might be outdated (no Internet connexion)');
            }

            return this.onSynchroDone();
        }).catch((error) => {
            console.error('Unable to update the cache, and no cache available', error);
        });

        return this.proxyAPI.updater.run().then((success)=> {
            console.log(`Sync success in ${parseInt((Date.now() - time) / 1000)} seconds`);

            if (success) {
                console.log("Working with fresh data");
            } else {
                console.log("Working with old data");
            }

            return this.onSynchroDone();
        }, (e) => {
            console.log("Synchronization failed !");
            console.log(e);
        });
    }

    onSynchroDone() {
        return new Promise((resolve, reject) => {
            this.createServer().then(() => {
                console.log("Server successfully started");
                resolve({
                    url: `http://${this.options.hostname}:${this.options.port}/index.html`,
                    app: this.app
                });
            }, (e) => {
                console.log("Server failed to start !");
                reject(e);
            });
        });
    }

    createServer(app) {
        if (this.app === null) {
            this.bind(app);
        }

        return new Promise((resolve, reject) => {
                const server = http.createServer(this.app);

                server.on("error", (err) => {
                    this.options.logger.error("[Server] Server error", {
                        error: {
                            message: err.message,
                            stack: err.stack
                        }
                    });

                    reject(err);
                });

                server.on('clientError', (err, socket) => {
                    this.options.logger.warn("[Server] Client connection error", {
                        error: {
                            message: err.message,
                            stack: err.stack
                        }
                    });

                    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
                });

                server.listen(this.options.port, this.options.hostname, () => {
                    this.options.logger.info("[Server] Server started", {
                        protocol: "http",
                        hostname: this.options.hostname,
                        port: this.options.port
                    });

                    resolve(server);
                });
            }
        );

    }

    /**
     * Stop the server
     *
     * Note: this will work ONLY if you started it using the start method
     *
     * @return {Promise}
     */
    stop() {
        if (this.server === null || !this.server.listening) {
            return;
        }

        return new Promise((resolve, reject) => {
            this.server.on("close", () => {
                this.options.logger.info("[Server] Server stopped", {
                    error: {
                        message: err.message,
                        stack: err.stack
                    }
                });
            });

            // Error will be logged via start error listener
            this.server.on("error", reject);

            this.server.close();
        });
    }

    addRoute(name, callback) {
        if (typeof callback !== 'function') return;

        this.routes.push({
            name,
            callback
        });
    }

    bind(app = connect()) {
        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: true}));

        const route = this.options.route;

        app.use(`${route}`, serveStatic(this.options.path, ['index.html']));

        for (let i = 0; i < this.routes.length; i++) {
            app.use(`${route}${this.routes[i].name}`,this.routes[i].callback);
        }

        app.use(`${route}/deviceConfig`,  (req, res, next) =>{
            res.end(JSON.stringify(this.options.config));
            next();
        });

        app.use(`${route}/sendForm`,  (req, res, next) => {
            // Build the post string from an object

            let post_data = querystring.stringify(req.body.data);
            // An object of options to indicate where to post to
            let post_options = {
                host: req.body.url,
                path: req.body.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };

            // Set up the request
            let post_req = http.request(post_options, function (response) {
                let body = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    body += chunk;
                });
                response.on('end', function () {
                    res.end(body);
                    next();
                });
            });

            // post the data
            post_req.write(post_data);
            post_req.end();

        });

        app.use(`${route}/sendPostRequest`, (req, res, next) => {

            // Build the post string from an object
            let post_data = querystring.stringify(req.body.data);

            // An object of options to indicate where to post to
            let post_options = {
                host: req.body.url,
                path: req.body.path,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Content-Length': Buffer.byteLength(post_data)
                }
            };

            // Set up the request
            let post_req = http.request(post_options, function (response) {
                let body = '';

                response.setEncoding('utf8');

                response.on('data', function (chunk) {
                    body += chunk;
                });
                response.on('end', function () {
                    res.end(body);
                    next();
                });
            });

            post_req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                var response = {};
                response.error = 'problem with request:' + `${e.message}`;

                res.end(JSON.stringify(response));

                next();
            });

            // post the data
            post_req.write(post_data);
            post_req.end();

        });

        app.use(`${route}/sendGetRequest`,  (req, res, next) => {

            // Build the post string from an object
            let get_data = querystring.stringify(req.body.data);

            let pathUrl = req.body.path + '?' + get_data;

            // An object of options to indicate where to post to
            let get_options = {
                host: req.body.url,
                path: pathUrl
            };


            // Set up the request
            let get_req = http.request(get_options, function (response) {
                response.setEncoding('utf8');
                let body = '';
                response.on('data', function (chunk) {
                    body += chunk;
                });
                response.on('end', function () {
                    res.end(body);
                    next();
                });
            });

            get_req.on('error', (e) => {
                console.error(`problem with request: ${e.message}`);
                var response = {};
                response.error = 'problem with request:' + `${e.message}`;
                res.end(JSON.stringify(response));
                next();
            });

            // get the data
            get_req.end();


        });

        // request /localFile?path=..
        app.use(`${route}/localFile`, (req, res, next) => {
            let url = require('url');
            let url_parts = url.parse(req.url, true);
            let query = url_parts.query;

            let data;
            try {
                data = fs.readFileSync(query.path);
            } catch (e) {
                let path = query.path.replace(/\\/g, '/');
                data = fs.readFileSync(path);
            }

            console.log("Get local file : " + query.path);
            res.end(data);

            next();
        });

        this.app = app;

        this.options.logger.info("[Server] Middleware bound", {
            route
        });

        return this.app;
    }
}

export default Server;
