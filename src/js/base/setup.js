import FilterPanel from "../components/FilterPanel"
import Option from "../components/Option"
import Filter from "../components/Filter"

// SUBCOMP
import FilterPanelMonth from "../components/subcomp/FilterPanelMonth"
import OptionMonth from "../components/subcomp/OptionMonth"
import OptionDestination from "../components/subcomp/OptionDestination"
// SEARCH FILTER
import FilterSearch from "../components/subcomp/FilterSearch"

// SERVICES
// import datePicker from "../modules/datePicker"

class Setup {
    constructor(Router, Funnel) {
        // Router CLASS INSTANCE
        this.Router = Router
        this.Funnel = Funnel

        // LIST OF ALL PANEL CONTROLLERS
        this.FiltersPanelControllers = []

        // console.log('Construct Setup');
        this.isInitializedPromos = false
        this.isInitializedBestPrc = false
        this.isInitializedOccSrc = false

        // Filter DOMS ELEMENT STYLE CLASS
        this.srpMob = '.srp-header-mob'
        this.srpResInfo = '.srp-header-results'
    }

    syncOccupancySearch(data) {
        console.log('Sync OccupancySearch By Setup...');
        // console.log(data);

        const query = this.Router.getQuery() // console.log(query);
        this.Funnel.syncOccupancySearch(data, query) // console.log(this.Funnel);

        if (this.isInitializedOccSrc) {
            // console.log(this.Funnel); // I have intanciated all classes
            console.log('IT\'S INITIALIZED... I HAVE TO RESYNC THE ALL OPTIONS');

            // Update the options inside the Panels Classes
            // this.Funnel.filtersKey.map(filterKey => {
            //     // console.log(filterKey); // console.log(this.FiltersPanelControllers[filterKey]); console.log(this.Funnel);
            //     // console.log({ ...this.entryOccSrcFilterList[filterKey], ...{ filterLabelClass: this.filterLabelInstance[filterKey] } });
            //     this.FiltersPanelControllers[filterKey].updatePanel.apply(this.FiltersPanelControllers[filterKey], [{ ...this.Funnel.entryOccSrcFilterList[filterKey] }]) // .updatePanel({ ...this.Funnel.entryOccSrcFilterList[filterKey] })
            // })
            const { search, secondary } = this.Funnel.filtersData

            Object.keys(secondary).map(filterApiKey => {
                switch (filterApiKey) {
                    case 'occupancy':

                        break;

                    default:
                        this.FiltersPanelControllers[filterApiKey].updatePanel({
                            ...secondary[filterApiKey].panel,
                            options: secondary[filterApiKey].options, // OptionsInstances: this.createOptionsPanelArray(secondary[filterApiKey].options),
                            filter: secondary[filterApiKey].filter,

                        })
                        break;
                }
            })

            Object.keys(search).map(filterApiKeySearch => {
                switch (filterApiKeySearch) {
                    case 'occupancy':

                        break;

                    default:
                        this.FiltersPanelControllers[filterApiKeySearch].updatePanel({
                            ...search[filterApiKeySearch].panel,
                            options: search[filterApiKeySearch].options, // OptionsInstances: this.createOptionsPanelArray(secondary[filterApiKey].options),
                            filter: search[filterApiKeySearch].filter,

                        })
                        break;
                }
            })
        } else {
            this.isInitializedOccSrc = true
        }

    }

    init() {
        console.log('Initialization..');

        const { search, secondary } = this.Funnel.filtersData
        // console.log(search, secondary);

        // Initialize all search components
        Object.keys(search).map(filterSearchApiKey => {
            switch (filterSearchApiKey) {
                case 'months':
                    this.FiltersPanelControllers[filterSearchApiKey] = new FilterPanelMonth({
                        ...search[filterSearchApiKey].panel, // PANEL DATA
                        OptionsInstances: this.createOptionsPanelArray(search[filterSearchApiKey].options, 'code', OptionMonth),
                        FilterClass: new FilterSearch({
                            ...search[filterSearchApiKey].filter,
                            onSaveChoice: this.Router.pingRequestToHash.bind(this.Router),
                        }),
                        // callbacks
                        onResetPanel: this.Router.resetQuery.bind(this.Router),
                    })
                    break;
                case 'destinations':
                    this.FiltersPanelControllers[filterSearchApiKey] = new FilterPanel({
                        ...search[filterSearchApiKey].panel, // PANEL DATA
                        OptionsInstances: this.createOptionsPanelArray(search[filterSearchApiKey].options, 'code', OptionDestination),
                        FilterClass: new FilterSearch({
                            ...search[filterSearchApiKey].filter,
                            onSaveChoice: this.Router.pingRequestToHash.bind(this.Router),
                        }),
                        // callbacks
                        onResetPanel: this.Router.resetQuery.bind(this.Router),
                    })
                    break;
                default:
                    break;
            }
        })

        // Initialize all filters (secondary) components
        Object.keys(secondary).map(filterApiKey => {
            switch (filterApiKey) {
                // case 'occupancy':
                //     break;

                default:
                    this.FiltersPanelControllers[filterApiKey] = new FilterPanel({
                        ...secondary[filterApiKey].panel, // PANEL DATA
                        // OptionsInstances: secondary[filterApiKey].options.map(opt => {
                        //     return new Option(opt)
                        // }), // 
                        OptionsInstances: this.createOptionsPanelArray(secondary[filterApiKey].options, 'code', Option),
                        FilterClass: new Filter({
                            ...secondary[filterApiKey].filter,
                            onSaveChoice: this.Router.pingRequestToHash.bind(this.Router),
                        }),
                        // callbacks
                        onResetPanel: this.Router.resetQuery.bind(this.Router),
                    })
                    break;
            }
        })
    }

    createOptionsPanelArray(options, code, content) {
        let newObj = []
        options.map(opt => {
            // console.log(opt);
            newObj[opt[code]] = new content(opt)
        })
        return newObj
    }

    draw() {
        // eslint-disable-next-line no-console
        // console.log('Initialize Setup'); // console.log(SRData.components.data); // console.log(SRData.components); // console.log(SRData);
        console.log('Printing Components...');

        // Filters / Search Containers
        this.domContainer = document.querySelector(this.srpMob)
        this.srpRes = this.domContainer.querySelector(this.srpResInfo)

        // FiltersList / SearchList Containers
        this.panelsContainer = document.querySelector('body')

        const { search, secondary } = this.Funnel.filtersData

        let newHtmlSearchElements = [
            {
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-container"
                },
                children: [
                    {
                        attrs: {
                            class: "cc-fe_srp cc-fe_srp-search"
                        },
                        children: [
                            {
                                attrs: {
                                    class: "cc-fe_srp cc-fe_srp-search_wrap"
                                },
                                children: [
                                    {
                                        tagName: "span",
                                        attrs: {
                                            class: "cc-fe_srp cc-fe_srp-search__info"
                                        },
                                        content: '2 adults, Dec 2022, Mediterranean',
                                    },
                                    {
                                        // tagName: "i",
                                        attrs: {
                                            class: "cc-fe_srp cc-fe_srp-search__action"
                                        },
                                        props: {
                                            onclick: function (e) { $('.cc-fe_srp-search_display').toggleClass('open') }
                                        }
                                    },
                                ]
                            },
                            {
                                attrs: {
                                    class: "cc-fe_srp cc-fe_srp-search_display"
                                },
                                children: Object.keys(search).map(searchFilter => {
                                    return this.FiltersPanelControllers[searchFilter].Filter.getHtmlJson()
                                })
                            },
                            {
                                attrs: {
                                    class: "cc-fe_srp cc-fe_srp-search_overlay",
                                },
                                props: {
                                    onclick: function (e) {
                                        e.preventDefault()
                                        e.stopImmediatePropagation()
                                        $('.cc-fe_srp-search_display').removeClass('open')
                                    }
                                }
                            },
                        ]
                    },
                    {
                        attrs: {
                            class: "cc-fe_srp cc-fe_srp-filters"
                        },
                        children: Object.keys(secondary).map(filter => {
                            // console.log(filter);
                            return this.FiltersPanelControllers[filter].Filter.getHtmlJson() // this.filterLabelInstance[filter.filterAPIKey].getHtmlJson()
                        })
                    },
                ]
            },
        ]

        let newHtmlPanelElements = []
        Object.keys(secondary).map(type => {
            if (this.FiltersPanelControllers.hasOwnProperty(type)) {
                // const res = this.FiltersPanelControllers[type] // console.log(res);
                newHtmlPanelElements.push(this.FiltersPanelControllers[type].getHtmlJson())
            }
        })
        Object.keys(search).map(filterSearch => {
            if (this.FiltersPanelControllers.hasOwnProperty(filterSearch)) {
                // const res = this.FiltersPanelControllers[type] // console.log(res);
                newHtmlPanelElements.push(this.FiltersPanelControllers[filterSearch].getHtmlJson())
            } // return this.FiltersPanelControllers[filterSearch].Filter.getHtmlJson() // this.filterLabelInstance[filter.filterAPIKey].getHtmlJson()
        })

        // Before insert the panel then the relative buttons
        for (let newList in newHtmlPanelElements) {
            let elList = newHtmlPanelElements[newList]
            let newDomList = this.paint(elList)
            this.panelsContainer.appendChild(newDomList)
        }

        for (let newEl in newHtmlSearchElements) {
            let el = newHtmlSearchElements[newEl]
            let newDomLabel = this.paint(el)
            this.domContainer.insertBefore(newDomLabel, this.srpRes)
        }

        // Open Ping Requests for all Filter instance class inside Filters Panel - Start to accept requests to Router
        console.log('OPEN PING');
        Object.keys(this.FiltersPanelControllers).map(key => { // console.log(this.FiltersPanelControllers[key]); console.log(this.FiltersPanelControllers[key].Filter);
            this.FiltersPanelControllers[key].Filter.state.openPing = true // this.filterLabelInstance[key].state.openPing = true
        })

        // START THE SERVICES OF CORE DEPENDANT
        // datePicker()
    }

    paint({ tagName = "div", attrs = {}, props = {}, dataset = {}, content = false, children = [], ...otherprops }) {
        let dom = document.createElement(tagName)
        for (let attr of Object.keys(attrs)) {
            dom.setAttribute(attr, attrs[attr])
        }

        if (props) Object.assign(dom, props)

        if (content) dom.textContent = content;

        for (let data of Object.keys(dataset)) {
            dom.dataset[data] = dataset[data]
        }

        for (let child in children) {
            dom.appendChild(this.paint(children[child]))
        }

        return dom
    }
}

export default Setup
