import { AbstractOptions } from '@adactive/adactive-abstract-options';
import { ConsoleLogger } from '@adactive/adactive-logger';

import { CacheOptions } from '@adactive/adsum-client-api';

class Options extends AbstractOptions {
    reset() {
        super.reset();

        /**
         * @public
         * @type {string}
         */
        this.hostname = 'localhost';

        /**
         * @public
         * @type {number}
         */
        this.port = 9000;

        /**
         *
         * @type {string}
         * @default "./"
         */
        this.path = './';

        /**
         *
         * @type {CacheOptions}
         */
        this.cache = new CacheOptions();

        /**
         * A logger instance
         */
        this.logger = new ConsoleLogger();

        /**
         * @public
         * @type {boolean}
         */
        this.production = true;
    }
}

export default Options;
