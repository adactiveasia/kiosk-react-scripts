import { SCENE_EVENTS, DISPLAY_MODE  } from '@adactive/adsum-web-map';

class SceneController {
    constructor() {
        this.awm = null;
        this.currentFloor = null;
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    getAllFloors() {
        return this.awm.objectManager.floors;
    }

    getAllBuildings() {
        return this.awm.objectManager.buildings;
    }

    getCurrentFloor() {
        return this.awm.sceneManager.getCurrentFloor();
    }

    setCurrentFloor(floorID) {
        const floorObject = floorID === null ? null : this.awm.objectManager.floors.get(floorID);
        //return this.awm.sceneManager.setCurrentFloor(floorObject);
        return this.setCurrentFloorCustom(floorObject);
    }

    setCurrentFloorCustom(floor, animated = true) {
        if (floor === this.currentFloor) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                if (animated) {
                    console.warn('AdsumWebMap.SceneManager.setCurrentFloor: animated parameter is not supported yet');
                }

                if (this.currentFloor === null) {
                    //this.awm.objectManager.site.setDisplayMode(DISPLAY_MODE.TRANSPARENT);
                    this.awm.objectManager.buildings.forEach((building) => {
                        //building.setDisplayMode(DISPLAY_MODE.TRANSPARENT);
                    });
                } else {
                    this.currentFloor.setDisplayMode(DISPLAY_MODE.NONE);
                }

                if (floor === null) {
                    this.awm.objectManager.site.setDisplayMode(DISPLAY_MODE.VISIBLE);
                    this.awm.objectManager.buildings.forEach((building) => {
                        building.setDisplayMode(DISPLAY_MODE.VISIBLE);
                    });
                } else {
                    //floor.setDisplayMode(DISPLAY_MODE.VISIBLE);
                }

                const previous = this.currentFloor;
                this.currentFloor = floor;

                this.awm.sceneManager.currentFloor = floor; // TODO

                this.awm.sceneManager.dispatchEvent(
                    {
                        type: SCENE_EVENTS.floor.didChanged,
                        previous,
                        current: floor,
                    },
                );

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }
}

const sceneController = new SceneController();
export default sceneController;