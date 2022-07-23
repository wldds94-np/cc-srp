import Option from "../Option";

class OptionDestination extends Option {
    constructor(props) {
        super(props)

        this.config = {
            ...this.config,
            destinationImage: this.saveSafePropertyProps(props, 'destinationImage', ''),
        }

        // console.log(this);
    }

    getHtmlJson() {
        const { baseStyleClass, selectedStyleClass, disabledStyleClass, tagName, destinationImage } = this.config
        const { code, name } = this.props
        const { enabled, selected } = this.state

        return {
            tagName: tagName,
            attrs: {
                class: baseStyleClass + " " + baseStyleClass + "-filters__action-value" + 
                    (enabled ? '' : " " + disabledStyleClass) + (selected ? ' ' + selectedStyleClass : '') + ' ' + this.parentType,
                value: code
            },
            props: {
                onclick: this.clickChoice.bind(this)
            },
            children: [
                {
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-filters__action-image",
                    },
                    props: {
                        style: `background-image: url(${destinationImage})`
                    }
                },
                {
                    attrs: {
                        class: baseStyleClass + " " + baseStyleClass + "-filters__action-label",
                    },
                    children: [
                        {
                            content: name,
                        },
                    ]
                }
            ]
           
        }
    }
}

export default OptionDestination