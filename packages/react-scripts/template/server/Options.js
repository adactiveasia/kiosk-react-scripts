import { AbstractOptions } from '@adactive/adactive-abstract-options';
import check from "check-types";
import path from "path";
import fs from 'fs-extra';

import { CacheOptions } from "@adactive/adsum-client-api";

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

        this.config = Object.assign({}, this.jsonConfig);

        this.hostname = 'localhost';

        this.setCacheOptions(json);

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
        try {
            const jsonConfig = fs.readJsonSync(path.resolve(`${this.jsonConfigFile}`))
            this.jsonConfig.site = jsonConfig.api.site;
            this.jsonConfig.device = jsonConfig.map.deviceId;
            this.jsonConfig.key = jsonConfig.api.key;
            this.jsonConfig.endpoint = jsonConfig.api.endpoint;
            this.jsonConfig.username = jsonConfig.api.username;
        } catch (err) {
            if (err) 
                throw new Error(`Unable to read json config file at ${this.jsonConfigFile}`,err);
        }
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
}

export default Options;
