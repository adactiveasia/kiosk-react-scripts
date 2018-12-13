// @flow

export type ConfigType = {|
    siteId: number,
    map: {|
        deviceId: number,
    |},
    api: {|
        endpoint: string,
        site: number,
        username: string,
        key: string,
    |},
    analytics: {|
        endpoint: string,
        device: number,
        site: number,
        zone: string,
        token: string,
    |},
|};

class Config {
    config: ?ConfigType;

    site: ?number;

    initPromise: *;
    resolve: *;
    reject: *;

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
            .then(() => { this.resolve(); })
            .catch((e) => {
                this.reject(e);
                throw e;
            });
    }

    async doInit(siteId: ?number = null): Promise<void> {
        this.site = siteId;

        const configFile = this.site ? `/configs/${this.site}/config.json` : '/config.json';

        try {
            console.groupCollapsed('Config file');

            console.log('Config file path: ', configFile);

            const response = await fetch(configFile);
            this.config = await response.json();

            console.log('Config file json: ', this.config);

            console.groupEnd();
        } catch (e) { throw Error(`Config: unable to find '${configFile}' file`); }

        if (!this.config) throw Error('Config is empty');

        if (this.site && this.config.siteId !== this.site) {
            throw Error(`Config: '${configFile}' file is not for siteId '${this.site}'`);
        }
    }
}

const config: Config = new Config();
export default config;
