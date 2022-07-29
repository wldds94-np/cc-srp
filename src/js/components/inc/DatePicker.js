import ccObject from "../../abstract/ccObject"

class DatePicker extends ccObject {
    constructor(props) {
        super(props)

        this.props = {
            ...this.props,
            index: this.saveSafePropertyProps(props, 'index', 0),
            counterType: this.saveSafePropertyProps(props, 'counterType', 'A'),
            injectabled: this.saveSafePropertyProps(props, 'injectabled', true),
            labels: this.saveSafePropertyProps(props, 'labels', {}),
            endModalTitle: this.saveSafePropertyProps(props, 'endModalTitle', ''),
            minAge: this.saveSafePropertyProps(props, 'minAge', 'dd/mm/yyyy'),
            maxAge: this.saveSafePropertyProps(props, 'maxAge', 'dd/mm/yyyy'),
        }

        this.config = {
            ...this.config,
            labelsType: this.props.labels[this.props.counterType],
            baseNodeSelector: this.saveSafePropertyProps(props, 'baseNodeSelector', this.props.counterType + '-cc-age-picker-inputs-container-'),
            inputNodeSelector: this.saveSafePropertyProps(props, 'inputNodeSelector', '#cc-age-picker-value-' + this.props.index),
            dateFormat: this.saveSafePropertyProps(props, 'dateFormat', 'dd/mm/yyyy'),
        }

        this.state = {
            ...this.state,
            // occupancy: this.saveSafePropertyProps(props, 'occupancy', 'A'),
            guestBirthdates: this.saveSafePropertyProps(props, 'guestBirthdates', ''),
            error: {
                hasError: !this.isValidDate(this.saveSafePropertyProps(props, 'guestBirthdates', '')),
                types: {
                    empty: {
                        isOn: !this.validateDOB(this.saveSafePropertyProps(props, 'guestBirthdates', '')),
                        label: this.saveSafePropertyProps(props, 'emptyErrorLabel', ''),
                        validator: this.validateDOB.bind(this)
                    },
                    minError: {
                        isOn: !this.validateMax(this.saveSafePropertyProps(props, 'guestBirthdates', '')),
                        label: this.saveSafePropertyProps(props, 'minErrorLabel', ''),
                        validator: this.validateMax.bind(this)
                    },
                    maxError: {
                        isOn: !this.validateMin(this.saveSafePropertyProps(props, 'guestBirthdates', '')),
                        label: this.saveSafePropertyProps(props, 'maxErrorLabel', ''),
                        validator: this.validateMin.bind(this)
                    },
                }
            }
            // guestAges: this.saveSafePropertyProps(props, 'guestBirthdates', '') != '' ? this.calcAge(this.saveSafePropertyProps(props, 'guestBirthdates', '')) : '',
        }

        this.Errors = []
        // this.state.error.types = 

        this.callbacks = {
            ...this.callbacks,
            Counter: {
                // ON RUN - SETTED BY COUNTER -> Passed by FilterPanelOccupancy
                onChangeInput: this.saveSafePropertyProps(props, 'onChangeInput', (...args) => { return true }),
            }
        }

        // console.log('DATEPICKER');
        // console.log(this);
    }

    // USE FOR CHECKING THE EMPTY ERROR AND A VALID DATE
    validateDOB(dob) {
        // console.log(dob); // return true
        var pattern = /^([0-9]{4}-([0-9]{2})-([0-9]{2}))$/;
        if (dob == null || dob == "" || !pattern.test(dob)) { // errMessage += "Invalid date of birth\n";
            return false;
        } else {
            return true
        }
    }

    validateMin(dob) {
        const {minAge, /* maxAge */} = this.props // console.log(labels);
        const guestAges = this.calcAge(dob)

        if (!isNaN(guestAges)) {
            return guestAges >= minAge
        } else {
            return false
        }
    }

    validateMax(dob) {
        const {/* minAge, */ maxAge} = this.props // console.log(labels);
        const guestAges = this.calcAge(dob)

        if (!isNaN(guestAges)) {
            return guestAges <= maxAge
        } else {
            return false
        }
    }


    inputChange(e) {
        // console.log('CHANGING'); // console.log(e.target.value);
        this.setGuestBirthdate(e.target.value)

        const isValid = this.isValidDate(e.target.value) // !this.validateDOB(e.target.value)
        this.state.error.hasError = !isValid // console.log(this.state.error.hasError);

        Object.keys(this.state.error.types).map(type => { // console.log(type, this.state.error.types[type].validator(e.target.value));
            this.state.error.types[type].isOn = ! (this.state.error.types[type].validator(e.target.value))
        }) // console.log(this.state.error.types);

        this.cleanErrors()
        
        if (!isValid) {
            this.addErrors()
        }

        this.callbacks.Counter.onChangeInput(/* this.state.error.hasError */)

        this.restyleInput()
    }

    cleanErrors() {
        $('#' + this.config.baseNodeSelector + this.props.index).closest('div').find('small').remove()
    }

    addErrors() {
        // console.log(this.state.error.types);
        let types = Object.keys(this.state.error.types).filter(type => this.state.error.types[type].isOn) // console.log(types);
        if (types.length) {

            for (let i = 0; i < 1; i++) {
                $('#' + 'cc-age-picker-value-' + this.props.index).closest('div').append('<small class="cc-srp_fe-input-error">' + this.state.error.types[types[i]].label + '</small>')
            }
        }
    }

    isValidDate(dob) {
        const {minAge, maxAge} = this.props // console.log(labels);
        const guestAges = this.calcAge(dob)
        if (!isNaN(guestAges)) {
            // console.log(guestAges); console.log(minAge, maxAge); console.log(guestAges >= minAge && guestAges <= maxAge);
            const isValid = (guestAges >= minAge && (maxAge > 0 ? guestAges <= maxAge : true)) && this.validateDOB(dob) // console.log(isValid);
            return isValid
        } else {
            return false
        }
        
    }

    restyleInput() {
        // INSERT / REMOVE THE ERROR
    }

    getHtmlJson() {
        const {baseStyleClass, baseNodeSelector, labelsType, dateFormat} = this.config
        const {index, endModalTitle} = this.props
        const {guestBirthdates} = this.state
        return {
            attrs: {
                id: baseNodeSelector + index,
                class: 'cc-age-picker-inputs-container',
            },
            children: [
                {
                    attrs: {
                        class: 'cc-fe_srp cc-age-picker data-input-container',
                    },
                    children: [
                        {
                            attrs: {
                                class: 'cc-age-picker label-container',
                            },
                            content: labelsType.singular + ' ' + index + ' - ' + endModalTitle,// 'KID ' + index + ' - DATE OF BIRTH',
                        },
                        {
                            attrs: {
                                class: 'cc-age-picker input-container',
                            },
                            children: [
                                {
                                    tagName: 'input',
                                    attrs: {
                                        id: 'cc-age-picker-value-' + index,
                                        class: 'cc-age-picker input-container',
                                        type: 'date',
                                        name: 'cc-age-picker',
                                        placeholder: dateFormat, // 'dd / mm / yyyy',
                                        value: guestBirthdates
                                    },
                                    props: {
                                        onchange: this.inputChange.bind(this),
                                        value: guestBirthdates
                                    }
                                }
                            ],
                        }
                    ]
                }
            ]
        }
    }

    getDomElement() {
        return this.props.injectabled ? this.paint(this.getHtmlJson()) : {}
    }

    remove() {
        // console.log('Remove the DATEPICKER node');
        if (this.props.injectabled) {
            $('#' + this.config.baseNodeSelector + this.props.index).remove()
        }
    }

    /** SET / GET */
    getGuestBirthdate() {
        return this.state.guestBirthdates
    }
    setGuestBirthdate(date) {
        this.state.guestBirthdates = date
    }

    getGuestAge() {
        return this.state.guestAges
    }
    setGuestAge(age = this.calcAge(this.state.guestBirthdates)) {
        this.state.guestAges = age
    }
    
    getOccupancyType() {
        const {labels} = this.props // console.log(labels);
        const guestAges = this.calcAge(this.state.guestBirthdates)

        let labelsRes = Object.keys(labels).filter(type => {
            const {range} = labels[type] // console.log(range); console.log(labels[type]); console.log(this.state.guestAges);
            return range.min <= guestAges && (range.max < 0 || range.max >= guestAges)
        }) // console.log(labelsRes);
        return labelsRes.length ? labelsRes[0] : 'NOT FIND'
    }

    getDatePickerObj() {
        // const occ = this.getOccupancyType()
        return {
            occupancy: this.getOccupancyType(), // occ
            guestBirthdates: this.state.guestBirthdates,
            guestAges: this.calcAge(this.state.guestBirthdates),
        }
    }
}

export default DatePicker