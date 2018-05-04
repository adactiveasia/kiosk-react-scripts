import { Tween, Easing } from 'es6-tween';

class PathSectionDrawer {
    constructor(pathSectionObject, cameraManager, projector) {
        /**
         * @package
         * @type {PathSectionObject}
         */
        this.pathSectionObject = pathSectionObject;

        /**
         * @package
         * @type {CameraManager}
         */
        this.cameraManager = cameraManager;

        /**
         * @package
         * @type {AdsumProjector}
         */
        this.projector = projector;

        /**
         * @package
         * @type {number}
         * @default 30
         */
        this.speed = 5; // m/s

        /**
         * @package
         * @default true
         * @type {boolean}
         */
        this.center = false; // TODO
        this.tweens = [];

    }

    /**
     *
     * @async
     *
     * @return {Promise<void, Error>}
     */
    draw() {
        const tasks = [];
        const patterns = this.pathSectionObject._mesh.children;
        for (let i = 0; i < patterns.length; i++) {
            const spaceInMeter = this.projector.adsumDistanceToMeter(this.pathSectionObject.patternSpace);
            const delay = spaceInMeter / this.speed * i * 1000;
            tasks.push(this._showPattern(i, delay));
        }

        this.pathSectionObject._mesh.visible = true;

        if (this.center) {
            tasks.push(this.cameraManager.centerOn(this.pathSectionObject));
        }

        this.pathSectionObject.animations.push(this);

        return Promise.all(tasks).then(() => {});
    }

    /**
     * @public
     */
    stop() {
        this.tweens.forEach((tween) => {
            tween.stop();
        });
    }

    /**
     * @private
     *
     * @param {int} index
     * @param {number} delay
     * @return {Promise<boolean, Error>}
     */
    _showPattern(index, delay) {
        /*------------------------------------ INIT --------------------------------------------*/
        const pattern = this.pathSectionObject._mesh.children[index];

        const opacityHandler = {
            opacity: 0,
        };
        const positionHandler = {
            z: 50,
        };
        pattern.traverse((obj) => {
            if (obj.material) {
                obj.material = obj.material.clone();
                obj.material.opacity = opacityHandler.opacity;
                obj.material.transparent = true;
            }
        });
        pattern.position.setZ(positionHandler.z);

        const promiseOpacity = new Promise((resolve, reject) => {
            /*------------------------------------ OPACITY ANIMATION  --------------------------------------------*/
            const tweenOpacity = new Tween(opacityHandler)
                .to({
                    opacity: 1,
                }, 500)
                .delay((index + 1) * delay)
                .easing(Easing.Exponential.In)
                .on('update',() => {
                    pattern.traverse((obj) => {
                        if (obj.material) {
                            obj.material.opacity = opacityHandler.opacity;
                        }
                    });
                })
                .on('complete', () => {
                    resolve(true);
                })
                .on('stop', () => {
                    reject(new Error('Path was stopped'));
                })
                .start();

            this.tweens.push(tweenOpacity);
        });
        const promisePosition = new Promise((resolve, reject) => {
            /*------------------------------------ POSITION ANIMATION  --------------------------------------------*/
            const tweenPosition = new Tween(positionHandler)
                .to({
                    z: 1,
                }, 1000)
                .delay((index + 1) * delay)
                .easing(Easing.Bounce.Out)
                .on('update',() => {
                    pattern.position.setZ(positionHandler.z);
                    pattern.updateMatrixWorld();
                })
                .on('complete', () => {
                    resolve(true);
                })
                .on('stop', () => {
                    reject(new Error('Path was stopped'));
                })
                .start();

            this.tweens.push(tweenPosition);

        });
        return Promise.all([promiseOpacity,promisePosition]);
    }
}

export default PathSectionDrawer;