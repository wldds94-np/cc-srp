import ccObject from "../abstract/ccObject";

class Option extends ccObject {
    /**
     * PROPS
     */
    // code
    // enabled
    // name
    constructor(props) {
        super(props)

        this.props = Object.assign(props, {}) // console.log(props);
        this.parentType = this.saveSafePropertyProps(props, 'parentType', '')
        this.subParentType = this.saveSafePropertyProps(props, 'subParentType', this.parentType)

        this.state = {
            selected: this.saveSafePropertyProps(props, 'selected', false),
            enabled: this.saveSafePropertyProps(props, 'enabled', true),
            error: {
                hasError: this.saveSafePropertyProps(props, 'hasError', false),
                errorMsg: this.saveSafePropertyProps(props, 'errorMsg', 'Invalid Input'),
            }
        }

        this.config = {
            ...this.config,
            selectedStyleClass: 'selected', // disabledStyleClass: 'disabledTest',
            disabledStyleClass: 'disabled',
            parentElementToStyle: false,
            abortToStyleElement: false,
            tagName: this.saveSafePropertyProps(props, 'tagName', 'button'),
            domInstanceSelector: `${this.saveSafePropertyProps(props, 'tagName', 'button')}.${this.parentType}[value='${this.props.code}']`, // this.saveSafePropertyProps(props, 'tagName', 'button') + `[value=${this.props.code}]`,
        }

        this.update = {
            callbacks: {},
            // optionsCallbacks: {},
            // filterCallbacks: {}
        }

        this.callbacks = {
            // ON RUN - SETTED BY FilterPanel
            FilterPanel: {
                onClickCallback: this.saveSafePropertyProps(props, 'onClickOption', (...args) => { return }),
            }
        }
        // console.log(this);
        // if (this.parentType == 'ships') {
        //     console.log(this);
        // }
    }

    clickChoice(e) {
        console.log('Clicking choice by OPTIONS'); // console.log(e);
        e.preventDefault()
        e.stopImmediatePropagation() // console.log('I have to select Choice');

        const { enabled, selected } = this.state
        if (!enabled) { /* if (!this.state.enabled && !this.state.selected ) { */
            console.log('It\'s not enabled');
            return false
        }

        const eTarget = e.target // console.log(eTarget);

        this.state.selected = !selected

        this.updateStyleSelectedButton(eTarget) // .bind(this)   

        // PASS TO THE FILTER PANEL -> then TO THE FILTER the event click is fired
        this.callbacks.FilterPanel.onClickCallback(this.props.code, this.subParentType)
    }

    updateStyleSelectedButton(eTarget) {
        const { selectedStyleClass, disabledStyleClass, parentElementToStyle, abortToStyleElement, tagName } = this.config
        const selected = this.state.selected
        // const {filterSearchValue} = this.state

        let button = $(eTarget), buttonStyled = undefined // console.log(parentElementToStyle);
        console.log(button);
        if (false != parentElementToStyle) { // console.log('Different'); // button = eTarget.closest(`.search-filter-calendar`)
            buttonStyled = $(eTarget).closest(`${parentElementToStyle}`)
        }

        if (eTarget.tagName != tagName) { // USE nodeType for updating status ??
            button = $(eTarget).closest(tagName)
        }

        if (!$(buttonStyled).hasClass(disabledStyleClass)) {
            if (!abortToStyleElement) {
                if (selected) {
                    undefined != buttonStyled ? buttonStyled.addClass(selectedStyleClass) : button.addClass(selectedStyleClass)
                    // undefined != buttonStyled ? buttonStyled.classList.add(selectedStyleClass) : button.classList.add(selectedStyleClass)
                } else {
                    undefined != buttonStyled ? buttonStyled.removeClass(selectedStyleClass) : button.removeClass(selectedStyleClass)
                    // undefined != buttonStyled ? buttonStyled.classList.remove(selectedStyleClass) : button.classList.remove(selectedStyleClass)
                }
            }
        }
    }

    updateStyleDisabledButton(eTarget) {
        const { disabledStyleClass, parentElementToStyle, abortToStyleElement, tagName } = this.config
        // const {filterSearchValue} = this.state

        let button = eTarget, buttonStyled = undefined // console.log(parentElementToStyle);

        if (false != parentElementToStyle) { // console.log('Different'); // button = eTarget.closest(`.search-filter-calendar`)
            buttonStyled = eTarget.closest(`${parentElementToStyle}`)
        }

        if (eTarget.tagName != tagName) { // USE nodeType for updating status ??
            button = eTarget.closest(tagName)
        }

        // console.log(button);
        if (!abortToStyleElement) {
            if (undefined != buttonStyled) {
                buttonStyled.toggleClass(disabledStyleClass)
            } else {
                button.toggleClass(disabledStyleClass)
            }
            // undefined != buttonStyled ? buttonStyled.classList.toggle(disabledStyleClass) : button.classList.toggle(disabledStyleClass)
        }
    }

    updateState(newState, props, prevState = { selected: this.state.selected, enabled: this.state.enabled }) {
        const { selected, enabled } = newState
        const actualSelect = prevState.selected
        const actualEnabled = prevState.enabled // console.log(this); // console.log(selected); // console.log(enabled); // console.log(actualSelect); // console.log(actualEnabled);
        // console.log('UPDATING STATE IN OPTIONS', this.config.domInstanceSelector);

        let DOMInstance = $(this.config.domInstanceSelector) // document.querySelector(this.config.domInstanceSelector)
        // console.log(DOMInstance);
        if (actualEnabled != enabled) {
            // console.log('OPTION FILTER - UPDATE RETURN - I have to UPDATE enabled');
            this.state.enabled = enabled
            this.updateStyleDisabledButton(DOMInstance)
        }

        if (actualSelect != selected) {
            // console.log('OPTION FILTER - UPDATE RETURN - I have to UPDATE selected');
            this.state.selected = selected
            this.updateStyleSelectedButton(DOMInstance)
        }

        // Start the callback stack
        this.startFunctionsStack(this.update.callbacks, props)
        // Object.keys(this.update.callbacks).map(index => {
        //     // console.log(index);
        //     if ('function' == typeof this.update.callbacks[index]) {
        //         this.update.callbacks[index](props)
        //     }
        // })
    }

    getHtmlJson() {
        const { baseStyleClass, selectedStyleClass, disabledStyleClass, tagName } = this.config
        const { code, name } = this.props
        const { enabled, selected } = this.state
        return {
            tagName: tagName, // this.config.tagName,
            attrs: {
                class: baseStyleClass + " " + baseStyleClass +
                    "-filters__action-value" + (enabled ? '' : " " + disabledStyleClass) + (selected ? ' ' + selectedStyleClass : '') + ' ' + this.parentType,
                value: code,
            },
            content: name,
            props: {
                onclick: this.clickChoice.bind(this)
            },
        }

    }
}

export default Option