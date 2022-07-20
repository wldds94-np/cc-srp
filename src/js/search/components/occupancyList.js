import filterList from "../../classes/filterList"

class occupancyList extends filterList {
    constructor(props) {
        super(props)

        // console.log(props);
        console.log(this);
        this.agePickerData = this.prepareAgePickerData(props.options)
    }

    prepareAgePickerData(listData) {
        console.log(listData);
        // let agePickerData = []

        let agePickerData = listData.filter(fltr => fltr.hasOwnProperty('min') ? fltr.min > 0 : true).map(filter => {
            console.log(filter);
            filter.default = filter.hasOwnProperty('min') ? 0 : 2
            return filter
        })

        return agePickerData
    }
    // getButtonsHtmlJson(options) {
    //     console.log(options);
    //     return options.map(opt => {
    //         return {
    //             tagName: "button",
    //             attrs: {
    //                 class: "cc-fe_srp cc-fe_srp-filters__action-value " + (opt.enabled ? '' : this.disabledClassStyle),
    //                 value: opt.code,
    //             },
    //             content: opt.name,
    //         }
    //     })
    // }
    getRealLabel(opt) {
        let label = opt.label + ' '
        
        label += opt.hasOwnProperty('min') ? opt.range.replace(/{{\w+}}/, opt.min).replace(/{{\w+}}/, opt.max) : opt.range
        return label
    }

    getButtonsHtmlJson(options) {
        return [{
            attrs: {
                class: "cc-srp-fe cc-srp-fe cc-age-picker-container",
                id: "cc-occupancy-age-picker",
            },
            children: [
                {
                    attrs: {
                        class: "cc-age-buttons-container",
                    },
                    children: this.agePickerData.map(opt => {
                        console.log(opt);
                        return {
                            attrs: {
                                class: 'cc-age-button-wrapper'
                            },
                            children: [
                                {
                                    tagName: 'span',
                                    attrs: {
                                        class: "cc-age-button_label",
                                    },
                                    content: this.getRealLabel(opt), // opt.label + ' ' + opt.range, // Adults (+18)'
                                },
                                {
                                    attrs: {
                                        class: "cc-age-button-picker",
                                    },
                                    children: [
                                        {
                                            tagName: 'button',
                                            attrs: {
                                                class: "remove",
                                            },
                                            // content: '-'
                                        },
                                        {
                                            tagName: 'span',
                                            attrs: {
                                                class: 'cc-age-button_label-value',
                                            },
                                            content: '2'
                                        },
                                        {
                                            tagName: 'button',
                                            attrs: {
                                                class: "add",
                                            },
                                            // content: '+'
                                        },
                                    ]
                                }
                            ]
                        }
                    }),
                    
                }
            ]
        }]
    }
    // getButtonsHtmlJson(options) {
    //     console.log(options);
    //     return {
            // attrs: {
            //     class: "cc-srp-fe cc-srp-fe cc-age-picker-container",
            //     id: "cc-occupancy-age-picker",
            // },
    //     }
    //     // return {
    //     //     attrs: {
    //     //         class: "cc-srp-fe cc-srp-fe cc-age-picker-container",
    //     //         id: "cc-occupancy-age-picker",
    //     //     },
            // children: [
            //     {
            //         attrs: {
            //             class: "cc-age-buttons-container",
            //         },
            //         children: options.map(opt => {
            //             return {
            //                 attrs: {
            //                     class: 'cc-age-button-wrapper'
            //                 },
            //                 children: [
            //                     {
            //                         tagName: 'span',
            //                         attrs: {
            //                             class: "cc-age-button_label",
            //                         },
            //                         content: 'Adults (+18)'
            //                     },
            //                     {
            //                         attrs: {
            //                             class: "cc-age-button-picker",
            //                         },
            //                         children: [
            //                             {
            //                                 tagName: 'button',
            //                                 attrs: {
            //                                     class: "minus",
            //                                 },
            //                                 content: '-'
            //                             },
            //                             {
            //                                 tagName: 'span',
            //                                 attrs: {
            //                                     class: 'cc-age-button_label-value',
            //                                 },
            //                                 content: '2'
            //                             },
            //                             {
            //                                 tagName: 'button',
            //                                 attrs: {
            //                                     class: "plus",
            //                                 },
            //                                 content: '+'
            //                             },
            //                         ]
            //                     }
            //                 ]
            //             }
            //         }),
                    
            //     }
            // ]
    //     // }
    // }
        /**
         * children: [
                        {
                            attrs: {
                                class: 'cc-age-button-wrapper'
                            },
                            children: [
                                {
                                    tagName: 'span',
                                    attrs: {
                                        class: "cc-age-button_label",
                                    },
                                    content: 'Adults (+18)'
                                },
                                {
                                    attrs: {
                                        class: "cc-age-button-picker",
                                    },
                                    children: [
                                        {
                                            tagName: 'button',
                                            attrs: {
                                                class: "minus",
                                            },
                                            content: '-'
                                        },
                                        {
                                            tagName: 'span',
                                            attrs: {
                                                class: 'cc-age-button_label-value',
                                            },
                                            content: '2'
                                        },
                                        {
                                            tagName: 'button',
                                            attrs: {
                                                class: "plus",
                                            },
                                            content: '+'
                                        },
                                    ]
                                }
                            ]
                        },
                    ]
         */
        /* return options.map(opt => {
            return {
                attrs: {
                    class: "cc-srp-fe cc-srp-fe cc-age-picker-container",
                    id: "cc-occupancy-age-picker",
                },
                children: [
                    {
                        attrs: {
                            class: "cc-age-buttons-container",
                        },
                        children: [
                            {
                                attrs: {
                                    class: 'cc-age-button-wrapper'
                                },
                                children: [
                                    {
                                        tagName: 'span',
                                        attrs: {
                                            class: "cc-age-button_label",
                                        },
                                        content: 'Adults (+18)'
                                    },
                                    {
                                        attrs: {
                                            class: "cc-age-button-picker",
                                        },
                                        children: [
                                            {
                                                tagName: 'button',
                                                attrs: {
                                                    class: "minus",
                                                },
                                                content: '-'
                                            },
                                            {
                                                tagName: 'span',
                                                attrs: {
                                                    class: 'cc-age-button_label-value',
                                                },
                                                content: '2'
                                            },
                                            {
                                                tagName: 'button',
                                                attrs: {
                                                    class: "plus",
                                                },
                                                content: '+'
                                            },
                                        ]
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        }) */
    // }

    /**
     * 
    return {
                attrs: {
                    class: "cc-srp-fe cc-srp-fe cc-age-picker-container",
                    id: "cc-occupancy-age-picker",
                },
                children: [
                    {
                        attrs: {
                            class: "cc-age-buttons-container",
                        },
                        children: options.map(opt => (
                            {
                                attrs: {
                                    class: 'cc-age-button-wrapper'
                                },
                                children: [
                                    {
                                        tagName: 'span',
                                        attrs: {
                                            class: "cc-age-button_label",
                                        },
                                        content: 'Adults (+18)'
                                    },
                                    {
                                        attrs: {
                                            class: "cc-age-button-picker",
                                        },
                                        children: [
                                            {
                                                tagName: 'button',
                                                attrs: {
                                                    class: "minus",
                                                },
                                                content: '-'
                                            },
                                            {
                                                tagName: 'span',
                                                attrs: {
                                                    class: 'cc-age-button_label-value',
                                                },
                                                content: '2'
                                            },
                                            {
                                                tagName: 'button',
                                                attrs: {
                                                    class: "plus",
                                                },
                                                content: '+'
                                            },
                                        ]
                                    }
                                ]
                            },
                        ))
                    }
                ]
            }
     */
}

export default occupancyList