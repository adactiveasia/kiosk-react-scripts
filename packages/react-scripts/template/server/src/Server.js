import http from 'http';
import compression from 'compression';
import express from 'express';
import serveStatic from 'serve-static';
import cors from 'cors';

import { TrackingAppProxy } from '@adactive/adsum-client-analytics';

import Options from './Options';

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

        this.proxyAnalytics = new TrackingAppProxy({
            prefix: '/analytics',
        });
    }

    start() {
        return this.createServer()
            .then(() => {
                this.options.logger.info('Server successfully started');

                return {
                    url: `http://${this.options.hostname}:${this.options.port}/`,
                    app: this.app,
                };
            })
            .catch((e) => {
                this.options.logger.error('Server failed to start !');

                return Promise.reject(e);
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

    /**
     * Separate this in order to be used by webpack dev server
     * @param app
     */
    bindApis(app) {
        this.proxyAnalytics.bind(app);
        this.proxyAnalytics.start(this.options.production ? 3600 * 1000 : 1000);

        // app.use('/getAllAppImageUrls', (req, res, next) => {
        //     const arrOfEntryPointsRelativeToPublicDir = [
        //         'assets/images',
        //         'local/bin',
        //     ];
        //
        //     let urls = [];
        //     try {
        //         urls = imageUrlsFetcher.getAllImageUrlsArr(
        //             arrOfEntryPointsRelativeToPublicDir,
        //             this.options.path,
        //         );
        //     } catch (e) {
        //         this.options.logger.error('An error occured in getAllAppImageUrls');
        //         console.error(e);
        //     }
        //
        //     res.end(JSON.stringify({ urls }));
        //     next();
        // });
    }

    bind(app = express()) {
        app.use(cors());
        app.use(compression());

        app.use('/', serveStatic(this.options.path, { maxAge: '1d' }));

        this.bindApis(app);

        this.app = app;

        return this.app;
    }
}

export default Server;
