import http from 'http';
import fs from 'fs';
import url from 'url';

import check from 'check-types';

import bodyParser from 'body-parser';
import compression from 'compression';
import connect from 'connect';
import serveStatic from 'serve-static';
import cors from 'cors';
import { LocalCacheManager } from '@adactive/adsum-client-api';

import Options from './Options';
import imageUrlsFetcher from './ImageUrlsFetcher';

/**
 *
 */
class Server {
    /**
     * Create a new server
     *
     * @param {Options|object} options
     */
    constructor(options) {
        this.options = new Options(options);

        this.app = null;
        this.server = null;

        /**
         *
         * @type {LocalCacheManager}
         */
        this.cacheManager = new LocalCacheManager(this.options.data_folder);
    }

    start() {
        return new Promise((resolve, reject) => {
            this.createServer().then(() => {
                console.log('Server successfully started');
                resolve({
                    url: `http://${this.options.hostname}:${this.options.port}/`,
                    app: this.app,
                });
            }, (e) => {
                console.log('Server failed to start !');
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

            server.on('error', (err) => {
                this.options.logger.error('[Server] Server error', {
                    error: {
                        message: err.message,
                        stack: err.stack,
                    },
                });

                reject(err);
            });

            server.on('clientError', (err, socket) => {
                this.options.logger.warn('[Server] Client connection error', {
                    error: {
                        message: err.message,
                        stack: err.stack,
                    },
                });

                socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
            });

            server.listen(this.options.port, this.options.hostname, () => {
                this.options.logger.info('[Server] Server started', {
                    protocol: 'http',
                    hostname: this.options.hostname,
                    port: this.options.port,
                });

                resolve(server);
            });
        });
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
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            this.server.on('close', (err) => {
                this.options.logger.info('[Server] Server stopped', {
                    error: {
                        message: err.message,
                        stack: err.stack,
                    },
                });
            });

            // Error will be logged via start error listener
            this.server.on('error', reject);

            this.server.close();
        });
    }

    bind(app = connect()) {
        app.use(cors());
        app.use(compression());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        const { route } = this.options;

        app.use(`${route}`, serveStatic(this.options.path, { maxAge: '1d' }));

        app.use(`${route}/deviceConfig`, (req, res, next) => {
            res.end(JSON.stringify(this.options.config));
            next();
        });

        // request /localFile?path=..
        app.use(`${route}/localFile`, (req, res, next) => {
            const { query } = url.parse(req.url, true);

            let data;
            try {
                data = fs.readFileSync(query.path);
            } catch (e) {
                const path = query.path.replace(/\\/g, '/');
                data = fs.readFileSync(path);
            }

            console.log(`Get local file : ${query.path}`);
            res.end(data);

            next();
        });

        app.use(`${route}/getAllAppImageUrls`, (req, res, next) => {
            const arrOfEntryPointsRelativeToPublicDir = [
                'assets/images',
                'local/bin',
            ];

            let urls = [];
            try {
                urls = imageUrlsFetcher.getAllImageUrlsArr(
                    arrOfEntryPointsRelativeToPublicDir,
                    this.options.path,
                );
            } catch (e) {
                console.error('An error occured in getAllAppImageUrls');
                console.log(e);
            }

            res.end(JSON.stringify({ urls }));
            next();
        });

        this.app = app;

        this.options.logger.info('[Server] Middleware bound', {
            route,
        });

        return this.app;
    }
}

export default Server;
