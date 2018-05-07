// @flow

import { AbstractOptions } from '@adactive/adactive-abstract-options';
import { Color } from 'three';

/**
 * @extends AbstractOptions
 */
class AmbientLightsBuilderOptions extends AbstractOptions {
    reset() {
        super.reset();

        /**
         *
         * @type {THREE.Color}
         */
        this.color = new Color(0xffffff);

        /**
         *
         * @type {number}
         */
        this.intensity = 0.35;
    }
}

export default AmbientLightsBuilderOptions;
