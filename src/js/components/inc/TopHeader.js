import ccObject from "../../abstract/ccObject"

class TopHeader extends ccObject {
    constructor(props) { // back = 'Cancel', save = 'Apply', ...props
        super(props)

        this.config = {
            ...this.config,
            saveContainerSelector: this.saveSafePropertyProps(props, 'saveContainerSelector', '.' + this.config.baseStyleClass + "-action.apply." + this.saveSafePropertyProps(props, 'type', '')),
            close: this.saveSafePropertyProps(props, 'close'),
            save: this.saveSafePropertyProps(props, 'save'),
            onClose: this.saveSafePropertyProps(props, 'onClose'),
            onSave: this.saveSafePropertyProps(props, 'onSave'),
        }

        this.props = {
            ...this.props,
            type: this.saveSafePropertyProps(props, 'type', ''),
        }

        this.state = {
            ...this.state,
            isSafe: this.saveSafePropertyProps(props, 'isSafe', true),
        }
    }

    setIsSafe(isSafe) {
        console.log(isSafe);
        this.state.isSafe = isSafe

        this.updateSave()
    }

    updateSave() {
        const {saveContainerSelector, disabledStyleClass} = this.config
        const {isSafe} = this.state // const {type} = this.props
        console.log(saveContainerSelector);
        console.log($(saveContainerSelector));
        if (isSafe) {
            $(saveContainerSelector).removeClass(disabledStyleClass)            
        } else {
            $(saveContainerSelector).addClass(disabledStyleClass)
        }
    }

    getHtmlJson() {
        const {close, save, baseStyleClass, onClose, onSave, disabledStyleClass} = this.config
        const {isSafe} = this.state
        const {type} = this.props
        return {
            attrs: {
                class: baseStyleClass + " " + baseStyleClass + "-filter__panel-content_header"
            },
            children: [
                {
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-action cancel"
                    },
                    props: {
                        onclick: onClose
                    },
                    content: close
                },
                {
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-action apply " + type + (isSafe ? '' : ' ' + disabledStyleClass)
                    },
                    props: {
                        onclick: onSave
                    },
                    content: save
                }
            ]
        }
    }
}

export default TopHeader