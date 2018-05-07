// @flow

import { Tween } from 'es6-tween';
import { UserObject } from '@adactive/adsum-web-map';
import ObjectsLoader from '../objectsLoader/ObjectsLoader';

/**
 * @public
 */
class CustomUserObject extends UserObject {
    /**
   *
   * @param {number} size
   * @param {object} parameters
   * @param {int|symbol|null} [id=Symbol()]
   * @return {UserObject}
   */
    createDefault(size, parameters = {}, id = Symbol('AdsumObjectId')) { // TODO
        return new Promise((resolve, reject) => {
            this.objectsLoader.createJSON3DObj('assets/3dModels/youarehere.json').then((object) => {
                object.visible = true;

                object.scale.set(7, 7, 7);
                object.rotateX(Math.PI / 2);

                const scaleRatio = 2;// MapConfig.positionIndicatorOptions.scaleRatio;
                object.scale.multiplyScalar(scaleRatio);

                /* const box = new Box3();
                   box.setFromObject(object);
                   const height = (box.max.z - box.min.z) / 2; */


                // if (MapConfig.positionIndicatorOptions.animate) { // TODO
                new Tween(object.rotation)
                    .to(
                        {
                            y: Math.PI * 2,
                        },
                        2000
                    )
                    .repeat(Infinity)
                    .on('update', () => { object.updateMatrixWorld(); })
                    .start();
                // }

                resolve(UserObject._createFromMesh(object, parameters, id));
            });
        });
    }

    constructor(awm) {
        super();

        this.awm = awm;
        this.objectsLoader = new ObjectsLoader(this.awm);
    }
}

export default CustomUserObject;
