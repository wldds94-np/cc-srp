import filterList from "../classes/filterList";

class Duration extends filterList {
    constructor(properties) {
        super(properties)

        this.durationLabel = properties.durationLabel || ''
    }

    getRealLabel(opt) {
        const { label, count, start, end, enabled } = opt
        // console.log(this.durationLabel.replace(/{{\w+}}/, reply));
        return this.durationLabel.replace(/{{\w+}}/, label + ('*' == end ? '+' : ''))
    }

    getRealValue(opt) {
        const { label, count, start, end, enabled } = opt
        // console.log(this.durationLabel.replace(/{{\w+}}/, reply));
        return start + '-' + end
    }

    getButtonsHtmlJson(options) {
        // console.log('Called by Child Class');
        return options.map(opt => {
            return {
                tagName: "button",
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-filters__action-value",
                    // filterTagKey: filter.filterTagKey, // filterValueKey: opt.code
                    value: this.getRealValue(opt), // opt.code
                },
                content: this.getRealLabel(opt),
            }
        })
    }
}

export default Duration