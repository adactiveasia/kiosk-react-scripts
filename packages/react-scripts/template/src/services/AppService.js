// @flow

import _ from 'lodash';

class AppService {
    constructor() {
        this.appImages = [];
    }

    preloadAppImages() {
        console.log('Fetching Image Urls for preloading...');
        return fetch('/getAllAppImageUrls')
            .then(response => response.json())
            .then((data) => {
                this.appImages = _.map(data.urls, (url) => {
                    const image = new Image();

                    image.src = url;

                    return image;
                });
                console.log('All images have been preloaded.');
            })
            .catch((e) => {
                console.log(e);
            });
    }
}

const appService = new AppService();
export default appService;
