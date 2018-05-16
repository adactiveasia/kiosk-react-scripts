// @flow

import { DistCacheManager, EntityManager } from '@adactive/adsum-client-api';
import deviceConfig from './Config';

class ClientAPI {
    constructor() {
        this.entityManager = null;
    }

    async init() {
        await deviceConfig.init();
        const {
            endpoint, key, site, username
        } = deviceConfig.config;
        const cacheManager = new DistCacheManager('//localhost:9001/local');
        this.entityManager = new EntityManager({
            endpoint,
            site,
            username,
            key,
            cacheManager
        });
    }

    getTagBy(filter){

        return this.entityManager.getRepository("Tag").findBy(filter);

    }

    getPlaylistBy(filter){

        return this.entityManager.getRepository("Playlist").findBy(filter);

    }

    getFile(id){

        return this.entityManager.getRepository("File").get(id);

    }

    getMediasByPlaylistTag(tagName) {

        let medias = [];

        const tag = this.getTagBy({name: tagName});

        if(tag.length > 0) {

            const playlist = this.getPlaylistBy(

                {

                    tags: function (tags) {

                        return tags.has(tag[0])

                    }

                }

            );

            if (playlist.length > 0) {

                medias = this.entityManager.getRepository("Media").getList(playlist[0].medias.toJSON());



                for(let i in medias) {

                    medias[i].file = this.getFile(medias[i].file.value);

                }

            }

        }

        return medias;
    }

}

const clientApi = new ClientAPI();
export default clientApi;
