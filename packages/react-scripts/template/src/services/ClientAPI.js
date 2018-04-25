import { DistCacheManager, EntityManager } from '@adactive/adsum-client-api';
import deviceConfig from './Config';

class ClientAPI {
    constructor() {
        this.entityManager = null;
    }

    async init() {
        await deviceConfig.init();
        const { endpoint, key, site, username } = deviceConfig.config;
        const cacheManager = new DistCacheManager('//localhost:9001/local');
        this.entityManager = new EntityManager({
            endpoint,
            site,
            username,
            key,
            cacheManager
        });
	}
}

const clientApi = new ClientAPI();
export default clientApi;