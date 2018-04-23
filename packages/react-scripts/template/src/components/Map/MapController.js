import { AdsumWebMap, AdsumLoader } from '@adactive/adsum-web-map';
import ACA from "../../services/ClientAPI";
//import config from "../services/Config";

/**
 * @memberof module:Map
 * @class
 * Map controller
 */
class MapController {

    /*------------------------------------ FUNCTIONS: INITIALIZING MAPCONTROLLER  --------------------------------------------*/

    /**
     * Average pedestrain speed
     * Dimension is 3d units per minute
     * @type {number}
     */
    PEDESTRAIN_SPEED = 433;

    /**
     * Initial settings for map
     */
    constructor() {
        this.awm = null;
        this._selectedShape = null;
        this._selectedPlace = null;

        this._infoDisplay = null;
        this._mapControls = null;

        this._navigationManager = null;
        this._currentStep = null;
        this._currentSection = null;

        this._sortedPlaces = [];
        this._floorSelecter = null;

        this._floors = null;
        this._floorAnchors = null;
        this._defaultColors = null;
        this._libPath = null;
        this._3dAssetsPath = null;
        this._pathInfos = null;
        this._targetPlace = null;

        this._infoDisplayPosition = null;
        this._pmrMode = true;

        this._currentPath = null;
        this._blockDrawing = false;

        /*
         * Basic map usage and features
         */
        this.awmOptions = {
            container: "adsum-web-map-container",
            deviceId: 1056,  // TODO
            shapesOptions: {
                mouseOverEnabled: true,
                smoothColorTransitionsEnabled: false,
                bounceEnabled: true
            },
            floorsOptions: {
                showFloorsUnder: true,
                useFloorAnimations: true
            },
            pathsOptions: {
                scaleRatio: 5,
                patternSpace: 20,
                speedRatio: 1
            },

            positionIndicatorOptions: {
                scaleRatio: 2
            },

            cameraOptions: {
                mode: "3D",
                zoomEnabled: true,
                rotationEnabled: true
            },
            rendererOptions: {
                backgroundImage: 'assets/img/map-background.png',
                advancedLightingEnabled: false,
                groundAmbientOcclusionEnabled: true,
                siteAmbientOcclusionEnabled: true,
                clearColor: 0xFDF8F8,
                fogRatio: 0
            }
        };

        this.awmOptions.entityManager = ACA.entityManager;

    }
    /**
     * Initializing of map
     */
    init() {
       /* this.awm = new AdsumWebMap(this.awmOptions);

        this.awm.dataManager.events.dataWillLoad.add((progress) => {
            console.log("Progress : " + progress);
        }, this);

        this.awm.dataManager.events.dataDidLoad.add(this.onReady, this);
        this.awm.init();*/
    }

    /**
     * Executed upon successful inititalization
     */
    onReady() {
        /*this.isReady = true;
        this.awm.pathManager.setPathPatternObject('assets/path_default.json');
        this.awm.pathManager.setStartPointObject('assets/youarehere.json');
        this.awm.pathManager.setStartPointPedestal('assets/img/location.png', 20, 20);

        this.sortAllPlaces().then((places) => {
            this._sortedPlaces = places
        });
        this.initMapEvents();
        this._buildingsList = this.getAllBuildings();

        if(this._buildingsList.length > 1) {
            this._buildingsList.push({
                id: -1,
                name: "Site view",
                floorList: []
            });
            this.setSiteView();
        }

        store.dispatch(mapActions.initiateFloors(this.getCurrentFloor(),this._buildingsList));*/
    }




    /*------------------------------------ FUNCTIONS: BEHAVIOUR TO EXECUTE FOR CLICK/HOVER BEHAVIOURS  --------------------------------------------*/

    /**
     * Binding map actions to execute upon user interaction with map
     */
    initMapEvents() {

        /*this.awm.mapManager.events.void.mouseClick.add(this.onClickOut, this);
        this.awm.mapManager.events.floor.willChange.add(this.onFloorChanged, this);
        this.awm.mapManager.events.floor.didChange.add(this.onFloorDidChange, this);
        this.awm.mapManager.events.building.mouseClick.add(this.onBuildingClicked, this);
        this.awm.mapManager.events.building.mouseEnter.add(this.onBuildingOver, this);
        this.awm.mapManager.events.building.mouseLeave.add(this.onBuildingLeave, this);
        this.awm.mapManager.events.shape.mouseEnter.add(this.onShapeOver, this);
        this.awm.mapManager.events.shape.mouseLeave.add(this.onShapeLeave, this);
        this.awm.mapManager.events.shape.mouseClick.add(this.onMapPlaceClicked, this);
        this.awm.mapManager.events.label.mouseClick.add(this.onMapPlaceClicked, this);
        this.awm.mapManager.events.picto.mouseClick.add(this.onPictoClicked, this);

        this.awm.cameraManager.events.move.add(this.onCameraMove, this);*/
    }


    /*------------------------------------ FUNCTIONS: MAP CONTROL  --------------------------------------------*/

    /**
     * View switch between 2D and 3D
     * @param mode {string} mode view
     */
    switchMode(mode) {
        if (mode === "3D") {
            this.awm.cameraManager.switchTo3D();
        } else if (mode === "2D") this.awm.cameraManager.switchTo2D();
    }
}
const mapController = new MapController();
export default mapController;
