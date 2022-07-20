import filterList from "../classes/filterList";

class flightRequired extends filterList {
    constructor(properties) {
        super(properties)

        this.falseFlightLabel = properties.falseFlightLabel || ''
        this.trueFlightLabel = properties.trueFlightLabel || ''
    }

    getRealLabel(opt) {
        const { label, code, enabled } = opt
        return this[label]
    }

    getButtonsHtmlJson(options) {
        // console.log('Called by Child Class');
        return options.map(opt => {
            return {
                tagName: "button",
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-filters__action-value",
                    // filterTagKey: filter.filterTagKey, // filterValueKey: opt.code
                    value: opt.code,
                },
                content: this.getRealLabel(opt),
            }
        })
    }
}

export default flightRequired