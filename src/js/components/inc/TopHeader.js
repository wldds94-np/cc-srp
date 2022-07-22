import ccObject from "../../abstract/ccObject"

class TopHeader extends ccObject {
    constructor(props) { // back = 'Cancel', save = 'Apply', ...props
        super(props)

        this.config = {
            ...this.config,
            close: this.saveSafePropertyProps(props, 'close'),
            save: this.saveSafePropertyProps(props, 'save'),
            onClose: this.saveSafePropertyProps(props, 'onClose'),
            onSave: this.saveSafePropertyProps(props, 'onSave'),
        }
    }

    getHtmlJson() {
        const {close, save, baseStyleClass, onClose, onSave} = this.config
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
                        class: baseStyleClass + " " + baseStyleClass + "-action apply"
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