
class Config {
    constructor() {
        this.config = null;
    }

    async init () {
        const response = await fetch('http://localhost:9001/deviceConfig');
        this.config = await response.json();
    }

}

const config = new Config();
export default config;
