import Option from "../Option";

class OptionMonth extends Option {
    constructor(props) {
        // console.log(props);
        super(props)

        this.config = {
            ...this.config,
            domInstanceSelector: this.config.tagName + '.' + this.parentType + '[value="' + this.props.code.substring(0,7) + '"]',
            parentElementToStyle: '.search-filter-calendar.' + this.parentType,
            startedStyleClass: 'start', // startedStyleClass: 'start'
            endedStyleClass: 'end', //  endedStyleClass: 'end',
        }

        this.state.start = this.saveSafePropertyProps(props, 'start', false) // false,
        this.state.end = this.saveSafePropertyProps(props, 'end', false) // false,

        // console.log('MONTHS OPTIONS');
        // console.log(this);
    }

    getHtmlJson() {
        const { baseStyleClass, selectedStyleClass, disabledStyleClass, startedStyleClass, endedStyleClass, tagName } = this.config
        const { code, name, year, month } = this.props
        const { enabled, start, end, selected } = this.state

        return {
            attrs: {
                class: "search-filter-calendar" + (enabled ? '' : ' ' + disabledStyleClass) + (selected ? ' ' + selectedStyleClass : '') +
                    (start ? ' ' + startedStyleClass : '') + (end ? ' ' + endedStyleClass : '') + ' ' + this.parentType,
            },
            children: [
                {
                    tagName: tagName, // "button",
                    attrs: {
                        class: "cc-fe_srp cc-fe_srp-filters__action-value" + ' ' + this.parentType, //  " + (opt.enabled ? '' : this.disabledClassStyle)
                        value: year + '-' + month
                    },
                    props: {
                        onclick: this.clickChoice.bind(this)
                    },
                    // props: {
                    //     onclick: this.updateLimits.bind(this)
                    // },
                    children: [
                        {
                            tagName: 'span',
                            content: name
                        }
                    ]
                }
            ]
        };
    }
}

export default OptionMonth