import ccObject from "../../abstract/ccObject"

class DatePicker extends ccObject {
    constructor(props) {
        super()

        this.props = {
            ...this.props,
            index: this.saveSafePropertyProps(props, 'index', 0),
            counterType: this.saveSafePropertyProps(props, 'counterType', 'A'),
            injectabled: this.saveSafePropertyProps(props, 'injectabled', true),
            labels: this.saveSafePropertyProps(props, 'labels', {}),
            endModalTitle: this.saveSafePropertyProps(props, 'endModalTitle', ''),
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
            // guestAges: this.saveSafePropertyProps(props, 'guestBirthdates', '') != '' ? this.calcAge(this.saveSafePropertyProps(props, 'guestBirthdates', '')) : '',
        }

        console.log('DATEPICKER');
        console.log(this);
    }

    inputChange(e) {
        // console.log('CHANGING'); // console.log(e.target.value);

        this.setGuestBirthdate(e.target.value)
        // this.setGuestAge()
    }

    getHtmlJson() {
        const {baseStyleClass, baseNodeSelector, labelsType} = this.config
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
                                        placeholder: 'dd / mm / yyyy',
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