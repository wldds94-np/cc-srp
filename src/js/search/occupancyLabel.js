import searchLabel from "./searchLabel"
// import filterLabel from "../classes/filterLabel"

class occupancyLabel extends searchLabel {
    constructor(props) {

        super(props)

        this.occupancyInfo = this.saveSafePropertyProps(this.props, 'occupancyInfo', {})
        this.state.defaultFilterValue = '2 Adults'
        console.log(this);

        this.getHtmlJson = this.getHtmlJson.bind(this)
    }

    getContent(filterTitleDesktop) {
        return this.state.hasOwnProperty('actualFilterValue') ? this.state.actualFilterValue : this.state.filterTitleDesktop
    }

    // getHtmlJson() {
    //     const { tagName, filterAPIKey, filterTagKey, filterTitleDesktop, ...props } = this.state
    //     console.log(this.state);
    //     console.log(filterTitleDesktop, this.state.defaultFilterValue);
    //     return {
    //         tagName: tagName,
    //         attrs: {
    //             id: "cc-fe_srp-" + filterAPIKey,
    //             class: "cc-fe_srp cc-fe_srp-search_display-container " + filterAPIKey,
    //         },
    //         props: {
    //             onclick: props.cbOnClick || this.openFiltersPanel.bind(this)
    //         },
    //         children: [
    //             {
    //                 attrs: {
    //                     class: 'cc-fe_srp cc-fe_srp-search__display-icon'
    //                 },
    //             },
    //             {
    //                 attrs: {
    //                     class: 'cc-fe_srp cc-fe_srp-search__display-action'
    //                 },
    //                 content: this.getContent(),
    //             }
    //         ]
    //     }
    // }
}

export default occupancyLabel