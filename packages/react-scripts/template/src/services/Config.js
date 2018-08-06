// @flow
import queryString from 'query-string';

class Config {
    constructor() {
        this.config = null;

        const { site } = queryString.parse(window.location.search);

        this.site = parseInt(site, 10);

        if (Number.isNaN(this.site)) {
            this.site = null;
        }

        this.initPromise = null;
    }

    async init(): Promise<void> {
        if (this.initPromise !== null) {
            return this.initPromise;
        }

        this.initPromise = this.doInit();

        return this.initPromise;
    }

    async doInit(): Promise<void> {
        const configFile = this.site === null ? '/config.json' : `/configs/${this.site}/config.json`;
        try {
            const response = await fetch(configFile);

            this.config = await response.json();

            console.log(this.config);
        } catch (e) {
            console.error(e);

            throw new Error(`Config.js: unable to find ${configFile} file`);
        }

        if (this.site !== null && this.config.siteId !== this.site) {
            throw new Error(`Config.js: ${configFile} file is not for siteId ${this.site}`);
        }
    }
}

const config = new Config();
export default config;
