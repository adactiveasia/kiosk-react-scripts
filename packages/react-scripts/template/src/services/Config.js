// @flow

class Config {
    constructor() {
        this.config = null;
        this.fallbackOnlineApi = false;
    }

    async init(): Promise<void> {
        const response = await fetch('http://localhost:9001/deviceConfig')
            .catch(() => {
                this.fallbackOnlineApi = true;
            });
        if (response && !this.fallbackOnlineApi) {
            this.config = await response.json();
        } else if (this.fallbackOnlineApi) {
            console.error("YOU NEED TO SET YOUR CONFIG");
            this.config = {
                /*endpoint: 'https://asia-api.adsum.io',
                site: 235,
                device: 163,
                username: '163-device',
                key: '357c5063c8b63ba7bf3f5016aece430e5327fd5b2dc852534ead445fa69d0b93'*/
            };
        }
    }
}

const config = new Config();
export default config;
