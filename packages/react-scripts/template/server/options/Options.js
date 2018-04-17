import AbstractOptions from "./AbstractOptions";
import check from "check-types";
import xml2js from "xml2js";
import fs from "fs";

import {ProxyOptions as APAProxyOptions } from "adsum-proxy-api";
import {ServerOptions as APAServerOptions } from "adsum-proxy-api";
import {ProxyOptions as APANProxyOptions } from "adsum-proxy-analytics";
import {ServerOptions as APANServerOptions } from "adsum-proxy-analytics";

/**
 * @extends AbstractOptions
 */
class Options extends AbstractOptions {

    /**
     * construct a new ServerOptions object using the json value
     * @param {Object} [json={}]
     */
    constructor(json = {}) {

        super();

        if(json.logger === null){
            json.logger = this.logger;
        }

        this.fromJSON(json);

        let args = process.argv.slice(2);
        if(args.length > 0){
            this.extractArgument("xml_file", args);
            this.extractArgument("data_folder", args);
            this.extractArgument("port", args);
        }

        this.xml = {};
        this.parseXmlFile();

        this.config = {
            site: this.xml.site,
            device: this.xml.device
        };
        
        this.setApiOptions(json);
        this.setAnalyticsOptions(json);

        Object.seal(this);
    }

    extractArgument(name, args) {
        let index = args.indexOf(`--${name}`);
        if (index !== -1) {
            // The value is the next one argument, else true (if there this is a boolean option)
            let value = args.length === index + 1 ? true : args[index + 1];

            // This is a boolean option
            if (typeof value === 'string' && value.charAt(0) === '-' && value.charAt(1) === '-') {
                value = true;
            }

            if (this.hasOwnProperty(name)) {
                if(name === 'port'){
                    this[name] = parseInt(value);
                } else {
                    this[name] = value;
                }
            }
        }
    }

    parseXmlFile(){
        let xml_raw = fs.readFileSync(this.xml_file, 'utf8');
        xml2js.parseString(xml_raw, (err, result) => {
            if (err) throw new Error(`Unable to parse xml config file at ${this.xml_file}`);

            this.xml.site = parseInt(result.Adsum.siteId[0]);
            this.xml.device = parseInt(result.Adsum.kioskId[0]);
            this.xml.key = result.Adsum.APIKEY[0];
            this.xml.endpoint = result.Adsum.WSURL[0].replace(/([0-9]+\.[0-9]+)(\/)?$/, '').replace(/^http(s)?/, 'https').replace(/.$/,'');
            this.xml.analyticsSite = parseInt(result.Adsum.PIWIKSITEID[0]);
            this.xml.distAnalyticsEndpoint = result.Adsum.PIWIKURL[0].replace(/([0-9]+\.[0-9]+)(\/)?$/, '').replace(/^http(s)?/, 'https');
            this.xml.analyticsToken = result.Adsum.PIWIKKEY[0];
        });
    }

    setApiOptions(json){
        const options = new APAProxyOptions({
            ...this.api,
            site: this.xml.site,
            server: {
                hostname: this.hostname,
                port: parseInt(this.port),
                route: '/local-api'
            },
            updater: {
                ...this.api.updater,
                username: `${this.xml.device}-device`,
                key: this.xml.key,
                endpoint: this.xml.endpoint
            },
            storage: {
                ...this.api.storage,
                folder: this.data_folder
            }
        });

        if(json.api && json.api.server){
            console.log('API proxy server have been defined, the server will use it');
            options.server = new APAServerOptions(this.api.server);
        }

        if(this.api.logger !== null && this.api.logger !== undefined){
            options.logger = this.api.logger;
        }

        this.api = options;

        this.config.api = {
            endpoint: `http://${this.api.server.hostname}:${this.api.server.port}${this.api.server.route}`,
            username: this.api.updater.username,
            key: this.api.updater.key,
            remoteEndpoint: this.xml.endpoint
        };
    }

    setAnalyticsOptions(json){
        const options = new APANProxyOptions({
            site: this.xml.site,
            device: this.xml.device,
            server: {
                hostname: this.hostname,
                port: parseInt(this.port),
                route: '/local-analytics'
            },
            analytics: {
                site: this.xml.analyticsSite,
                key: this.xml.analyticsToken,
                endpoint: this.xml.distAnalyticsEndpoint
            },
            storage: {
                folder: this.data_folder,
                ...this.analytics.storage
            }
        });

        if(json.analytics && json.analytics.server){
            console.log('Analytics proxy server have been defined, the server will use it');
            options.server = new APANServerOptions(this.analytics.server);
        }

        if(this.analytics.logger !== null && this.analytics.logger !== undefined){
            options.logger = this.analytics.logger;
        }

        this.analytics = options;

        this.config.analytics = {
            endpoint: `http://${this.analytics.server.hostname}:${this.analytics.server.port}${this.analytics.server.route}`,
            site: this.analytics.analytics.site,
            key: this.analytics.analytics.key,
            remoteEndpoint: this.xml.distAnalyticsEndpoint
        };
    }

    reset() {
        super.reset();

        /**
         *
         * @type {string}
         * @default "./config.xml"
         */
        this.xml_file = "./config.xml";

        /**
         *
         * @type {string}
         * @default "./local"
         */
        this.data_folder = "./local";

        /**
         *
         * @type {Number}
         * @default 8080
         */
        this.port = 8080;

        /**
         *
         * @type {string}
         * @default "localhost"
         */
        this.hostname = "localhost";

        /**
         *
         * @type {string}
         * @default "/"
         */
        this.route = "";

        /**
         *
         * @type {string}
         * @default "./"
         */
        this.path = "./";

        /**
         *
         * @type {APA.ProxyOptions}
         */
        this.api = new APAProxyOptions();

        /**
         *
         * @type {APAN.ProxyOptions}
         */
        this.analytics = new APANProxyOptions();

        /**
         * A logger instance
         * @type {{log: (function(string, string, *)), error: (function(string, string, *)), warn: (function(string, string, *)), info: (function(string, string, *)), verbose: (function(string, string, *)), debug: (function(string, string, *)), silly: (function(string, string, *))}}
         */
        this.logger = {
            log (level, msg, context){
                console.log(`[${level}]: ${msg}`);
                if (context) {
                    console.log(context);
                }
            },
            error (...args){
                return this.log("error", ...args);
            },
            warn (...args){
                return this.log("warn", ...args);
            },
            info (...args){
                return this.log("info", ...args);
            },
            verbose (...args){
                return this.log("verbose", ...args);
            },
            debug (...args){
                return this.log("debug", ...args);
            },
            silly (...args){
                return this.log("silly", ...args);
            }
        };
    }

    /**
     * @inheritDoc
     */
    validate() {
        const errors = super.validate();

        if (check.not.nonEmptyString(this.xml_file)) {
            errors.xml_file = "Should be a non empty string";
        }

        if (check.not.nonEmptyString(this.data_folder)) {
            errors.data_folder = "Should be a non empty string";
        }

        if (check.not.positive(this.port) || check.not.integer(this.port)) {
            errors.port = "Should be a positive integer";
        }

        if (check.not.nonEmptyString(this.hostname)) {
            errors.hostname = "Should be a non empty string";
        } else {
            // Remove trailing slash
            this.hostname = this.hostname.replace(/\/$/, "");
        }

        if (check.not.nonEmptyString(this.path)) {
            errors.path = "Should be a non empty string";
        }

        if (check.not.object(this.logger)) {
            errors.logger = "Should be an object";
        } else {
            const loggerError = {};
            for (const level of ["error", "warn", "info", "verbose", "debug", "silly", "log"]) {
                if (check.not.function(this.logger[level])) {
                    loggerError[level] = "Should be a function";
                }
            }

            if (Object.keys(loggerError).length > 0) {
                errors.logger = loggerError;
            }
        }

        return errors;
    }
}

export default Options;
