// @flow

import wayfindingController from './WayfindingController';
import mapController from '../MapController';

class SelectionController {
    constructor() {
        this.awm = null;
        this.onClickEvent = null;
        this.current = null;
        this.locked = false;
    }

    init(awm) {
        this.awm = awm;
        return this;
    }

    setEvent(event) {
        this.onClickEvent = event;
    }

    getEvent() {
        return this.onClickEvent;
    }

    onClick() {
        const { intersects } = this.onClickEvent;
        if (intersects.length === 0) {
            this.updateSelection(null);
            return;
        }

        const firstIntersect = intersects[0];
        if (firstIntersect.object.isBuilding || firstIntersect.object.isSpace) {
            this.updateSelection(firstIntersect.object);
        } else if (firstIntersect.object.isLabel) {
            // Special label behavior
            const labelParent = firstIntersect.object.parent;
            if (labelParent.isBuilding || labelParent.isSpace) {
                // Prefer select the parent
                this.updateSelection(labelParent);
            } else {
                this.updateSelection(firstIntersect.object);
            }
        } else {
            this.updateSelection(null);
        }
    }

    updateSelection(object) {
        if (this.locked || object === this.current) {
            return;
        }

        // Make sure to unselect previously selected
        if (this.current !== null && this.current.isBuilding) {
            this.resetBuilding(this.current);
        } else if (this.current !== null && this.current.isSpace) {
            this.resetSpace(this.current);
        }

        this.current = object;

        if (this.current !== null && this.current.isBuilding) {
            this.locked = true;
            this.highlightBuilding(this.current)
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current !== null && this.current.isSpace) {
            this.locked = true;
            this.highlightSpace(this.current)
                .then(() => mapController.setDeviceIdCustom(1082)) // TODO Customize for decathlon
                .then(() => wayfindingController.goTo(this.current)) // TODO
                .then(() => {
                    this.locked = false;
                });
        } else if (this.current !== null && this.current.isLabel) {
            this.locked = true;
            this.highlightLabel(this.current)
                .then(() => mapController.setDeviceIdCustom(1082)) // TODO Customize for decathlon
                .then(() => wayfindingController.goTo(this.current)) // TODO
                .then(() => {
                    this.locked = false;
                });
        }
    }

    highlightBuilding(building) {
        return this.awm.cameraManager.centerOn(building)
            .then(() => {
                building.setColor(0x78e08f);
            });
    }

    resetBuilding(building) {
        building.resetColor();
    }

    highlightSpace(space) {
        // return this.awm.cameraManager.centerOn(space)
        return Promise.resolve()
            .then(() => {
                space.setColor(0x78e08f);
                space.bounceUp(3);
            });
    }

    highlightLabel(label) {
        return this.awm.cameraManager.centerOn(label);
    }

    resetSpace(space) {
        space.resetColor();
        space.bounceDown();
    }
}

const selectionController = new SelectionController();
export default selectionController;
