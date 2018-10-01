// @flow

class Config {
    constructor() {
        this.config = null;
        this.site = null;

        this.initPromise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    async wait(): Promise<void> {
        return this.initPromise;
    }

    async init(siteId: ?number = null): Promise<void> {
        return this.doInit(siteId)
            .then(() => {
                this.resolve();
            })
            .catch((e) => {
                this.reject(e);
            });
    }

    async doInit(siteId: ?number = null): Promise<void> {
        this.site = siteId;

        const configFile = this.site ? `/configs/${this.site}/config.json` : '/config.json';
        try {
            console.log('Checking config file path: ', configFile);
            const response = await fetch(configFile);

            this.config = await response.json();

            console.log('Trying to get config: ', this.config);
        } catch (e) {
            console.error('Unable to get config: ', e);

            throw new Error(`Config.js: unable to find ${configFile} file`);
        }

        if (this.site !== null && this.config.siteId !== this.site) {
            throw new Error(`Config.js: ${configFile} file is not for siteId ${this.site}`);
        }
    }
}

const config = new Config();
export default config;
