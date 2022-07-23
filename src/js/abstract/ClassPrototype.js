class ClassPrototype {
    constructor() {
        // this.props = Object.assign(props, {})
    }

    /**
     * EQUALITY
     * @param {Array} a 
     * @param {Array} b 
     * @returns {Boolean}
     */
    arrayEquals(a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}

export default ClassPrototype