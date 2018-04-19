import AbstractOptions from "./AbstractOptions";
import check from "check-types";

import { CacheOptions } from "@adactive/adsum-client-api";

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

        if (json.logger === null) {
            json.logger = this.logger;
        }

        this.fromJSON(json);

        let args = process.argv.slice(2);
        if (args.length > 0) {
            this.extractArgument("jsonConfigFile", args);
            this.extractArgument("data_folder", args);
            this.extractArgument("port", args);
        }

        this.jsonConfig = {};
        this.readAppConfig();

        this.config = {
            site: this.jsonConfig.site,
            device: this.jsonConfig.device
        };

        this.hostname = 'localhost';
        this.port = 8080;

        this.setCacheOptions(json);

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

    readAppConfig() {
        let jsonConfig = null;

        try {
          jsonConfig = require(this.jsonConfigFile);
        } catch (e) {
          if (e) throw new Error(`Unable to read json config file at ${this.jsonConfigFile}`);
        }

        this.jsonConfig.site = jsonConfig.api.site;
        this.jsonConfig.device = jsonConfig.map.deviceId;
        this.jsonConfig.key = jsonConfig.api.key;
        this.jsonConfig.endpoint = jsonConfig.api.endpoint;
    }

    setCacheOptions(json) {
      this.cache = new CacheOptions(
        Object.assign({}, this.jsonConfig)
      );
    }

    reset() {
        super.reset();

        /**
         *
         * @type {string}
         * @default "./config.json"
         */
        this.jsonConfigFile = "./config.json";

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
         * @type {CacheOptions}
         */
        this.cache = new CacheOptions();

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
            error (...args) {
                return this.log("error", ...args);
            },
            warn (...args) {
                return this.log("warn", ...args);
            },
            info (...args) {
                return this.log("info", ...args);
            },
            verbose (...args) {
                return this.log("verbose", ...args);
            },
            debug (...args) {
                return this.log("debug", ...args);
            },
            silly (...args) {
                return this.log("silly", ...args);
            }
        };
    }

    /**
     * @inheritDoc
     */
    validate() {
        const errors = super.validate();

        if (check.not.nonEmptyString(this.jsonConfigFile)) {
            errors.jsonConfigFile = "Should be a non empty string";
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
