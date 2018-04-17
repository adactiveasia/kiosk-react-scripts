/**
 * @abstract
 */
class AbstractOptions {
    /**
     * construct a new AbstractOptions object using the json value
     * @param {Object} [json={}]
     */
    constructor(json = {}) {
        this.fromJSON(json);

    }

    /**
     * Reset the default value
     */
    reset() {
    }

    /**
     *
     * @param json
     */
    fromJSON(json) {
        this.reset();

        for (const property of Object.keys(json)) {
            if (!this.hasOwnProperty(property)) {
                continue;
            }

            if (this[property] instanceof AbstractOptions) {
                this[property].fromJSON(json[property]);
            } else {
                this[property] = json[property];
            }
        }
    }

    /**
     * Validate the options object.
     *
     * @return {Object}
     */
    validate() {
        const errors = {};

        for (const property of Object.keys(this)) {
            if (this[property] instanceof AbstractOptions && !this[property].isValid()) {
                errors[property] = this[property].validate();
            }
        }

        return errors;
    }

    /**
     *
     * @return {boolean}
     */
    isValid() {
        const errors = this.validate();
        return Object.keys(errors).length === 0;
    }

    /**
     * Freeze the option object
     */
    freeze() {
        Object.freeze(this);

        for (const property of Object.keys(this)) {
            if (this[property] instanceof AbstractOptions) {
                this[property].freeze();
            }
        }
    }

    /**
     *
     * @return {boolean}
     */
    get isFrozen() {
        return Object.isFrozen(this);
    }
}

export default AbstractOptions;
