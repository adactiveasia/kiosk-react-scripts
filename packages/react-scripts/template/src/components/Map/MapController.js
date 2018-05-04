import { AdsumWebMap, AdsumLoader, DISPLAY_MODE  } from '@adactive/adsum-web-map';
import * as three from 'three';
import ACA from "../../services/ClientAPI";
import deviceConfig from '../../services/Config';

import sceneController from './controllers/SceneController';
import selectionController from './controllers/SelectionController';
import wayfindingController from './controllers/WayfindingController';
import timeController from './controllers/TimeController';

import LightsBuilder from "./lights/LightsBuilder";
import LightsBuilderOptions from "./lights/LightsBuilderOptions";

import ObjectsLoader from "./objectsLoader/ObjectsLoader";

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
            shadowEnabled: true,
            advancedLightingEnabled: ()=> {return true}
        });
        // Create the Map instance
        this.awm = new AdsumWebMap({
            loader: this.adsumLoader, // The loader to use
            engine: {
                container: document.getElementById('adsum-web-map-container'), // The div DOMElement to insert the canvas into
                shadowEnabled: true,
            },
            wayfinding: {
                patternSpace: 1,
                patternSize: 0.5,
                createPathPattern: wayfindingController.createPathPattern.bind(wayfindingController)
            }
        });



        window.awm = this.awm;
        window.three = three;
        window.THREE = three;

        // Init the Map
        return this.awm.init().then(() => {

            sceneController.init(this.awm);
            selectionController.init(this.awm);
            wayfindingController.init(this.awm);  // TODO ASYNC
            timeController.init(this.awm);
            this.objectsLoader = new ObjectsLoader(this.awm);

            console.log('AdsumWebMap is ready to start');

            /*------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            const backgroundTextureLoader = new three.TextureLoader();
            backgroundTextureLoader.crossOrigin = '';
            const backgroundTexture = backgroundTextureLoader.load('assets/textures/background.png');
            backgroundTexture.wrapS = three.RepeatWrapping;
            backgroundTexture.wrapT = three.RepeatWrapping;
            backgroundTexture.repeat.set(1,1);
            this.awm.sceneManager.scene.background = backgroundTexture;

            const lightsToRemove = [];
            for(const child of this.awm.sceneManager.scene.children){
                if(child.isLight){
                    lightsToRemove.push(child);
                }
            }

            for(const lightToRemove of lightsToRemove) {
                this.awm.sceneManager.scene.remove(lightToRemove);
            }

            const lightsBuilderOptions = new LightsBuilderOptions();

            const lightBuilder = new LightsBuilder(lightsBuilderOptions);

            for(const light of lightBuilder.build()){
                this.awm.sceneManager.scene.add(light);
                light.updateMatrixWorld();
            }

            const loader = new three.TextureLoader();
            loader.crossOrigin = '';
            const texture = loader.load('assets/textures/ground.png');

            texture.wrapS = three.RepeatWrapping;
            texture.wrapT = three.RepeatWrapping;
            texture.repeat.set(20,20);

            this.awm.objectManager.site._mesh.material = new three.MeshPhongMaterial({
                color: 0xe7b66d,
                shininess: 3,
                specular: 0xe2a245,
                map: texture,
                side: three.DoubleSide
            });

            this.objectsLoader.createJSON3DObj('assets/3dModels/painted.json').then(
                (basketball) => {
                    const basketballClone = this.objectsLoader.add3DObjectOnFloor(null, new three.Vector3(-200,500,8), basketball.clone());
                    basketballClone.scale.set(35, 35, 35);
                    //window.foo = basketballClone;

                    for(const child of basketballClone.children) {
                        if(!child.isLight) {
                            child.castShadow = true;
                        }
                    }

                    basketballClone.updateMatrixWorld();
                }
            );

            this.buildingOpacity();

            this.awm.objectManager.spaces.forEach(
                (space)=>{
                    if(space.isSpace) {
                        this._wireFrameAShape(space, 0, 0x5a5b5a);
                        space._mesh.material.specular = new three.Color(0x53adc6);
                        space._mesh.material.shininess = 5;
                    }
                }
            );
            /*------------------------------------ PROJECT SPECIFIC  --------------------------------------------*/

            // Start the rendering
            return this.awm.start();
        });
    }

    setDeviceIdCustom(deviceId, animated = true) {
        this.awm.deviceId = deviceId;
        this.awm.defaultFloor = null;

        return this.awm.loader.loadCalibration(this.awm.deviceId)
            .then(({ cameraCalibrations, defaultFloorId, userPosition }) => {
                if (userPosition !== null) {
                    if (userPosition.floorId === null) {
                        this.awm.wayfindingManager.setUserAdsumPosition(
                            userPosition.position,
                            null,
                            true,
                        );
                    } else {
                        this.awm.wayfindingManager.setUserAdsumPosition(
                            userPosition.position,
                            this.awm.objectManager.getFloor(userPosition.floorId),
                            true,
                        );
                    }
                }

                this.awm.cameraManager.setCameraCalibrations(cameraCalibrations);
                if (defaultFloorId !== null) {
                    this.awm.defaultFloor = this.awm.objectManager.getFloor(defaultFloorId);
                }

                return sceneController.setCurrentFloorCustom(this.awm.defaultFloor, animated); // TODO Customize for decathlon
            })
            .then(() => {
                return this.awm.cameraManager.centerOnFloor(this.awm.defaultFloor, animated);
            })
            .then(() => {}); // Ensure void result
    }

    buildingOpacity() {
        this.awm.objectManager.buildings.forEach(
            (building)=>{
                building.setDisplayMode(DISPLAY_MODE.TRANSPARENT);
                building.floors.forEach(
                    (f)=>{
                        f.setDisplayMode(DISPLAY_MODE.TRANSPARENT);
                        for(const child of f._mesh.children){
                            if(child.name === "ExtrudeMesh") {
                                child.visible = false;
                            }
                        }
                    }
                )

            }
        )
    }

    _wireFrameAShape(space, opacity = 0.7, matColor = null, needBoundingBox = false) {

        const geo = new three.EdgesGeometry( space._mesh.geometry ); // or WireframeGeometry
        const mat = new three.LineBasicMaterial( { color: matColor, linewidth: 1 } );
        const wireFrame = new three.LineSegments( geo, mat );
        space._mesh.add( wireFrame );
    }

    /*------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     */
    switchMode(mode) {
        /*if (mode === "3D") {
            return this.awm.cameraManager.switchTo3D();
        } else if (mode === "2D") return this.awm.cameraManager.switchTo2D();*/
    }
}
const mapController = new MapController();
export default mapController;
