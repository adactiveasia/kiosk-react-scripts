class SceneController {
    constructor() {
        this.awm = null;
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
        return this.awm.sceneManager.setCurrentFloor(floorObject);
    }
}

const sceneController = new SceneController();
export default sceneController;