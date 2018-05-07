// @flow

import { AbstractOptions } from '@adactive/adactive-abstract-options';
import { Color, Vector3 } from 'three';

/**
 * @extends AbstractOptions
 */
class DirectionalLightsBuilderOptions extends AbstractOptions {
    reset() {
        super.reset();

        /**
         *
         * @type {THREE.Color}
         */
        this.color = new Color(0xFFF5E6);

        /**
         *
         * @type {number}
         */
        this.intensity = 1.0;

        /**
         *
         * @type {THREE.Vector3}
         */
        this.position = new Vector3(-1000, 1750, 1000);

        /**
         *
         * @type {boolean}
         */
        this.castShadow = true;

        /**
         *
         * @type {number}
         */
        this.shadowMapSize = 4096;

        /**
         *
         * @type {number}
         */
        this.shadowCameraRadius = 1000;

        /**
         *
         * @type {number}
         */
        this.shadowCameraFar = 1000;

        /**
         *
         * @type {number}
         */
        this.shadowBias = -0.0001;
    }
}

export default DirectionalLightsBuilderOptions;
