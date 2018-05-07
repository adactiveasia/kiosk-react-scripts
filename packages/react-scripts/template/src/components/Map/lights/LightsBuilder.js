// @flow

import { HemisphereLight, DirectionalLight, AmbientLight } from 'three';

import LightsBuilderOptions from './LightsBuilderOptions';

class LightsBuilder {
    /**
     *
     * @param {Object|LightsBuilderOptions} options
     */
    constructor(options = {}) {
        if (!(options instanceof LightsBuilderOptions)) {
            options = new LightsBuilderOptions(options);
        }

        /**
         *
         * @type {LightsBuilderOptions}
         */
        this.options = options;
    }

    /**
     *
     * @returns {three.Light[]}
     */
    build() {
        const lights = [];

        const hemisphere = new HemisphereLight(0xffffff, 0x888888, 0.2);
        hemisphere.position.set(0, 0, 1);
        lights.push(hemisphere);

        if (this.options.ambientLight !== null) {
            const ambient = new AmbientLight(this.options.ambientLight.color, this.options.ambientLight.intensity);
            lights.push(ambient);
        }

        if (this.options.directionalLight !== null) {
            /**
             *
             * @type {DirectionalLight}
             */
            const dirLight = new DirectionalLight(0xc6a96f, 0.7);
            dirLight.position.set(130, 500, 300);
            dirLight.position.multiplyScalar(1.3);

            dirLight.castShadow = true;

            dirLight.shadow.mapSize.width = this.options.directionalLight.shadowMapSize;
            dirLight.shadow.mapSize.height = this.options.directionalLight.shadowMapSize;

            dirLight.shadow.camera.left = -this.options.directionalLight.shadowCameraRadius;
            dirLight.shadow.camera.right = this.options.directionalLight.shadowCameraRadius;
            dirLight.shadow.camera.top = this.options.directionalLight.shadowCameraRadius;
            dirLight.shadow.camera.bottom = -this.options.directionalLight.shadowCameraRadius;

            dirLight.shadow.camera.far = this.options.directionalLight.shadowCameraFar;
            dirLight.shadow.bias = -this.options.directionalLight.shadowBias;

            // lights.push(new CameraHelper( light.shadow.camera ))

            lights.push(dirLight);

            /**
             *
             * @type {DirectionalLight}
             */
            const dirLightSide = new DirectionalLight(0xc6a96f, 0.4);
            dirLightSide.position.set(-1000, 800, 1400);
            dirLightSide.position.multiplyScalar(1.3);

            dirLightSide.castShadow = true;

            dirLightSide.shadow.mapSize.width = this.options.directionalLight.shadowMapSize;
            dirLightSide.shadow.mapSize.height = this.options.directionalLight.shadowMapSize;

            dirLightSide.shadow.camera.left = -this.options.directionalLight.shadowCameraRadius;
            dirLightSide.shadow.camera.right = this.options.directionalLight.shadowCameraRadius;
            dirLightSide.shadow.camera.top = this.options.directionalLight.shadowCameraRadius;
            dirLightSide.shadow.camera.bottom = -this.options.directionalLight.shadowCameraRadius;
            dirLightSide.shadow.camera.far = this.options.directionalLight.shadowCameraFar;
            dirLightSide.shadow.bias = -this.options.directionalLight.shadowBias;

            // lights.push(new CameraHelper( light2.shadow.camera ))

            lights.push(dirLightSide);
        }

        return lights;
    }
}

export default LightsBuilder;
