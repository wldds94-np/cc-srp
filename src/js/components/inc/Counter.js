import ccObject from "../../abstract/ccObject"
import DatePicker from "./DatePicker"

class Counter extends ccObject {
    constructor(props = {}) {
        super(props)

        this.config = {
            ...this.config,
            contentContainerValueSelector: '.cc-age-button_label-value.' + this.saveSafePropertyProps(props, 'type', ''),
            datePickerContainerSelector: '.cc-age-button-picker-inputs-container.' + this.saveSafePropertyProps(props, 'type', ''),
            minValue: this.saveSafePropertyProps(this.props, 'minValue', 0),
        }

        this.props = {
            ...this.props,
            initialValue: this.saveSafePropertyProps(props, 'value', 0),
            labelName: this.saveSafePropertyProps(props, 'labelName', ''), // [] // 'A' or 'C','I'
            type: this.saveSafePropertyProps(props, 'type', ''), // [] // 'A' or 'C','I'
            datePicker: this.saveSafePropertyProps(props, 'datePicker', {}),
        }

        this.state = {
            ...this.state,
            value: this.saveSafePropertyProps(props, 'value', 0),
            maxValue: this.saveSafePropertyProps(props, 'maxValue', 4),
            search: this.saveSafePropertyProps(props, 'search', []),
        }       

        this.callbacks = {
            ...this.callbacks,
            FilterPanel: {
                // ON RUN - SETTED BY FilterPanel
                onBeforeAlterCounter: this.saveSafePropertyProps(props, 'onBeforeAlterCounter', (...args) => { return }),
                onDetractAlterCounter: this.saveSafePropertyProps(props, 'onDetractAlterCounter', (...args) => { return }),
                onUpdateValidation: this.saveSafePropertyProps(props, 'onUpdateValidation', (...args) => { return }),
            }
        }

        // DATE PICKERS CLASSES
        this.DatePickersInstances = this.generateNewDatePickersInstances() // []

        console.log('COUNTER');
        console.log(this);
    }

    /**
     * 
     * DATEPICKERS
     */
    generateNewDatePickersInstances() {
        let res = []
        console.log(this.callbacks);
        const length = this.state.search.length
        for (let i = 1; i <= length; i++) {
            res.push(
                new DatePicker({
                    ...this.props.datePicker,
                    index: i,
                    counterType: this.props.type,
                    guestBirthdates: this.state.search[i - 1].guestBirthdates,
                    onChangeInput: this.onChangeInput.bind(this)
                }))
        }

        return res
    }

    onChangeInput(/* isValid */) {
        // console.log(isValid);
        this.callbacks.FilterPanel.onUpdateValidation()
    }

    deleteDatePicker(index = -1) {
        const lenght = index < 0 ? this.DatePickersInstances.length - 1 : index
        if (lenght >= 0) {
            this.DatePickersInstances[lenght].remove()
            // delete from this instance
            this.DatePickersInstances.pop()
        }
    }
    /**
     * END
     * DATEPICKERS
     */

    /**
     * SEARCH
     */
    getSearch() {
        console.log(this);
        let searchObjs = []
        Object.keys(this.DatePickersInstances).map(index => {
            searchObjs.push(this.DatePickersInstances[index].getDatePickerObj())
        })

        return searchObjs
    }

    setSearch(search) {
        this.state.search = search
    }


    /**
     * 
     * EVENTS 
     */
    onDetractCounter(e) {
        const { minValue } = this.config
        const {type} = this.props

        if (this.state.value <= minValue) {
            return
        }

        const { updatebled, maxValue } = this.callbacks.FilterPanel.onBeforeAlterCounter(this.state.value - 1, type)
        console.log(updatebled);
        console.log(maxValue);

        if (updatebled) {
            this.state.maxValue = maxValue
            this.state.value = Number(this.state.value) - 1

            this.deleteDatePicker()
            this.restyleOption()

            this.onChangeInput()
        }
    }

    onAddCounter(e) {
        const {type} = this.props

        if (this.state.maxValue < 1) {
            return
        }

        const { updatebled, maxValue } = this.callbacks.FilterPanel.onBeforeAlterCounter(this.state.value + 1, type)
        console.log(updatebled);
        console.log(maxValue);

        if (updatebled) {
            this.state.maxValue = maxValue
            this.state.value = Number(this.state.value) + 1

            const lenght = this.DatePickersInstances.length

            const datePicker = this.props.datePicker
            this.DatePickersInstances[lenght] = new DatePicker({
                ...datePicker,
                index: lenght + 1,
                counterType: this.props.type,
                guestBirthdates: datePicker.labels[this.props.type].subtypeOption.guestBirthdates,
                onChangeInput: this.onChangeInput.bind(this),
            })
            // this.deleteDatePicker()
            this.restyleOption()

            this.insertDatePicker(lenght, true)
            // $(this.config.datePickerContainerSelector).append(this.DatePickersInstances[lenght].getDomElement())
        }
    }

    insertDatePicker(index, withFocus = false) {
        $(this.config.datePickerContainerSelector).append(this.DatePickersInstances[index].getDomElement())

        if (false != withFocus) {
            $(this.DatePickersInstances[index].config.inputNodeSelector).focus()
        }

        this.callbacks.FilterPanel.onUpdateValidation()
    }

    /**
     * RETURN TO INITIAL STATE (use search state)
     */
    returnToInitialState(maxValue) {
        console.log('COUNTER'); // console.log(maxValue); onsole.log(this); console.log(this.state.search); console.log(this.DatePickersInstances);
        
        const { search } = this.state
        const lenghtPickers = this.DatePickersInstances.length
        const lenghtSearch = search.length // console.log(search.length);

        this.state.maxValue = maxValue
        this.state.value = lenghtSearch

        this.restyleOption() // console.log(this);

        this.redisplayDatePicker()

    }

    /** UPDATE */
    updateCounter(props) {
        this.state.search = this.saveSafePropertyProps(props, 'search', [])

        const lenghtSearch = this.state.search.length // console.log(search.length);

        this.state.maxValue = this.saveSafePropertyProps(props, 'maxValue', 0)
        this.state.value = lenghtSearch

        this.restyleOption() // console.log(this);

        this.redisplayDatePicker()

    }

    redisplayDatePicker() {
        const lenghtPickers = this.DatePickersInstances.length

        // DELETE OLD DATEPICKERS
        for (let i = lenghtPickers - 1; i >= 0; i--) {
            this.deleteDatePicker(i) // this.DatePickersInstances[i].remove(); // this.DatePickersInstances.pop()
        }
        this.DatePickersInstances = this.generateNewDatePickersInstances()
        for (let i = 0; i < this.DatePickersInstances.length; i++) {
            // console.log(this.DatePickersInstances[i]);
            this.insertDatePicker(i)
            // $(this.config.datePickerContainerSelector).append(this.DatePickersInstances[i].getDomElement())
        }
    }

    /** STYLE & CONTENT */
    restyleOption() {
        // LIMITS
        this.setDomLimits()
        // VALUE
        this.setDomValue()
    }

    setDomValue(value = this.state.value) {
        const { contentContainerValueSelector } = this.config
        if (null != $(contentContainerValueSelector)) {
            $(contentContainerValueSelector).text(value)
        }
    }

    setDomLimits() {
        const { type } = this.props
        const { baseStyleClass, disabledStyleClass, minValue } = this.config
        const { value, maxValue } = this.state // console.log(this);
        const $minus = $('.' + baseStyleClass + '-filters__action-value' + '.' + 'minus' + '.' + type),
            $plus = $('.' + baseStyleClass + '-filters__action-value' + '.' + 'plus' + '.' + type) // console.log($minus, $plus);
        // MINUS
        if (value <= minValue) {
            $minus.addClass(disabledStyleClass)
        } else {
            $minus.removeClass(disabledStyleClass)
        }

        // PLUS
        if (maxValue > 0) {
            $plus.removeClass(disabledStyleClass)
        } else {
            $plus.addClass(disabledStyleClass)
        }
    }

    getHtmlJson() {
        const { baseStyleClass, disabledStyleClass, minValue } = this.config
        const { labelName, type } = this.props
        const { value, maxValue } = this.state

        return {
            attrs: {
                class: "cc-age-button-wrapper" + ' ' + type, //  + ' ' + this.parentType,
            },
            children: [
                {
                    attrs: {
                        class: 'cc-age-button-wrapper-container' + ' ' + type, //  + ' ' + this.parentType,
                    },
                    children: [
                        {
                            tagName: 'span',
                            attrs: {
                                class: 'cc-age-button_label'
                            },
                            content: labelName,
                        },
                        {
                            attrs: {
                                class: 'cc-age-button-picker ' + type,
                            },
                            children: [
                                {
                                    tagName: 'button',
                                    attrs: {
                                        class: 'minus ' + baseStyleClass + ' ' + baseStyleClass + '-filters__action-value ' + type + ' ' + (value > minValue ? '' : disabledStyleClass)
                                    },
                                    content: '-',
                                    props: {
                                        onclick: this.onDetractCounter.bind(this), // datePicker.active ? this.minusValueDatepicker.bind(this) : 
                                    }
                                },
                                {
                                    tagName: 'span',
                                    attrs: {
                                        class: 'cc-age-button_label-value ' + type,
                                    },
                                    content: value,
                                },
                                {
                                    tagName: 'button',
                                    attrs: {
                                        class: 'plus ' + baseStyleClass + ' ' + baseStyleClass + '-filters__action-value ' + type + ' ' + (0 < maxValue ? '' : disabledStyleClass) // NOT GOOD I HAVE TO REGISTER WHEN CLICKING IN ALL OPTIONS
                                    },
                                    content: '+',
                                    props: {
                                        onclick: this.onAddCounter.bind(this), // datePicker.active ? this.plusValueDatepicker.bind(this) :
                                    },
                                }
                            ],
                        },
                    ]
                },
                {
                    attrs: {
                        class: 'cc-age-button-picker-inputs-container ' + type,
                    },
                    children: this.DatePickersInstances.filter(filter => filter.props.injectabled).map(datePicker => {
                        return datePicker.getHtmlJson()
                    })
                }
            ]
            // tagName: tagName, // this.config.tagName,
            // attrs: {
            //     class: baseStyleClass + " " + baseStyleClass +
            //         "-filters__action-value" + (enabled ? '' : " " + disabledStyleClass) + (selected ? ' ' + selectedStyleClass : '') + ' ' + this.parentType,
            //     value: code,
            // },
            // content: name,
            // props: {
            //     onclick: () => { console.log('You clicked in occupancy options'); return false } // this.clickChoice.bind(this)
            // },
        }
    }
}

export default Counter