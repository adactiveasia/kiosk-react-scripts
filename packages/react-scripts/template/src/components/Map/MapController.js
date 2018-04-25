import { AdsumWebMap, AdsumLoader } from '@adactive/adsum-web-map';
import ACA from "../../services/ClientAPI";
import deviceConfig from '../../services/Config';

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
    }
    /**
     * Initializing of map
     */
    init() {
        const { device } = deviceConfig.config;
        this.adsumLoader = new AdsumLoader({
            entityManager: ACA.entityManager, // Give it in order to be used to consume REST API
            deviceId: device // The device Id to use
        });
        // Create the Map instance
        this.awm = new AdsumWebMap({
            loader: this.adsumLoader, // The loader to use
            engine: {
                container: document.getElementById('adsum-web-map-container'), // The div DOMElement to insert the canvas into
            }
        });

        // Init the Map
        return this.awm.init().then(() => {
            console.log('AdsumWebMap is ready to start');

            // Start the rendering
            return this.awm.start();
        });
    }

    /**
     * Executed upon successful inititalization
     */
    onReady() {

    }

    /*------------------------------------ FUNCTIONS: BEHAVIOUR TO EXECUTE FOR CLICK/HOVER BEHAVIOURS  --------------------------------------------*/

    /**
     * Binding map actions to execute upon user interaction with map
     */
    initMapEvents() {

    }

    /*------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     */
    switchMode(mode) {
        if (mode === "3D") {
            return this.awm.cameraManager.switchTo3D();
        } else if (mode === "2D") return this.awm.cameraManager.switchTo2D();
    }
}
const mapController = new MapController();
export default mapController;
