import { DistCacheManager, EntityManager } from '@adactive/adsum-client-api';

class ClientAPI {
    constructor() {
        this.entityManager = null;

        //const cacheManager = new DistCacheManager('//localhost:9001/local/');

        const entityManager = new EntityManager({
			endpoint: "https://asia-api.adsum.io",
	        site: 339,
	        username: "1056-device",
	        key: "b6e8e6eaf2c7ff66b783e7721a57ed62f204c3bc3a68b729c1ea3a90a7c1e828",
			//cacheManager,
		});

		/*// Load the data
		entityManager.load().then(() => {
		  // Retrieve the data you need there
		  const pois = entityManager.getRepository('Poi').getAll();
		});*/
    }
}

const clientApi = new ClientAPI();
export default clientApi;