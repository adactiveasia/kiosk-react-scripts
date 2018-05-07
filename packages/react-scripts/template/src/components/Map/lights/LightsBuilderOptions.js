// @flow

import { AbstractOptions } from '@adactive/adactive-abstract-options';

import AmbientLightsBuilderOptions from './AmbientLightsBuilderOptions';
import DirectionalLightsBuilderOptions from './DirectionalLightsBuilderOptions';

/**
 * @extends AbstractOptions
 */
class LightsBuilderOptions extends AbstractOptions {
    reset() {
        super.reset();

        /**
         *
         * @type {AmbientLightsBuilderOptions}
         */
        this.ambientLight = new AmbientLightsBuilderOptions();
        /**
         *
         * @type {DirectionalLightsBuilderOptions}
         */
        this.directionalLight = new DirectionalLightsBuilderOptions();
    }
}

export default LightsBuilderOptions;
