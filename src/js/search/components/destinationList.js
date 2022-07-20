import filterList from "../../classes/filterList"

class destinationList extends filterList {
    constructor(properties) {
        super(properties)

        // console.log(properties);
    }

    getButtonsHtmlJson(options) {
        // console.log('Called by Child Class');
        return options.map(opt => { // console.log(opt);
            return {
                tagName: "button",
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-filters__action-value",
                    // filterTagKey: filter.filterTagKey, // filterValueKey: opt.code
                    value: opt.code
                },
                children: [
                    {
                        attrs: {
                            class: "cc-fe_srp cc-fe_srp-filters__action-image",
                        },
                        props: {
                            style: `background-image: url(${opt.destinationImage})`
                        }
                    },
                    {
                        attrs: {
                            class: "cc-fe_srp cc-fe_srp-filters__action-label",
                        },
                        children: [
                            {
                                content: opt.name,
                            },
                        ]
                    }
                ]
               
            }
        })
    }
}

export default destinationList