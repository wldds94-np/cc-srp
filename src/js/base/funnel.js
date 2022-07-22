class Funnel {
    constructor() {
        // configs HTML JS VAR  // console.log(configs); // EMPTY -> console.log(configs.srpFilters);
        const { taxCurrencyCodes } = configs
        this.taxCurrencyCodes = taxCurrencyCodes
        // general HTML JS VAR // console.log(general);
        const memberLoyaltyLevel = 'anonymous' // general
        this.memberLoyaltyLevel = memberLoyaltyLevel

        // FILTERS KEY OF SRP - We can use dynamic array by the responses ?? THINK!
        this.filtersKey = ['departures', 'portOfCalls', "ships", "durations", 'flightRequired', 'offers', "destinations", "months"] // ['departures', 'portOfCalls', "destinations", "months", "offers"]

        // SRData is printed in HTML DOM by System
        // Retrieve the data of searchResultsV2
        this.SRPData = {} // console.log(SRData);
        Object.keys(SRData.components.data).map(index => { // let item = SRData.components.data[index] //console.log(SRData.components.data[index].type); //onsole.log(item.type);
            if ('searchResultsV2' == SRData.components.data[index].type) this.SRPData = SRData.components.data[index]
        }) // console.log(this.SRPData);

        // Retrieve the ATTRIBUTES
        this.searchBarV2Data = this.SRPData.attributes.childComponents.find(child => {
            return child.type == 'searchBarV2'
        })
        // console.log(this.searchBarV2Data);
        // THE ATTRIBUTES OF LABEL AND OPTIONS
        // Usefull base information -- USE This for instanciate the labels of SearchFilters
        this.childAttributes = this.searchBarV2Data.attributes //  console.log(this.searchBarV2Data.attributes);


        /** SEARCH FILTERS */ // ARRAY | Occupancy - Destinations - Months (period) 
        this.searchFilters = {
            // OCCUPANCY
            // occupancy,
            occupancy: {
                type: 'occupancy',
                filter: this.childAttributes.filters.find(el => el.filterAPIKey === 'occupancy'),
                ageSelectorType: this.childAttributes.ageSelectorType,
                calendarFormat: this.childAttributes.calendarFormat,
                defaultGuests: this.childAttributes.defaultGuests,
                enableAgeSelector: this.childAttributes.enableAgeSelector,
                maxGuests: this.childAttributes.maxGuests,
                modalAddKid: this.childAttributes.modalAddKid,
                modalEditDOB: this.childAttributes.modalEditDOB,
                occupancyValues: this.childAttributes.occupancyValues,
                labels: this.childAttributes.labels,
                // USE FOR THE PANEL LOOP
                attributes: {
                    options: this.childAttributes.occupancyValues,
                },
            },
            // DESTINATIONS
            destinations: {
                list: this.childAttributes.destinationList, // destinationList: this.childAttributes.destinationList,
                listLang: this.childAttributes.destinationLangList, // destinationLang: this.childAttributes.destinationLangList,
                filter: this.childAttributes.filters.find(el => el.filterAPIKey === 'destinations'),
                labels: this.childAttributes.labels,
            },
            // MONTHS
            months: {
                list: this.childAttributes.months,
                listLang: this.childAttributes.monthsLang,
                filter: this.childAttributes.filters.find(el => el.filterAPIKey === 'months'),
                labels: this.childAttributes.labels,
            },
        }
        // this.searchData = {}
        // console.log(this.searchFilters);

        // SECONDARY FILTER - ARRAY | The secondary filters // embarkPort - Duration - Ships - Offers - Flight+Cruis - PortsOfCall
        // FILTER LABEL
        /**
         * {
            "filterTitleDesktop": "Porto di partenza",
            "filterAPIKey": "departures",
            "filterTagKey": "{!tag=embarkTag}embarkPortCode",
            "isExpanded": true
        }
        ---- USE THIS filterTagKey FOR MERGE SELECTED VALUE
         */
        this.SRPDataSecondaryFilters = this.SRPData.attributes.header.secondaryFilters // USE THIS FOR THE LABEL
        // console.log(this.SRPDataSecondaryFilters);

        // THE PARAMETERS FOR INSTANCE ALL CLASSES
        this.filtersData = {
            search: {
                // months: {
                //     filterClassProps: {},
                //     filterPanelProps: {},
                //     filterPanelOptionsProps: {},
                // }
            },
            secondary: {
                // filter: {},
                // panel: {},
                // options: {},
                // departures: {}
            }
        }

        // SYNCRONIZATIONS DATA ENTRY
        this.promosDetails = {}
        // OFFERS SECTION VARIABLES
        // DEALS
        this.offerDeals = [] // offerDeals // console.log(this.offerDeals);
        // DISCOUNTS
        this.specialOffers = [] // specialOffers // console.log(this.specialOffers);

        // Catch the request for initializa the occupancy
        this.promosBestPrice = {} // ARGS OF THE REQUEST - NOT THE RESPONSE
        // OCCUPANCY RESPONSE DATA

        // Entry Variables for filtersList (options list parameters (USE enabled/disbled in RESYNC)) - // Object { filterKey : DATA FILTER }
        this.entryOccSrcFilterList = {}
        // this.entrySrpDataSecondaryFilters = {}

        // Initial Rearrange entry Filter Class Data
        this.SRPDataSecondaryFilters.map(filter => {
            const keyFilterLabel = filter.filterAPIKey
            if (this.filtersKey.includes(keyFilterLabel)) {
                if (keyFilterLabel == "flightRequired") {
                    filter.realFilterTagKey = filter.filterTagKey
                    filter.filterTagKey = filter.filterTagKey.replace(/{{\w+}}/, taxCurrencyCodes).replace(/{{\w+}}/, memberLoyaltyLevel)
                }
                this.filtersData.secondary[keyFilterLabel] = {}
                this.filtersData.secondary[keyFilterLabel].filter = filter // console.log(this.filtersData.secondary.filter[keyFilterLabel]);
            }
            // this.entrySrpDataSecondaryFilters[keyFilterLabel] = filter
        })
        // Add the SearchFilters
        Object.keys(this.searchFilters).map(filterType => {
            if (this.filtersKey.includes(filterType)) {
                this.filtersData.search[filterType] = {}
                this.filtersData.search[filterType]['filter'] = this.searchFilters[filterType].filter // console.log(this.filtersData.secondary.filter[keyFilterLabel]);
                // this.filtersData.search.filter[filterType] = this.searchFilters[filterType].filter
            }

        })
        console.log(this.filtersData);
    }

    syncPromos(data) {
        console.log('Sync Promos...');
        // console.log(data);

        this.promosDetails = data

        const { offerDeals, specialOffers } = data
        this.offerDeals = offerDeals // console.log(this.offerDeals);
        this.specialOffers = specialOffers // console.log(this.specialOffers);

        /* {
            "Bronze": {
                "occupancyType": "Bronze",
                "occupancySaleValue": "10"
            },
            ...eccs
        } */
        const occupancySaleListMameber = this.memberLoyaltyLevel
        this.occupancySaleList = data.occupancySaleList
        // Add my (anonymous) ANONYMOUS MEMBER
        this.occupancySaleList[occupancySaleListMameber] = {
            occupancyType: occupancySaleListMameber,
            occupancySaleValue: "20"
        }

        this.searchFilters.occupancy['occupancySaleList'] = this.occupancySaleList

        this.isInitializedPromos = true

    }

    syncBestPrice(data) {
        // Catch the request ARGS of Best Price for OCCUPANCY & PRIORITY(sorting)
        console.log('Sync BestPrice...'); // console.log(data); // console.log(JSON.parse(data.body))

        this.promosBestPrice = JSON.parse(data.body)
        // console.log(this.promosBestPrice);
        this.isInitializedBestPrc = true
    }

    syncOccupancySearch(data, query) {
        // I HAVE TO PREPARE THE ALL DATA FOR THE FilterPanel INSTANCE
        console.log('Sync OccupancySearch by Funnel...');
        // console.log(data);

        // Sync the all Filters by OccSrc minus occupancy
        // Start filtering the all options that has atributes options lenght 0 and is not in my filtersKey
        // { type: ..., atributes: { options: {} } }
        this.newSecondaryFilters = data.filterList.filter(filter => {
            let options = filter.attributes.options // return options.length
            if (this.filtersKey.includes(filter.type)) {
                return options.length // ?? Check if you want return by default with leng 0
            }
            return false
        })
        // Add the occupancy 
        // this.newSecondaryFilters.push(this.getFilterBySRPByKey('occupancy')) // console.log(this.newSecondaryFilters);

        let isFilterPanelResettable = false
        this.newSecondaryFilters.map(optionsObject => { // 
            // console.log(optionsObject);

            // SEARCH PANEL & FILTER VARIABLES
            let filterSearchValue = []
            let filterSearchLabel = []

            // FOR OFFERS
            let subtypePropsOffers = {} // const thatTaxCurrencyCodes = taxCurrencyCodes
            let valuesArrayOptions = [] // let valuesDiscountType = 

            const { type } = optionsObject
            let filter = {}
            let filterLayoutType = ''
            // console.log(this.filtersData);
            if (this.filtersData.search.hasOwnProperty(type)) {
                filter = this.filtersData.search[type].filter
                filterLayoutType += 'search'
            } else {
                filter = this.filtersData.secondary[type].filter
                filterLayoutType += 'secondary'
            }
            // console.log(filter);
            const { /* filterAPIKey,  */filterTagKey } = filter
            // HERE THERE'S NOT THE OCCUPANCY
            let options = optionsObject.attributes.options
            let limits = {} // FOR MONTS PANEL

            if (type == 'offers') {
                // DEALS
                this.offersVisiblePaxType = this.getVisiblePaxType()/* .map(offers => {}) */ // 
                // console.log(this.offersVisiblePaxType);
                // DISCOUNT
                this.offersVisibleDiscountType = this.getVisibleDiscountType(options) // DISCOUNT
                // console.log(this.offersVisibleDiscountType);
                // this.ribbons = this.joinRibbons() // console.log(this.ribbons);
                options = this.joinRibbons()
            }

            options.map(opt => {
                // ADD THE TAG NAME
                opt.tagName = 'button'

                // Preparing the data of options
                switch (type) {
                    case 'months':
                        const filterMonthsOptions = this.searchFilters.months.list.options // [opt.month] // console.log(filterMonths);
                        const filterSearch = filterMonthsOptions[Number(opt.month) - 1][opt.month] // console.log(filterSearch); console.log(opt);

                        opt.label = filterSearch.label
                        opt.name = filterSearch.value
                        opt.ID = opt.year + '-' + opt.month
                        break;
                    case 'flightRequired':
                        // console.log(options); console.log(this.searchBarV2Data.attributes.labels.falseFlightLabel); console.log(this.searchBarV2Data.attributes.labels.trueFlightLabel);
                        if (opt.code == 'true') {
                            opt.name = this.searchBarV2Data.attributes.labels.trueFlightLabel
                        } else {
                            opt.name = this.searchBarV2Data.attributes.labels.falseFlightLabel
                        }
                        break;
                    default:
                        options.map(opt => {
                            opt.ID = opt.code
                        })
                        break;
                }

                // FOR selected & filterSearchValue / filterSearchLabel / // Filter SUBTYPE
                switch (type) {
                    case 'months':
                        let valuesArrayMonths = undefined != query[filterTagKey] ? query[filterTagKey].split(',') : []
                        let sorted = valuesArrayMonths.sort()
                        let start = undefined != sorted[0] ? sorted[0] : false
                        let end = undefined != sorted[1] ? sorted[1] : false
                        limits = {
                            start: start,
                            end: end,
                        }
                        opt.start = start == opt.code
                        opt.end = end == opt.code // end ? end.includes(opt.code) : false
                        if (sorted.includes(opt.code)) {
                            isFilterPanelResettable = true
                            opt.selected = true
                            filterSearchLabel.push(opt.name + " " + opt.year)
                            if (filterSearchValue.hasOwnProperty(type)) {
                                filterSearchValue[type].push(opt.code)
                            } else {
                                filterSearchValue[type] = []
                                filterSearchValue[type].push(opt.code)
                            }
                        } else {
                            if (!filterSearchValue.hasOwnProperty(type)) {
                                filterSearchValue[type] = []
                            }
                            opt.selected = false
                        }
                        opt.parentType = type
                        opt.subParentType = type // false
                        // console.log(options);
                        break;
                    case 'offers':
                        console.log(opt);
                        if (opt.hasOwnProperty('isCCFareType') && true == opt.isCCFareType) {
                            subtypePropsOffers['fare'] = {
                                filterTagKey: '{!tag=offerTag}fareType', // '{!tag=offerTag}fareType={cc*\w+*cc}'
                                filterTagValue: '{cc*filterSearch*cc}',
                                regex: /\{cc\*filterSearch\*cc\}/,
                                indexTag: false,
                            }

                            let filterTagFareType = '{!tag=offerTag}fareType'
                            if (undefined != query[filterTagFareType]) {
                                let offersArray = query[filterTagFareType].split(',')

                            }
                            let offersArray = undefined != query[filterTagFareType] ? query[filterTagFareType].split(',') : []
                            offersArray.map(offer => {
                                valuesArrayOptions.push(offer)
                            })
                            if (valuesArrayOptions.includes(opt.code)) {
                                isFilterPanelResettable = true
                                opt.selected = true
                                filterSearchLabel.push(opt.name)
                                if (Array.isArray(filterSearchValue['fare'])) {
                                    filterSearchValue['fare'].push(opt.code)
                                } else {
                                    filterSearchValue['fare'] = []
                                    filterSearchValue['fare'].push(opt.code)
                                }
                            } else {
                                if (!Array.isArray(filterSearchValue['fare'])) {
                                    filterSearchValue['fare'] = []
                                }
                                opt.selected = false
                            }
                            opt.subParentType = 'fare'
                        } else {
                            const baseTag = 'campaignId_'
                            let indexTag = baseTag + this.taxCurrencyCodes + '_' // console.log(indexTag); // console.log(variable.indexOf(indexTag));

                            subtypePropsOffers['discount'] = {
                                filterTagKey: '{!tag=offerTag}' + indexTag + '{cc*filterSearch*cc}', // '{!tag=offerTag}campaignId_EUR_{cc*\w+*cc}=anonymous'
                                filterTagValue: 'anonymous',
                                regex: /\{cc\*filterSearch\*cc\}/,// /{\c+\*/, // \w+\c+\*}
                                indexTag: indexTag,
                            }
                            // {!tag=offerTag}campaignId_EUR_PRIVILEG,ITAFK051=anonymous // let fullStringParam = // let campaignParam = ''
                            Object.keys(query).map(variable => { // console.log(variable); // console.log(variable.indexOf(indexTag));
                                if (variable.indexOf(indexTag)) {
                                    // console.log('Find IndexTag');
                                    let stringSearchCampaign = variable.split(indexTag) // console.log(stringSearchCampaign); // console.log(stringSearchCampaign[0]); // console.log(stringSearchCampaign[1]);
                                    let discountArray = undefined != stringSearchCampaign[1] ? stringSearchCampaign[1].split(',') : []
                                    // console.log(discountArray);
                                    discountArray.map(discount => {
                                        valuesArrayOptions.push(discount)
                                    })
                                    // valuesArrayOffers = undefined != stringSearchCampaign ? stringSearchCampaign.split(',') : []
                                }
                            })

                            // filter.subtypeProps = subtypePropsOffers ---- // Adjust the placeholder in the name
                            opt.name = opt.name.replace(/{\w+}/, this.occupancySaleList[this.memberLoyaltyLevel].occupancySaleValue)
                            opt.subParentType = 'discount'
                            if (valuesArrayOptions.includes(opt.code)) {
                                isFilterPanelResettable = true
                                opt.selected = true
                                filterSearchLabel.push(opt.name)
                                if (Array.isArray(filterSearchValue['discount'])) {
                                    filterSearchValue['discount'].push(opt.code)
                                } else {
                                    filterSearchValue['discount'] = []
                                    filterSearchValue['discount'].push(opt.code)
                                }
                            } else {
                                if (!Array.isArray(filterSearchValue['discount'])) {
                                    filterSearchValue['discount'] = []
                                }
                                opt.selected = false
                            }
                            opt.subParentType = 'discount'
                        }
                        opt.parentType = type
                        break;
                    default:
                        let valuesArray = undefined != query[filterTagKey] ? query[filterTagKey].split(',') : []
                        if (valuesArray.includes(opt.code)) {
                            isFilterPanelResettable = true
                            opt.selected = true
                            filterSearchLabel.push(opt.name)
                            if (filterSearchValue.hasOwnProperty(type)) {
                                filterSearchValue[type].push(opt.code)
                            } else {
                                filterSearchValue[type] = []
                                filterSearchValue[type].push(opt.code)
                            }
                        } else {
                            if (!filterSearchValue.hasOwnProperty(type)) {
                                filterSearchValue[type] = []
                            }
                            opt.selected = false
                        }
                        opt.parentType = type
                        opt.subParentType = type // false
                        break;
                }

                // ADDED THE BACKGROUND PROP FOR DESTINATIONS
                if (type == 'destinations') {
                    const filterDestOptions = this.searchFilters[type].list
                    const destOptions = filterDestOptions.filter(item => item.code == opt.code)[0] // console.log(filter); // console.log(opt);
                    opt.destinationImage = destOptions.destinationImage
                }
            })

            // if (type == 'flightRequired') {
            //     filter.realFilterTagKey = filter.filterTagKey
            //         filter.filterTagKey = filter.filterTagKey.replace(/{{\w+}}/, this.taxCurrencyCodes).replace(/{{\w+}}/, this.memberLoyaltyLevel)
            // }
            // ADD FILTER SUBTYPE & PROPS
            switch (type) {
                case 'offers':
                    filter.subType = { ...subtypePropsOffers }
                    filter.search = valuesArrayOptions
                    break;
                default:
                    filter.subType = []
                    const subtypeProps = {
                        filterTagKey: filter.filterTagKey, // '{!tag=offerTag}fareType={cc*\w+*cc}'
                        filterTagValue: '{cc*filterSearch*cc}',
                        regex: /\{cc\*filterSearch\*cc\}/,
                        indexTag: false,
                    }
                    filter.subType = {}
                    filter.subType[type] = subtypeProps
                    filter.label = filterSearchLabel
                    filter.search = filterSearchValue
                    filter.valorised = filterSearchLabel.length
                    break;
            }
            console.log(filter); // console.log(type); // console.log(options);

            // ADD THE TYPE IN THE OBJECT
            // this.filtersData[filterLayoutType][options][type] = [options]
            // console.log(this.filtersData[filterLayoutType]);
            this.filtersData[filterLayoutType][type].options = options
            this.filtersData[filterLayoutType][type].panel = {
                filterSearchValue: filterSearchValue,
                filterSearchLabel: filterSearchLabel,
                labels: this.childAttributes.labels, // GENERIC LABELS FOT TOPHeader ecc
                type: type,
                options: options,
                limits: undefined != limits ? limits : {}
            }

            // READJUST 

        })

        // I HAVE TO UPDATE the isFilterPanelResettable
        // with the        
        this.newSecondaryFilters.map(filterType => {
            const { type } = filterType
            let filter = {}
            let filterLayoutType = ''
            // console.log(this.filtersData);
            if (this.filtersData.search.hasOwnProperty(type)) {
                filter = this.filtersData.search[type].filter
                filterLayoutType += 'search'
            } else {
                filter = this.filtersData.secondary[type].filter
                filterLayoutType += 'secondary'
            }

            this.filtersData[filterLayoutType][type].panel.isResettable = isFilterPanelResettable
        })
        console.log('LAST SYNC RESULTS: ');
        console.log(this.filtersData);
    }

    /**
     * ----------------------------------
     */
    /**
     * AUXILIARY FUNCTIONS
     */
    /**
     * Search a filter by filterApiKey
     * 
     * @param {string} key 
     * @returns Object
     */
    getFilterBySRPByKey(key) {
        const filter = this.searchFilters.filter(searchFilter => {
            const search = searchFilter.filter,
                type = search.filterAPIKey // console.log(type);
            return type == key
        })

        return filter.length ? filter[0] : {}
    }

    /**
     * Search all Enable FareType ()
     * 
     * @returns Array
     */
    getVisibleDiscountType(offersOptions) {
        console.log(offersOptions); console.log(this.specialOffers);
        let filtered = []
        offersOptions.filter(opt => {
            if (/* opt.enabled &&  */this.specialOffers.hasOwnProperty(opt.code)) {
                const item = this.specialOffers[opt.code] // console.log(item.endDate);
                let stringDate = '' != item.endDate ? item.endDate : (d => new Date(d.setDate(d.getDate() - 1)))(new Date).toDateString() // console.log(stringDate); console.log(new Date(stringDate).getTime()); console.log(new Date().getTime());
                if (Number(new Date(stringDate).getTime()) > Number(new Date().getTime()) && 'ribbon' == item.type) { // console.log('Pass'); // console.log(opt);
                    opt.subParentType = 'discount'
                    filtered.push(opt)
                }
            }
        }) // let newEl = this.options.filter(opt => opt.enabled && specialOffers.hasOwnProperty(opt.code)).map(value => { value }) // console.log('Enabled by f: ' + JSON.stringify(filtered));

        return filtered // console.log(filtered)
    }

    /**
     * Search all Visible PaxType ()
     * 
     * @returns Array
     */
    getVisiblePaxType() {
        console.log(this.offerDeals);
        let filtered = []
        Object.keys(this.offerDeals).filter(key => { // onsole.log(this.offerDeals[key]);

            if (!this.offerDeals[key]['disabledForSearch'] && '' != this.offerDeals[key]['persuasiveBadge']) {
                let newEl = Object.assign(this.offerDeals[key], {}) // console.log(newEl); // console.log('I have to push');
                newEl.isCCFareType = true
                newEl.subParentType = 'fare'

                filtered.push(newEl)
            }
        })

        return filtered
    }

    /**
     * 
     * @returns Array
     */
    joinRibbons() {
        // const updates = Object.fromEntries(this.offersVisibleDiscountType.map(o => [o.name, o])),
        //     result = this.offersVisiblePaxType.map(o => updates[o.name] || o);
        const result = this.offersVisiblePaxType.concat(this.offersVisibleDiscountType)

        return result
    }
}

export default Funnel