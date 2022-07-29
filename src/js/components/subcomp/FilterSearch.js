import Filter from "../Filter";

class FilterSearch extends Filter {
    constructor(props) {
        super(props)

        this.props = {
            ...this.props,
            nextFilter: this.saveSafePropertyProps(this.props, 'nextFilter'),
        }

        this.config = {
            ...this.config,
            hasCounter: false,
        }
  
        // console.log('FILTER SEARCH');
        // console.log(this);
    }

    getHtmlJson() {
        const { tagName, filterAPIKey, filterTitleDesktop } = this.props
        const { baseStyleClass, selectedStyleClass, disabledStyleClass, valorisedStyleClass, contentContainer } = this.config
        const { label, valorised } = this.state // console.log(baseStyleClass);

        return {
            tagName: tagName,
            attrs: {
                id: baseStyleClass + "-" + filterAPIKey,
                class: baseStyleClass + ' ' + baseStyleClass + "-search_display-container " + filterAPIKey +
                    (valorised ? " " + valorisedStyleClass : ""),
            },
            props: {
                onclick: this.openFiltersPanel.bind(this),
            },
            children: [
                {
                    attrs: {
                        class: 'cc-fe_srp cc-fe_srp-search__display-icon'
                    },
                },
                {
                    attrs: {
                        class: contentContainer, // 'cc-fe_srp cc-fe_srp-search__display-action'
                    },
                    content: this.getRealStringLabel(label), // this.getDefault(this.generateLabelStringContent(label)),
                }
            ]
        }
    }
}

export default FilterSearch