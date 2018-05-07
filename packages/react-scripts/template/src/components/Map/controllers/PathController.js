// @flow

import { Path } from '@adactive/adsum-web-map';

class PathController {
    constructor() {
        this.awm = null;
        this.current = null;
        this.locked = false;
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    goTo(object) {
        if (this.current !== null) {
            // Remove previously drawn paths
            this.awm.wayfindingManager.removePath(this.current);
        }

        // Get the object location
        const location = this.awm.wayfindingManager.locationRepository.get(object.placeId);

        // Create path from user location (null) and object location
        this.current = new Path(null, location);

        // Compute the path to find the shortest path
        return this.awm.wayfindingManager.computePath(this.current)
            .then(() => {
            // The path is computed, and we have now access to path.pathSections which represents all steps
            // We will chain our promises
                let promise = Promise.resolve();
                for (const pathSection of this.current.pathSections) {
                // Do the floor change
                    const floor = pathSection.ground.isFloor ? pathSection.ground : null;
                    promise = promise.then(() => this.awm.sceneManager.setCurrentFloor(floor));
                    promise = promise.then(() => this.awm.cameraManager.centerOnFloor(floor));

                    // Draw the step
                    promise = promise.then(() => this.awm.wayfindingManager.drawPathSection(pathSection));

                    // Add a delay of 1.5 seconds
                    promise = promise.then(() => new Promise((resolve) => {
                        setTimeout(resolve, 1500);
                    }));
                }

                return promise;
            });
    }
}

const pathController = new PathController();
export default pathController;
