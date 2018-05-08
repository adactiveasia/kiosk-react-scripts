// @flow

import { AdsumWebMap, AdsumLoader, DISPLAY_MODE } from '@adactive/adsum-web-map';
import * as three from 'three';
import ACA from '../../../services/ClientAPI';
import deviceConfig from '../../../services/Config';

import sceneController from './SceneController';
import selectionController from './SelectionController';
import wayfindingController from './WayfindingController';
import timeController from './TimeController';

import ObjectsLoader from '../objectsLoader/ObjectsLoader';

import customDotPathBuilder from '../path/CustomDotPathBuilder';

/**
 * @memberof module:Map
 * @class
 * Map controller
 */
class MapController {
    /**
     * Initial settings for map
     */
    constructor() {
        this.awm = null;
        this.objectsLoader = null;
    }
    /**
     * Initializing of map
     */
    init() {
        const { device } = deviceConfig.config;
        this.adsumLoader = new AdsumLoader({
            entityManager: ACA.entityManager, // Give it in order to be used to consume REST API
            deviceId: device, // The device Id to use
        });
        // Create the Map instance
        this.awm = new AdsumWebMap({
            loader: this.adsumLoader, // The loader to use
            engine: {
                container: document.getElementById('adsum-web-map-container'), // The div DOMElement to insert the canvas into
            },
            wayfinding: {
                pathBuilder: customDotPathBuilder
            }
        });


        window.awm = this.awm;
        window.three = three;
        window.THREE = three;

        // Init the Map
        return this.awm.init().then(() => {
            sceneController.init(this.awm);
            selectionController.init(this.awm);
            timeController.init(this.awm);
            this.objectsLoader = new ObjectsLoader(this.awm);
            return wayfindingController.init(this.awm);
        }).then(() => {


            console.log('AdsumWebMap is ready to start');

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            const backgroundTextureLoader = new three.TextureLoader();
            backgroundTextureLoader.crossOrigin = '';
            const backgroundTexture = backgroundTextureLoader.load('assets/textures/background.png');
            backgroundTexture.wrapS = three.RepeatWrapping;
            backgroundTexture.wrapT = three.RepeatWrapping;
            backgroundTexture.repeat.set(1, 1);
            this.awm.sceneManager.scene.background = backgroundTexture;

            /* ------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            // Start the rendering
            return this.awm.start();
        });
    }

    /* ------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     */
    switchMode(mode) {
        /* if (mode === "3D") {
            return this.awm.cameraManager.switchTo3D();
        } else if (mode === "2D") return this.awm.cameraManager.switchTo2D(); */
    }
}
const mapController = new MapController();
export default mapController;
