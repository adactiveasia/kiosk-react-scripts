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
}

const sceneController = new SceneController();
export default sceneController;