let calc = require('../inc/calc'),
    utils = require('../inc/utils'),
    each = utils.each,
    Controls = require('../controls/Controls');

const DEFAULT_PROP = 'current';

class Action {
    constructor(props) {
        var action = this;

        utils.each(this.getDefaultProps(), function (key, value) {
            action[key] = value;
        });

        this.values = {};
        this.set(props, this.getDefaultValueProp());
    }

    set(props = {}, defaultProp = DEFAULT_PROP) {
        each(props, (key, prop) => {
            if (key !== 'values') {
                this[key] = prop;
            }
        });

        // Merge values
        if (props.values) {
            let currentValues = this.values,
                values = props.values;

            each(values, (key, value) => {
                let existingValue = currentValues[key],
                    newValue = {};
                
                if (utils.isObj(value)) {
                    newValue = value;
                } else {
                    newValue[defaultProp] = value;
                }

                currentValues[key] = existingValue ? utils.merge(existingValue, newValue) : newValue;
            });
        }

        return this;
    }

    process(actor, value) {
        return value.current;
    }

   /*
        Has Action ended?
        
        Returns true to end immedietly
        
        @return [boolean]: true
    */
    hasEnded() {
        return true;
    }
        
    limit(output, value) {
        var restricted = calc.restricted(output, value.min, value.max),
            escapeAmp = value.escapeAmp !== undefined ? value.escapeAmp : 0;
        return restricted + ((output - restricted) * escapeAmp);
    }

    getControls() {
        return Controls;
    }

    getName() {
        return 'action';
    }

    getDefaultProps() {
        return {};
    }

    getDefaultValue() {
        return {
            current: 0,
            speed: 0,
            velocity: 0,
            frameChange: 0,
            amp: 1,
            escapeAmp: 0,
            round: false
        };
    }

    getDefaultValueProp() {
        return DEFAULT_PROP;
    }

    extend(props) {
        return new this.constructor(utils.merge(this, props), this.getDefaultValueProp());
    }

    getPlayable() {
        return this.extend();
    }

    activate() {
        this.isActive = true;
        return this;
    }

    deactivate() {
        this.isActive = false;
        return this;
    }
}

module.exports = Action;