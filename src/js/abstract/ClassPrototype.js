class ClassPrototype {

    constructor() { }

    /** ARRAY **/
    countIndexInArray(array, index) {
        if (Array.isArray(array)) {
            // let count = 0
            return array.reduce((prev, next) => {
                return (next == index) ? Number(prev) + 1 : prev
                // if (next == index) { return Number(prev) + 1 }; return prev
            }, 0)
            // return count
        }
        return 0
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

    objEquals(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    arraysMatch(arr1, arr2) {
        let key1 = Object.keys(arr1)
        let key2 = Object.keys(arr2)

        // Check if the arrays are the same length
        if (key1.length !== key2.length) return false;

        return key1.every((val, index) => arr1[val] === arr2[val])

    };

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

    /*** ########## END ARRAY ########## */

    /**
     * DATE & AGES
     */
    /**
     * Calc ages
     */
    calcAge(birthday) {
        let birthdayDate = new Date(birthday);
        let today = new Date();

        var years = (today.getFullYear() - birthdayDate.getFullYear());

        if (today.getMonth() < birthdayDate.getMonth() ||
            today.getMonth() == birthdayDate.getMonth() && today.getDate() < birthdayDate.getDate()) {
            years--;
        }

        return Number(years);
    }

    /**
     * Generate Date by years
     */
    getDateByYear(years) {
        // console.log(years);
        let date = new Date()
        let birthdates = date.setFullYear(date.getFullYear() - years)
        let newDate = new Date(birthdates)
        return newDate.toISOString().split("T")[0]
    }

    /**
     * HTML ELEMENTS
     * @param {Object} 
     * @returns {domNode}
     */
    paint({ tagName = "div", attrs = {}, props = {}, dataset = {}, content = null, children = [], ...otherprops }) {
        let dom = document.createElement(tagName)
        for (let attr of Object.keys(attrs)) {
            dom.setAttribute(attr, attrs[attr])
        }

        if (props) Object.assign(dom, props)

        if (null != content) dom.textContent = content;

        for (let data of Object.keys(dataset)) {
            dom.dataset[data] = dataset[data]
        }

        for (let child in children) {
            dom.appendChild(this.paint(children[child]))
        }

        return dom
    }
}

export default ClassPrototype