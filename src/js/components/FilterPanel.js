import ccObject from "../abstract/ccObject"

// Option Component
import Option from "./Option"

// Custom components
import TopHeader from "./inc/TopHeader"

class FilterPanel extends ccObject {
    // constructor({ type, options, filterLabelClass, ...props }) {
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
            // enabledStyleClass: 'enabled',
            parentElementToStyle: false,
            abortToStyleElement: false,
            domInstanceSelector: `[data-filterpanel=${this.type}]`,
            htmlLabels: {
                clear: this.saveSafePropertyProps(labels, 'clear', 'Clear All'),
                save: this.saveSafePropertyProps(labels, 'save', 'Apply'),
                cancel: this.saveSafePropertyProps(labels, 'filterCloseSrp', 'Back'), // filterCloseSrp
            },
            maxChoices: -1,
        }


        // Filter Instance -> UPDATE THE FILTER INSTANCE with the actual value before injeccting in the DOM
        this.Filter = props.filterLabelClass
        // console.log(this.Filter);
        this.state = {
            // filterLabel: props.filterLabelClass,
            options: this.saveSafePropertyProps(props, 'options', []), // props.options,
            filterSearchValue: [], // Array of Object opt.code => { value: opt.code, type: subtype || type } -> PUSH ON IT MAPPING OPTIONS
            filterSearchLabel: [],
            lastCronology: [],
        }
        if (false != this.Filter.subtype) {
            Object.keys(this.Filter.subtype).map(subtypeKey => {
                this.state.filterSearchValue[subtypeKey] = []
            })
        } else {
            this.state.filterSearchValue[this.Filter.type] = []
        }

        this.callbacks = {
            Router: {
                pingResetRequest: this.saveSafePropertyProps(props, 'onResetPanel', (...args) => { return }),
            }
        }

        // USE THIS FOR OVERRIDING THE TRANSFORMATIONS
        this.transformFilterSearchValue = (el, newEl = '', prevCopy = []) => { return el }
        // this.valueTransformCallback = this.generateSrcStringParam.bind(this)
        this.contentTransformValueCallback = el => el
        this.contentTransformCallback = this.generateLabelStringContent.bind(this) // el => {}

        // CLASS INSTANCES
        // Options Instaces
        this.OptionsInstances = []
        this.state.options.filter(filter => { // console.log(filter);
            // NB -> SHIPS "disabled" return with code='' by OccupancySearch
            return (this.ccHasProperty(filter, 'code') && '' != filter.code)
        }).map(option => {
            option.parentType = this.type
            option.onClickOption = this.onClickOptionCallback.bind(this)
            // Check if it's undefined -> NB -> SHIPS "disabled" return with code='' by OccupancySearch
            this.OptionsInstances[option.code] = new Option(option)
            if (option.selected) {
                this.state.filterSearchLabel.push(option.name)
                // this.state.filterSearchValue.push(option.code)
                if (option.hasOwnProperty('subParentType')) {
                    this.state.filterSearchValue[option.subParentType].push(option.code)
                } else {
                    this.state.filterSearchValue[option.parentType].push(option.code)
                } // this.state.filterSearchValue.push(newSearch) 
            }
        })

        const updatedFilterValue = this.transformFilterSearchValue(this.state.filterSearchValue)
        // Qui puoi non passare il type/subtype -> openPing is false, nessuna richiesta parte dal filter
        // Ci limitiamo a memorizzare i dati così come sono
        this.Filter.registerChoice(this.contentTransformCallback(this.state.filterSearchLabel), updatedFilterValue)

        this.TopHeader = new TopHeader({
            save: this.config.htmlLabels.save,
            close: this.config.htmlLabels.cancel,
            onClose: this.closePanel.bind(this),
            onSave: this.saveClosePanel.bind(this),
        })

        console.log(this);
        // this.registerHandler() // this.transformFilterSearchValue = (newEl, el, elCopy) => { return el.push(newEl) } // el /* {el.push(newEl)} */
    }

    // generateSrcStringParam(el) {
    //     let filter = ''
    //     if (Array.isArray(el)) {
    //         filter += el.reduce((prev, curr) => {
    //             // console.log(prev, curr);
    //             return prev + ',' + curr

    //         }, '')
    //         // console.log(filter.slice(1, filter.length));
    //         return filter.slice(1, filter.length)
    //     }
    // }

    generateLabelStringContent(el) {
        const { hasCounter, labelSeparator } = this.Filter.config
        let filterContent = ''
        if (el.length) {
            if (hasCounter) {
                // console.log('Has Counter');
                let count = 0
                el.map(value => {
                    filterContent += count > 0 ? '' : this.contentTransformValueCallback(value)
                    count++
                })
                filterContent += count - 1 > 0 ? ' (+' + (count - 1) + ')' : ''
            } else {
                // console.log('Not Has Counter');
                filterContent += el.reduce((prev, curr) => {
                    // console.log(prev, curr);
                    return prev + labelSeparator + this.contentTransformValueCallback(curr)

                }, '')
                return filterContent.slice(labelSeparator.length, filterContent.length)
            }
        }
        return filterContent

    }

    onClickOptionCallback(optCode, subtypeKey = false) {
        // console.log('I have to register the choice'); // console.log(this.OptionsInstances[optCode]);
        console.log(optCode); console.log(subtypeKey);

        let prevFilter = this.state.filterSearchValue.map(filter => filter)
        const type = false != subtypeKey ? subtypeKey : this.type
        let filterSearch = this.state.filterSearchValue // [false != subtypeKey ? subtypeKey : this.type]
        let newFilterSearchType = filterSearch[type]
        // let newFilter = []
        if (newFilterSearchType.includes(optCode)) {
            // newFilter = this.state.filterSearchValue.filter(el => el != newValue)
            this.state.filterSearchLabel = this.state.filterSearchLabel.filter(el => el != this.OptionsInstances[optCode].props.name)
            this.state.filterSearchValue[type] = newFilterSearchType.filter(el => el != optCode)
        } else {
            this.state.filterSearchLabel.push(this.OptionsInstances[optCode].props.name)
            this.state.filterSearchValue[type].push(optCode)
        }
        const updatedFilterValue = this.transformFilterSearchValue(this.state.filterSearchValue, optCode, prevFilter)
        // console.log(this.OptionsInstances[optCode].props.name);
        this.Filter.registerChoice(
            this.contentTransformCallback(this.state.filterSearchLabel),
            updatedFilterValue, // this.valueTransformCallback(updatedFilterValue),
            subtypeKey
        )
        // console.log(this.Filter); // console.log(this.OptionsInstances[optCode]);
    }

    // ACTIVATED BY TOP HEADER -> PASSED LIKE CALLBACKS VARIABLED
    closePanel() {
        // console.log('You Close the filters: ' + this.type); // let trg = e.target // trg.closest('.cc-fe_srp-filter__panel').classList.remove('open')
        this.getDomInstance(this.config.domInstanceSelector).classList.remove('open')
    }

    saveClosePanel(e) {
        e.preventDefault()
        // console.log('You Save & Close the filters: ' + this.type); // let trg = e.target // trg.closest('.cc-fe_srp-filter__panel').classList.remove('open')

        this.closePanel() // this.getDomInstance(this.config.domInstanceSelector).classList.remove('open')
        // console.log('You want ressend Filter Value by Class List to Router??');
    }

    resetPanel(e) {
        const { domInstanceSelector, baseStyleClass, selectedStyleClass } = this.config
        // console.log('Reset all options of all panels ???');
        this.callbacks.Router.pingResetRequest()
        this.closePanel()
    }

    updatePanel(props) {
        console.log(props); console.log(this);

        let newState = {
            options: this.saveSafePropertyProps(props, 'options', []), // props.options,
            filterSearchValue: [],
            filterSearchLabel: [],
            lastCronology: [],
        }

        if (false != this.Filter.subtype) {
            Object.keys(this.Filter.subtype).map(subtypeKey => {
                newState.filterSearchValue[subtypeKey] = []
            })
        } else {
            newState.filterSearchValue[this.Filter.type] = []
        }
        Object.keys(newState.options).map(index => {
            const indexOption = this.state.options[index]
            this.state.options[index] = {
                indexOption,
                ...newState.options[index]
            }
        })
        this.state.options.filter(filter => {
            return (this.ccHasProperty(filter, 'code') && '' != filter.code)
        }).map(option => {
            option.parentType = this.type
            option.onClickOption = this.onClickOptionCallback.bind(this)
            // Check if it's undefined -> NB -> SHIPS "disabled" return with code='' by OccupancySearch
            if (option.selected) {
                newState.filterSearchLabel.push(option.name)
                // this.state.filterSearchValue.push(option.code)
                if (option.hasOwnProperty('subParentType')) {
                    newState.filterSearchValue[option.subParentType].push(option.code)
                } else {
                    newState.filterSearchValue[option.parentType].push(option.code)
                } // this.state.filterSearchValue.push(newSearch) 
            }
        })
        this.state.filterSearchValue = newState.filterSearchValue
        this.state.filterSearchLabel = newState.filterSearchLabel
        this.state.lastCronology = newState.lastCronology

        // UPDATE FILTER CLASS
        console.log('Update FILTER CLASS');
        const updatedFilterValue = this.transformFilterSearchValue(newState.filterSearchValue)
        this.Filter.updateState(
            this.contentTransformCallback(this.state.filterSearchLabel),
            updatedFilterValue, // this.valueTransformCallback(updatedFilterValue)
        )

        // UPDATE OPTIONS
        console.log('Update OPTIONS CLASSES');
        newState.options.filter(opt => opt.hasOwnProperty('code') && '' != opt.code).map(option => {
            const key = option.code // console.log(option); // console.log('OLD OPTION CLASS'); // console.log(key);
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
        })

    }

    getButtonsHtmlJson(options) {

        return options.map(opt => { return this.OptionsInstances[opt.code].getHtmlJson() })
    }

    getHtmlJson() {
        const { type, ...props } = this // console.log('List JSON: ' + type);
        const { baseStyleClass, htmlLabels } = this.config

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
                                                class: baseStyleClass + " " + baseStyleClass + "-body__info-clear " + type
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
                                    children: this.getButtonsHtmlJson(this.state.options)
                                }
                            ]
                        }
                    ]
                },
            ],
        }
    }
}

export default FilterPanel