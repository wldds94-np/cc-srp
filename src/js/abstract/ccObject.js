class ccObject {
    constructor(props) {
        this.props = Object.assign(props, {}) // console.log(props);

        this.config = {
            baseStyleClass: this.saveSafePropertyProps(this.props, 'baseStyleClass', 'cc-fe_srp'),
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

    saveSafePropertyProps(props, key, fallback = '') {
        if ('object' == typeof props) {
            return props.hasOwnProperty(key) ? props[key] : fallback
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
}

export default ccObject