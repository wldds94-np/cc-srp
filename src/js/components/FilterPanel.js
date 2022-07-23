import ccObject from "../abstract/ccObject"
import TopHeader from "./inc/TopHeader"

class FilterPanel extends ccObject {
    constructor(props) {
        super(props)
        this.props = Object.assign(props, {}) // console.log(props);
        this.type = this.saveSafePropertyProps(this.props, 'type')

        // Extract labels
        const { labels } = this.props // console.log(labels);
        this.config = {
            ...this.config,
            selectedStyleClass: 'selected',
            disabledStyleClass: 'disabled',
            resettabledStyleClass: 'resettabled',
            // enabledStyleClass: 'enabled',
            parentElementToStyle: false,
            abortToStyleElement: false,
            domInstanceSelector: `[data-filterpanel=${this.type}]`,
            resetAllDomInstanceSelector: '.' + this.config.baseStyleClass + "-body__info-clear",
            htmlLabels: {
                clear: this.saveSafePropertyProps(labels, 'clear', 'Clear All'),
                save: this.saveSafePropertyProps(labels, 'save', 'Apply'),
                cancel: this.saveSafePropertyProps(labels, 'filterCloseSrp', 'Back'), // filterCloseSrp
            },
            maxChoices: -1,
        }

        // CLASSES
        this.OptionsInstances = this.saveSafePropertyProps(props, 'OptionsInstances', []), // props.options,
            this.Filter = this.saveSafePropertyProps(props, 'FilterClass', {}), // props.options,
            this.Filter.callbacks.FilterPanel.onOpenCallback = this.onOpenPanel.bind(this)

        this.state = {
            filterSearchLabel: this.saveSafePropertyProps(props, 'filterSearchLabel', []), // [],
            filterSearchValue: this.saveSafePropertyProps(props, 'filterSearchValue', []), // [],
            filterSearchMemory: [],
            isResettable: this.saveSafePropertyProps(props, 'isResettable', false), // [],
        }
        props.options.map(opt => {
            this.OptionsInstances[opt.code].callbacks.FilterPanel.onClickCallback = this.onClickOptionCallback.bind(this)
        })

        this.callbacks = {
            Router: {
                pingResetRequest: this.saveSafePropertyProps(props, 'onResetPanel', (...args) => { return }),
            }
        }

        this.TopHeader = new TopHeader({
            save: this.config.htmlLabels.save,
            close: this.config.htmlLabels.cancel,
            onClose: this.closePanel.bind(this),
            onSave: this.saveClosePanel.bind(this),
        })

        // console.log('FilterPanel');
        // console.log(this);
    }

    // OVERRIDDEN BEFORE UPDATE THE SEARCH VALUE
    transformFilterSearchValue(el, newEl = '', prevCopy = []) {
        return el
    }

    transformFilterLabelValue(optionInstance) {
        console.log('TRANSFORM BY FILTER PANEL NORMAL');
        // console.log(optionInstance);
        return optionInstance.props.name
    }

    // FIRE BY FILTER - I HAVE TO SET FILTER SEARCH MEMORY = FILTER-SEARCH-VALUE
    onOpenPanel(/* newFilterMemory = [] */) {
        console.log('Set the MEMORY');
        // const filterSearchValue = this.state.filterSearchValue
        // let filterSearchMemoryValue = []
        // Object.keys(filterSearchValue).map(subtypeArr => {
        //     console.log(subtypeArr); console.log(filterSearchValue[subtypeArr]);
        //     filterSearchMemoryValue[subtypeArr] = filterSearchValue[subtypeArr]
        // })
        this.state.filterSearchMemory = JSON.parse(JSON.stringify({...this.state.filterSearchValue})); // this.state.filterSearchValue.clone() //  { ...this.state.filterSearchValue };
        console.log(this);
        return true
    }

    // FIRE BY OPTION
    // onClickOptionCallback(optCode, subtypeKey = false) {
    //     // console.log('I have to register the choice'); // console.log(this.OptionsInstances[optCode]); // console.log(optCode); console.log(subtypeKey); console.log(this);
    //     const type = false != subtypeKey ? subtypeKey : this.type
    //     console.log(this.state.filterSearchValue);
    //     let filterSearch = this.state.filterSearchValue // console.log(this.state.filterSearchValue); console.log(this); // console.log(newFilterSearchType);
    //     let newFilterSearchType = filterSearch[type] 

    //     if (newFilterSearchType.includes(optCode)) {
    //         // console.log(this.OptionsInstances); // newFilter = this.state.filterSearchValue.filter(el => el != newValue)
    //         // this.state.filterSearchLabel = this.state.filterSearchLabel.filter(el => el != this.OptionsInstances[optCode].props.name)
    //         this.state.filterSearchValue[type] = newFilterSearchType.filter(el => el != optCode)
    //     } else {
    //         // console.log(this.OptionsInstances); // this.state.filterSearchLabel.push(this.OptionsInstances[optCode].props.name)
    //         this.state.filterSearchValue[type].push(optCode)
    //     }
    //     // const updatedFilterValue = this.transformFilterSearchValue(this.state.filterSearchValue, optCode)
    //     this.state.filterSearchValue = {...this.transformFilterSearchValue(this.state.filterSearchValue, optCode)}
    //     console.log(this.state.filterSearchValue);
    //     // // const updatedLabelValue = this.transformFilterLabelValue(this.state.filterSearchLabel)
    //     // const updatedLabelValue = this.getLabelValueBySearch(this.state.filterSearchValue)
    //     // console.log(updatedLabelValue); // console.log(this.OptionsInstances[optCode].props.name);

    //     // this.Filter.registerChoice(
    //     //     updatedLabelValue,
    //     //     this.state.filterSearchValue, // this.valueTransformCallback(updatedFilterValue),
    //     //     subtypeKey
    //     // ) // console.log(this.Filter); // console.log(this.OptionsInstances[optCode]);
    // }
    onClickOptionCallback(optCode, subtypeKey = false) {
        // console.log('I have to register the choice'); // console.log(this.OptionsInstances[optCode]); // console.log(optCode); console.log(subtypeKey); console.log(this);
        const type = false != subtypeKey ? subtypeKey : this.type
        console.log(this);
        let filterSearchMemory = this.state.filterSearchMemory // [false != subtypeKey ? subtypeKey : this.type]
        let newFilterSearchMemoryType = filterSearchMemory[type] // console.log(this.state.filterSearchValue); console.log(this);
        console.log(newFilterSearchMemoryType); // console.log(this.state.filterSearchMemory == this.state.filterSearchValue);

        if (Array.isArray(filterSearchMemory[type]) || filterSearchMemory.hasOwnProperty(type)) {
            if (newFilterSearchMemoryType.includes(optCode)) {
                this.state.filterSearchMemory[type] = newFilterSearchMemoryType.filter(el => el != optCode)
            } else {
                this.state.filterSearchMemory[type].push(optCode)
            }
        } else {
            this.state.filterSearchMemory[type] = []
            this.state.filterSearchMemory[type].push(optCode)
        }
        // console.log(this);
        // // // const updatedFilterValue = this.transformFilterSearchValue(this.state.filterSearchValue, optCode)
        this.state.filterSearchMemory = {...this.transformFilterSearchValue(this.state.filterSearchMemory, optCode)}
    }

    getLabelValueBySearch(updatedFilterValue, callback = this.transformFilterLabelValue) {
        console.log('getLabelValueBySearch');
        console.log(updatedFilterValue);
        // let flat = []
        let labelsArray = []
        let flat = Object.keys(updatedFilterValue).map(subtype => {
            return this.flatten(updatedFilterValue[subtype])
        }).reduce((prev, next) => {
            return prev.concat(next)
        }, [])
        // let flat = this.flatten(updatedFilterValue)
        console.log(flat);
        // let reduced = flat.length ? flat[0] : [] // let flat = this.flatten(updatedFilterValue)
        // console.log(reduced); // console.log(flat);
        flat.map(code => {
            // console.log(code);
            labelsArray.push(callback(this.OptionsInstances[code]))
        })
        return labelsArray
    }


    // ACTIVATED BY TOP HEADER -> PASSED LIKE CALLBACKS VARIABLED
    closePanel() {
        // RETURN TO THE STATE BEFORE OPEN
        // this.state.filterSearchMemory = []

        console.log(this.state.filterSearchValue);
        this.filterSearchValue = {...this.transformFilterSearchValue(this.state.filterSearchValue)}
        // const updatedLabelValue = this.getLabelValueBySearch(this.state.filterSearchValue) // console.log(updatedLabelValue);

        // Return to the initial options
        this.props.options.map(opt => {
            this.OptionsInstances[opt.code].updateState({ selected: opt.selected, enabled: opt.enabled })
        })

        this.closeStylePanel()
    }

    closeStylePanel() {
        // console.log('You Close the filters: ' + this.type); // let trg = e.target // trg.closest('.cc-fe_srp-filter__panel').classList.remove('open')
        this.getDomInstance(this.config.domInstanceSelector).classList.remove('open')
    }

    saveClosePanel(e) {
        e.preventDefault() // 
        console.log('You Save & Close the filters: ' + this.type);

        this.closeStylePanel() // console.log('You want ressend Filter Value by Class List to Router??');

        // RESET THE MEMORY
        const memory = this.state.filterSearchMemory
        // this.state.filterSearchValue = memory
        // this.state.filterSearchMemory = []

        const updatedLabelValue = this.getLabelValueBySearch(memory) // console.log(updatedLabelValue);

        this.Filter.registerChoice(
            updatedLabelValue,
            memory, // this.valueTransformCallback(updatedFilterValue),
        ) // console.log(this.Filter); // console.log(this.OptionsInstances[optCode]);


    }

    resetPanel(e) {
        const { domInstanceSelector, baseStyleClass, selectedStyleClass } = this.config
        const { isResettable } = this.state
        // console.log('Reset all options of all panels ???');
        if (isResettable) {
            this.callbacks.Router.pingResetRequest()
        }

        this.closeStylePanel()
    }

    updatePanel(props) {
        console.log('UPDATE PANEL');
        // console.log(props); // console.log(this);

        // I HAVE TO UPDATE THIS CLASS
        this.state = {
            ...this.state,
            // CLASSES STATES
            filterSearchValue: this.saveSafePropertyProps(props, 'filterSearchValue', []), // [],
            filterSearchLabel: this.saveSafePropertyProps(props, 'filterSearchLabel', []), // [],
            isResettable: this.saveSafePropertyProps(props, 'isResettable', false), // [],
            filterSearchMemory: [],
            // limits: {
            //     start: this.saveSafePropertyProps(this.props.limits, 'start', false),
            //     end: this.saveSafePropertyProps(this.props.limits, 'end', false),
            // }
        }
        // FOR THE MEMORY AND RETURN TO THE INTIAL RESYNC
        this.props.options = this.saveSafePropertyProps(props, 'options', [])
        console.log(this);
        this.updateStyleResettable()
        // console.log('FilterPanel'); console.log(this);

        // // I HAVE TO UPDATE THE OPTIONS // UPDATE OPTIONS
        console.log('Update OPTIONS CLASSES');
        this.props.options.filter(opt => opt.hasOwnProperty('code') && '' != opt.code).map(option => {
            const key = option.code // console.log(option); // console.log('OLD OPTION CLASS'); // console.log(key);
            // let thisOption = 
            if (undefined != this.OptionsInstances[key]) {
                this.OptionsInstances[key].updateState(
                    {   // NEXT
                        selected: option.selected,
                        enabled: option.enabled
                    },
                    {   // PREV
                        selected: this.OptionsInstances[key].state.selected,
                        enabled: this.OptionsInstances[key].state.enabled
                    },
                )
            } else {
                console.log('ITS UNDEFINED');
                console.log(this.OptionsInstances);
            }
            
        })

        // // I HAVE TO UPDATE THE FILTER // UPDATE FILTER CLASS
        console.log('Update FILTER CLASS');
        // const updatedFilterValue = this.transformFilterSearchValue(this.state.filterSearchValue)
        this.state.filterSearchValue/* [this.type] */ = { ...this.transformFilterSearchValue(this.state.filterSearchValue) }// [...this.transformFilterSearchValue(this.state.filterSearchValue)]
        const updatedLabelValue = this.getLabelValueBySearch(this.state.filterSearchValue) // this.transformFilterLabelValue(this.state.filterSearchLabel)
        this.Filter.updateState(
            updatedLabelValue,
            this.state.filterSearchValue, // this.valueTransformCallback(updatedFilterValue)
        )
    }

    updateStyleResettable() {
        console.log('Update updateStyleResettable CLASSES');
        console.log(this);
        const { resettabledStyleClass, resetAllDomInstanceSelector } = this.config
        let resetButtonsDom = $(resetAllDomInstanceSelector)
        if (this.state.isResettable) {
            resetButtonsDom.addClass(resettabledStyleClass)
        } else {
            resetButtonsDom.removeClass(resettabledStyleClass)
        }
    }

    getButtonsHtmlJson(options = this.props.options) {
        return options.map(opt => { return this.OptionsInstances[opt.code].getHtmlJson() })
        // return Object.keys(options).map(code => {
        //     return options[code].getHtmlJson()
        // }) // return options.map(opt => { return this.OptionsInstances[opt.code].getHtmlJson() }) // return options.map(opt => { return opt.getHtmlJson() })
    }

    getHtmlJson() {
        const { type, ...props } = this // console.log('List JSON: ' + type);
        const { baseStyleClass, htmlLabels, resettabledStyleClass } = this.config
        const { isResettable } = this.state

        return {
            attrs: {
                class: baseStyleClass + " " + baseStyleClass + "-filter__panel " + type,
                id: baseStyleClass + "-" + type // "cc-fe_srp_panel-" + type
            },
            dataset: {
                filterpanel: type,
            },
            children: [
                {
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-filter__panel-content"
                    },
                    children: [
                        this.TopHeader.getHtmlJson(),
                        {
                            attrs: {
                                class: baseStyleClass + "-filter__panel-content_body"
                            },
                            children: [
                                {
                                    attrs: {
                                        class: baseStyleClass + " " + baseStyleClass + "-body__info"
                                    },
                                    children: [
                                        {
                                            attrs: {
                                                class: baseStyleClass + " " + baseStyleClass + "-body__info-name"
                                            },
                                            content: this.Filter.props.filterTitleDesktop
                                        },
                                        {
                                            attrs: {
                                                class: baseStyleClass + " " + baseStyleClass + "-body__info-clear " + type + (isResettable ? " " + resettabledStyleClass : '')
                                            },
                                            props: {
                                                onclick: this.resetPanel.bind(this)
                                            },
                                            content: htmlLabels.clear
                                        }
                                    ]
                                },
                                {
                                    attrs: {
                                        class: baseStyleClass + " " + baseStyleClass + "-body__panel"
                                    },
                                    children: this.getButtonsHtmlJson(/* this.state.options */)
                                }
                            ]
                        }
                    ]
                },
            ],
        }
    }

        // AUX
    /**
     * @param {Array || Object} ary 
     * @returns 
     */
     flatten(ary) {
        var ret = [];
        for (var i = 0; i < ary.length; i++) {
            if (Array.isArray(ary[i])) {
                ret = ret.concat(this.flatten(ary[i]));
            } else {
                ret.push(ary[i]);
            }
        }
        return ret;
    }
}

export default FilterPanel