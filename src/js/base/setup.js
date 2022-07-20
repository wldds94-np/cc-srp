// import filterLabel from "../classes/filterLabel";
import Filter from "../components/Filter"
import FilterPanel from "../components/FilterPanel"
// import filterList from "../classes/filterList";
// import Duration from "../filter/duration";
// import flightRequired from "../filter/flightRequired";
// import Offers from "../filter/offers";

// // Search Components
// import searchLabel from "../search/searchLabel";
// import occupancyLabel from "../search/occupancyLabel";

// import destinationList from "../search/components/destinationList";
// import monthsList from "../search/components/monthsList";
// import occupancyList from "../search/components/occupancyList";

// Router
// import Router from './Router'

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

        // HASHCHANGE 
        // window.addEventListener('hashchange', this.checkUrl.bind(this))
    }

    syncOccupancySearch(data) {
        console.log('Sync OccupancySearch By Setup...');
        // console.log(data);

        const query = this.Router.getQuery() // console.log(query);
        this.Funnel.syncOccupancySearch(data, query) // console.log(this.Funnel);

        if (this.isInitializedOccSrc) {
            // console.log(this.Funnel);
            // I have intanciated all classes
            // console.log('IT\'S INITIALIZED... I HAVE TO RESYNC THE ALL OPTIONS');

            // Update the options inside the Panels Classes
            this.Funnel.filtersKey.map(filterKey => {
                // console.log(filterKey); // console.log(this.FiltersPanelControllers[filterKey]); console.log(this.Funnel);
                // console.log({ ...this.entryOccSrcFilterList[filterKey], ...{ filterLabelClass: this.filterLabelInstance[filterKey] } });
                this.FiltersPanelControllers[filterKey].updatePanel.apply(this.FiltersPanelControllers[filterKey], [{ ...this.Funnel.entryOccSrcFilterList[filterKey] }]) // .updatePanel({ ...this.Funnel.entryOccSrcFilterList[filterKey] })
            })
        } else {
            this.isInitializedOccSrc = true
        }

    }

    init() {
        // let queryURL = this.Router.getQuery() // console.log(queryURL);
        // Instanciate the Panel Class
        this.Funnel.filtersKey.map(filterKey => { // console.log({ ...this.entryOccSrcFilterList[filterKey], ...{ filterLabelClass: this.filterLabelInstance[filterKey] } });
            const entryFilter = {
                ...this.Funnel.entrySrpDataSecondaryFilters[filterKey],
                onSaveChoice: this.Router.pingRequestToHash.bind(this.Router),
            }

            this.FiltersPanelControllers[filterKey] = new FilterPanel({
                ...this.Funnel.entryOccSrcFilterList[filterKey],
                ...{ filterLabelClass: new Filter(entryFilter) /* this.filterLabelInstance[filterKey] */ },
                ...{ labels: this.Funnel.childAttributes.labels },
                // RESETTING
                onResetPanel: this.Router.resetQuery.bind(this.Router)
            })
        })
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

        let newHtmlSearchElements = [
            {
                attrs: {
                    class: "cc-fe_srp cc-fe_srp-container"
                },
                children: [
                    {
                        attrs: {
                            class: "cc-fe_srp cc-fe_srp-filters"
                        },
                        children: this.Funnel.SRPDataSecondaryFilters.filter(el => {

                            if (undefined != this.FiltersPanelControllers[el.filterAPIKey]) {
                                // console.log(el); console.log(this.FiltersPanelControllers);
                                // console.log(this.FiltersPanelControllers[el.filterAPIKey]);
                                // console.log(this.FiltersPanelControllers[el.filterAPIKey].Filter);
                                // console.log(this.FiltersPanelControllers[el.filterAPIKey].Filter.props);
                                // console.log(this.FiltersPanelControllers[el.filterAPIKey].Filter.props.hasOwnProperty('filterAPIKey'));

                                return this.FiltersPanelControllers[el.filterAPIKey].Filter.props.hasOwnProperty('filterAPIKey') // this.filterLabelInstance.hasOwnProperty(el.filterAPIKey)   
                            } else {
                                return false
                            }
                        }).map(filter => {
                            console.log(filter);
                            return this.FiltersPanelControllers[filter.filterAPIKey].Filter.getHtmlJson() // this.filterLabelInstance[filter.filterAPIKey].getHtmlJson()
                        })
                    },
                ]
            },
        ]

        // let newHtmlListElements = this.entryVarsList
        // let newHtmlListElements = this.entryOccSrcFilterList.map(entry => {
        //     console.log(entry);
        // })
        // console.log(this.Funnel.entryOccSrcFilterList);
        let newHtmlPanelElements = []
        Object.keys(this.Funnel.entryOccSrcFilterList).map(type => {
            if (this.FiltersPanelControllers.hasOwnProperty(type)) {
                const res = this.FiltersPanelControllers[type] // console.log(res);
                newHtmlPanelElements.push(this.FiltersPanelControllers[type].getHtmlJson())
            }
            // return this.filterLabelInstance.hasOwnProperty(type) ? 
            // console.log(type);
        })

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
        Object.keys(this.FiltersPanelControllers).map(key => {
            console.log('OPEN PING'); console.log(this.FiltersPanelControllers[key]); console.log(this.FiltersPanelControllers[key].Filter);
            this.FiltersPanelControllers[key].Filter.state.openPing = true // this.filterLabelInstance[key].state.openPing = true
        })
    }


    getObjInArryByKey(arr, key, search) {
        const filter = arr.filter(item => {
            const value = item[key]
            // type = search.value // console.log(type);
            return value == search
        })

        return filter.length ? filter[0] : {}
    }

    getFilterBySRPByKey(key) {
        const filter = this.searchFilters.filter(searchFilter => {
            const search = searchFilter.filter,
                type = search.filterAPIKey // console.log(type);
            return type == key
        })

        return filter.length ? filter[0] : {}
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














    // draw() {
    //     // eslint-disable-next-line no-console
    //     // console.log('Initialize Setup'); // console.log(SRData.components.data); // console.log(SRData.components); // console.log(SRData);

    //     this.panelsContainer = document.querySelector('body') // this.srpRes = this.domContainer.querySelector('.srp-header-results') // console.log(this.domContainer);

    //     this.domContainer = document.querySelector(this.srpMob)
    //     this.srpRes = this.domContainer.querySelector(this.srpResInfo)

    //     this.headerSearch = [
    //         {
    //             attrs: {
    //                 class: "cc-fe_srp cc-fe_srp-container"
    //             },
    //             children: [
    //                 {
    //                     attrs: {
    //                         class: "cc-fe_srp cc-fe_srp-search"
    //                     },
    //                     children: [
    //                         {
    //                             attrs: {
    //                                 class: "cc-fe_srp cc-fe_srp-search_wrap"
    //                             },
    //                             children: [
    //                                 {
    //                                     tagName: "span",
    //                                     attrs: {
    //                                         class: "cc-fe_srp cc-fe_srp-search__info"
    //                                     },
    //                                     content: '2 adults, Dec 2022, Mediterranean',
    //                                 },
    //                                 {
    //                                     // tagName: "i",
    //                                     attrs: {
    //                                         class: "cc-fe_srp cc-fe_srp-search__action"
    //                                     },
    //                                     props: {
    //                                         onclick: function (e) { $('.cc-fe_srp-search_display').toggleClass('open') }
    //                                     }
    //                                 },
    //                             ]
    //                         },
    //                         {
    //                             attrs: {
    //                                 class: "cc-fe_srp cc-fe_srp-search_display"
    //                             },
    //                             children: this.searchFilters.map(searchFilter => {
    //                                 console.log(searchFilter);
    //                                 let search = searchFilter.filter
    //                                 const type = search.filterAPIKey // console.log(type);
    //                                 let filterSearchClass = undefined
    //                                 switch (type) {
    //                                     case 'months':
    //                                         search.labelSeparator = ' -'
    //                                         filterSearchClass = new searchLabel(search)
    //                                         break;
    //                                     case 'occupancy':
    //                                         search.occupancyInfo = searchFilter
    //                                         filterSearchClass = new occupancyLabel(search)
    //                                         break;
    //                                     default:
    //                                         filterSearchClass = new searchLabel(search)
    //                                         break;
    //                                 }
    //                                 this.filterLabelInstance[type] = filterSearchClass
    //                                 // if (type == 'months') search.labelSeparator = ' -' // { console.log('monthsSep'); search.labelSeparator = ' -' }

    //                                 // let filterSearchClass = new searchLabel(search)
    //                                 this.filterLabelInstance[type] = filterSearchClass
    //                                 // return filterSearchClass.getHtmlJson()
    //                             })

    //                         },
    //                         {
    //                             attrs: {
    //                                 class: "cc-fe_srp cc-fe_srp-search_overlay",
    //                             },
    //                             props: {
    //                                 onclick: (e) => {
    //                                     e.stopImmediatePropagation()
    //                                     console.log('You clicked on Overlay');
    //                                     $('.cc-fe_srp-search_display').removeClass('open')
    //                                 }
    //                             }
    //                         },
    //                     ]
    //                 },
    //                 {
    //                     attrs: {
    //                         class: "cc-fe_srp cc-fe_srp-filters"
    //                     },
    //                     children: this.SRPDataSecondaryFilters.map(filter => {
    //                         const keyFilterLabel = filter.filterAPIKey
    //                         let filterClass = new filterLabel(filter)
    //                         this.filterLabelInstance[keyFilterLabel] = filterClass
    //                         // console.log(this.filterLabelInstance);
    //                         // return filterClass.getHtmlJson()
    //                     })
    //                 },
    //             ]
    //         },
    //     ]

    //     this.panelSearch = []

    //     for (let newEl in this.headerSearch) {
    //         let el = this.headerSearch[newEl]
    //         let newDom = this.paint(el)
    //         this.domContainer.insertBefore(newDom, this.srpRes)
    //     }
    // }

}

export default Setup;