import ClassPrototype from "./ClassPrototype"

class ccObject extends ClassPrototype {
    constructor(props = {}) {
        super()

        this.props = Object.assign(props, {})

        this.config = {
            baseStyleClass: this.saveSafePropertyProps(this.props, 'baseStyleClass', 'cc-fe_srp'),
            selectedStyleClass: 'selected', // disabledStyleClass: 'disabledTest',
            disabledStyleClass: 'disabled',
        }
    }

    ccHasIssetProperty(props, key/* , ...exclude = [undefined, null, ''] */) {
        if (this.ccHasProperty(props, key)) {
            return props.hasOwnProperty(key)
        }
    }

    ccHasProperty(props, key) {
        if ('object' == typeof props) {
            return props.hasOwnProperty(key)
        } else {
            return false
        }
    }

    saveSafePropertyProps(props, key, fallback = '', callback = el => el) {
        if ('object' == typeof props) {
            return props.hasOwnProperty(key) ? callback(props[key]) : fallback
        }
        return fallback
    }

    getDomInstance(selector) {
        if (null != document.querySelector(selector)) {
            this.domInstance = document.querySelector(selector)
            return this.domInstance
        } else {
            return null
        }
    }

    startFunctionsStack(array, args = {}) {
        // Start the callback stack
        Object.keys(array).map(index => { // console.log(index);
            if ('function' == typeof array[index]) {
                array[index](args)
            }
        })
    }
}

export default ccObject