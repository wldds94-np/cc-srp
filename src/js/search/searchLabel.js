import filterLabel from "../classes/filterLabel"

class searchLabel extends filterLabel {
    constructor(props) {
        
        super(props)
        this.state = {
            ...this.state,
            filterTitleMobile: this.saveSafePropertyProps(this.props, 'filterTitleMobile'),
            filterDescription: this.saveSafePropertyProps(this.props, 'filterDescription'),
            nextFilter: this.saveSafePropertyProps(this.props, 'nextFilter'),
            defaultFilterValue: this.saveSafePropertyProps(this.props, 'defaultFilterValue'),
        } // console.log(this.state);

        this.hasCounter = false

        this.differentContentContainer = '.cc-fe_srp-search__display-action'

        // console.log(this);
        // this.state = Object.assign(props, {})
        // this.filterTitleDesktop = this.changeFilterTitle()
        // this.state.defaultFilterValue = 
        // this.labelSeparator = props.hasOwnProperty('labelSeparator') ? props.labelSeparator : ','
    }

    getContent() {
        return this.state.hasOwnProperty('actualFilterValue') ? this.state.actualFilterValue : this.state.defaultFilterValue
    }

    // updateContent() {
    //     let newContent = ''
    //     if (this.filterLabels.length) {
    //         // this.filterLabels.map(value => {
    //         //     newContent += value + this.labelSeparator + ' '
    //         // })
    //         console.log(this.filterLabels);
    //     } else {
    //         newContent += this.getContent() // this.state.defaultContent // this.state.filterTitleDesktop
    //     }
    //     this.setContent(newContent.substring(0, newContent.length - (this.labelSeparator.length + 1)), '.cc-fe_srp-search__display-action')
    // }

    getHtmlJson() {
        const {tagName, filterAPIKey, filterTagKey, filterTitleDesktop, ...props} = this.state
        return {
            tagName: tagName,
            attrs: {
                id: "cc-fe_srp-" + filterAPIKey,
                class: "cc-fe_srp cc-fe_srp-search_display-container " + filterAPIKey,
            },
            props: {
                onclick: props.cbOnClick || this.openFiltersPanel.bind(this)
            },
            children: [
                {
                    attrs: {
                        class: 'cc-fe_srp cc-fe_srp-search__display-icon'
                    },
                },
                {
                    attrs: {
                        class: 'cc-fe_srp cc-fe_srp-search__display-action'
                    },
                    content: this.getContent(),
                }                
            ]
        }
    }
}

export default searchLabel