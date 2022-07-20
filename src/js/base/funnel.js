class Funnel {
    constructor() {
        // configs HTML JS VAR
        // console.log(configs);
        const { taxCurrencyCodes } = configs // console.log(taxCurrencyCodes);
        this.taxCurrencyCodes = taxCurrencyCodes
        // general HTML JS VAR
        // console.log(general);
        const memberLoyaltyLevel = 'anonymous' // general
        this.memberLoyaltyLevel = memberLoyaltyLevel

        // SRData is printed in HTML DOM by System
        console.log(SRData);

        // FILTERS KEY OF SRP - We can use dynamic array by the responses ?? THINK!
        this.filtersKey = ['departures', 'portOfCalls', "ships", "durations", 'flightRequired', 'offers']

        this.SRPData = {}
        Object.keys(SRData.components.data).map(index => { // let item = SRData.components.data[index] //console.log(SRData.components.data[index].type); //onsole.log(item.type);
            if ('searchResultsV2' == SRData.components.data[index].type) this.SRPData = SRData.components.data[index]
        })
        console.log(this.SRPData);

        this.searchBarV2Data = this.SRPData.attributes.childComponents.find(child => {
            return child.type == 'searchBarV2'
        })
        console.log(this.searchBarV2Data);

        // Usefull base information -- USE This for instanciate the labels of SearchFilters
        this.childAttributes = this.SRPData.attributes.childComponents[0].attributes //
        console.log(this.childAttributes);

        /** SEARCH FILTERS */ // ARRAY | Occupancy - Destinations - Months (period) 
        let occupancy = {
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
        }
        this.searchFilters = [
            // OCCUPANCY
            occupancy,
            // DESTINATIONS
            {
                list: this.childAttributes.destinationList, // destinationList: this.childAttributes.destinationList,
                listLang: this.childAttributes.destinationLangList, // destinationLang: this.childAttributes.destinationLangList,
                filter: this.childAttributes.filters.find(el => el.filterAPIKey === 'destinations'),
                labels: this.childAttributes.labels,
            },
            // MONTHS
            {
                list: this.childAttributes.months,
                listLang: this.childAttributes.monthsLang,
                filter: this.childAttributes.filters.find(el => el.filterAPIKey === 'months'),
                labels: this.childAttributes.labels,
            },
        ]
        console.log(this.searchFilters);

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
        console.log(this.SRPDataSecondaryFilters);

        // this.searchFilters.map(item => {
        //     console.log(item);
        // })

        // Entry Variables for filtersList (options list parameters (USE enabled/disbled in RESYNC)) - // Object { filterKey : DATA FILTER }
        this.entryOccSrcFilterList = {}
        this.entrySrpDataSecondaryFilters = {}

        // Rearrange entry data
        this.SRPDataSecondaryFilters.map(filter => {
            switch (filter.filterAPIKey) {
                case "flightRequired":
                    filter.realFilterTagKey = filter.filterTagKey,
                        filter.filterTagKey = filter.filterTagKey.replace(/{{\w+}}/, taxCurrencyCodes).replace(/{{\w+}}/, memberLoyaltyLevel)
                    // console.log(filter.realFilterTagKey);
                    break;

                default:
                    break;
            }
            const keyFilterLabel = filter.filterAPIKey
            this.entrySrpDataSecondaryFilters[keyFilterLabel] = filter
        })
        console.log(this.entrySrpDataSecondaryFilters);

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

    }

    syncPromos(data) {
        console.log('Sync Promos...');
        console.log(data);

        this.promosDetails = data

        const { offerDeals, specialOffers } = data
        this.offerDeals = offerDeals // console.log(this.offerDeals);
        this.specialOffers = specialOffers // console.log(this.specialOffers);

        /* {
            "Bronze": {
                "occupancyType": "Bronze",
                "occupancySaleValue": "10"
            },
            "Silver": {
                "occupancyType": "Silver",
                "occupancySaleValue": "15"
            },
            "Gold": {
                "occupancyType": "Gold",
                "occupancySaleValue": "20"
            },
            "Blue": {
                "occupancyType": "Blue",
                "occupancySaleValue": "5"
            },
            "Platinum": {
                "occupancyType": "Platinum",
                "occupancySaleValue": "20"
            }
        } */
        const occupancySaleListMameber = this.memberLoyaltyLevel
        this.occupancySaleList = data.occupancySaleList
        // Add my (anonymous) ANONYMOUS MEMBER
        this.occupancySaleList[occupancySaleListMameber] = {
            occupancyType: occupancySaleListMameber,
            occupancySaleValue: "20"
        }
        this.searchFilters[0].occupancySaleList = this.occupancySaleList

        this.isInitializedPromos = true
    }

    syncBestPrice(data) {
        // Catch the request ARGS of Best Price for instaciate options
        console.log('Sync BestPrice...');
        console.log(data); // console.log(JSON.parse(data.body))

        this.promosBestPrice = JSON.parse(data.body)

        this.isInitializedBestPrc = true
    }

    syncOccupancySearch(data, query) {
        // I HAVE TO PREPARE THE ALL DATA FOR THE FilterPanel INSTANCE
        console.log('Sync OccupancySearch by Funnel...');
        console.log(data);

        // Sync the secondaryFilters
        this.newSecondaryFilters = data.filterList.filter(filter => {
            let options = filter.attributes.options
            // return options.length
            if (this.filtersKey.includes(filter.type)) {
                return options.length // ?? Check if you want return by default with leng 0
            }
            return false
        })
        // Add the occupancy 
        this.newSecondaryFilters.push(this.getFilterBySRPByKey('occupancy'))
        console.log(this.newSecondaryFilters);
        console.log(this.searchFilters);

        // const query = this.Router.getQuery()
        // Prepare the OccSrcFilterList for the panels data - WITHOUT CLASS INSTANCES (ARE NULL AT THE MOMENT)
        let entryVarsList = this.newSecondaryFilters.map(entry => { // 
            console.log(entry);
            // console.log(this.SRPDataSecondaryFilters);
            let filter = this.SRPDataSecondaryFilters.find(item => {
                // console.log(item); // console.log(this.SRPDataSecondaryFilters[item]);
                return item.filterAPIKey == entry.type
            })
            // HERE THERE'S NOT THE OCCUPANCY

            let options = entry.attributes.options
            switch (entry.type) {
                case 'ships':
                    options.map(opt => {
                        if (undefined != opt.code && '' != opt.code) {
                            opt.code = opt.code
                        } else {
                            let shipName = opt.name.split(' ')[1], // console.log(opt); console.log(opt.name);
                                newOptCode = ''
                            const letters = shipName.split('')
                            if (shipName == 'Fascinosa') {
                                newOptCode += letters[0] + letters[2]
                            } else {
                                newOptCode += letters[0] + letters[1]
                            }
                            opt.code = newOptCode.toUpperCase()
                        }
                    })
                    break;
                case 'durations':
                    const durationLabel = this.searchBarV2Data.attributes.labels.durationLabel
                    console.log(durationLabel);
                    options.map(opt => { // console.log(opt);
                        const { start, end } = opt
                        opt.code = start + '-' + end
                        opt.name = durationLabel.replace(/{{\w+}}/, opt.label + ('*' == end ? '+' : ''))
                    })
                    break;
                case 'flightRequired':
                    // console.log(options); console.log(this.searchBarV2Data.attributes.labels.falseFlightLabel); console.log(this.searchBarV2Data.attributes.labels.trueFlightLabel);
                    options.map(opt => {
                        console.log(opt);
                        if (opt.code == 'true') {
                            opt.name = this.searchBarV2Data.attributes.labels.trueFlightLabel
                        } else {
                            opt.name = this.searchBarV2Data.attributes.labels.falseFlightLabel
                        }
                    })
                    // filterListClass = new flightRequired(entryVars) // opt.code = 'test' // opt.name = 'testName'
                    break;
                case 'offers':
                    // DEALS
                    this.offersVisiblePaxType = this.getVisiblePaxType()/* .map(offers => {}) */ // 
                    console.log(this.offersVisiblePaxType);
                    // DISCOUNT
                    this.offersVisibleDiscountType = this.getVisibleDiscountType(options) // DISCOUNT
                    console.log(this.offersVisibleDiscountType);
                    // this.ribbons = this.joinRibbons() // console.log(this.ribbons);
                    options = this.joinRibbons()
                    console.log(options);
                    break;
                default:
                    break;
            }
            // OPT CODE OF SHIPS DISABLED is an empty string


            if (undefined != filter) {
                const { filterAPIKey, filterTagKey } = filter
                console.log(filter); // console.log(query[filter.filterTagKey]); console.log(options);
                // let entryOptions = []
                switch (filterAPIKey) {
                    case 'offers':
                        let subtypePropsOffers = {}
                        // const thatTaxCurrencyCodes = taxCurrencyCodes
                        let valuesArrayOptions = []
                        // let valuesDiscountType = 
                        options.map(opt => {
                            console.log(opt);
                            if (opt.hasOwnProperty('isCCFareType') && true == opt.isCCFareType) {
                                console.log('It\'s Tariff');

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
                            } else {
                                console.log('It\'s NOT Tariff');
                                // let filterTagFareType = '{!tag=offerTag}campaignId_EUR_PRIVILEG=anonymous' // campaignId_{taxCurrencyCodes}_{offersCode (e.q. FAKECTA5)}={memberLoyaltyLevel}
                                const baseTag = 'campaignId_'
                                let indexTag = baseTag + this.taxCurrencyCodes + '_' // console.log(indexTag); // console.log(variable.indexOf(indexTag));
                                
                                subtypePropsOffers['discount'] = {
                                    filterTagKey: '{!tag=offerTag}' + indexTag + '{cc*filterSearch*cc}', // '{!tag=offerTag}campaignId_EUR_{cc*\w+*cc}=anonymous'
                                    filterTagValue: 'anonymous',
                                    regex: /\{cc\*filterSearch\*cc\}/,// /{\c+\*/, // \w+\c+\*}
                                    indexTag: indexTag,
                                }
                                // {!tag=offerTag}campaignId_EUR_PRIVILEG,ITAFK051=anonymous // let fullStringParam = // let campaignParam = ''
                                Object.keys(query).map(variable => { // console.log(variable);
                                    variable.indexOf(indexTag)
                                    console.log(variable);
                                    console.log(variable.indexOf(indexTag));
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
                                
                                filter.subtypeProps = subtypePropsOffers
                                // Adjust the placeholder in the name
                                opt.name = opt.name.replace(/{\w+}/, this.occupancySaleList[this.memberLoyaltyLevel].occupancySaleValue)
                            }
                            // console.log(valuesArrayOptions);
                            opt.selected = valuesArrayOptions.includes(opt.code)
                        }) // console.log(options);
                        break;
                    default:
                        let valuesArray = undefined != query[filterTagKey] ? query[filterTagKey].split(',') : []
                        options.map(opt => {
                            opt.selected = valuesArray.includes(opt.code)
                        }) // console.log(options);
                        break;
                }

            }
            let entryVars = {
                type: entry.type,
                options: options,
                labels: this.childAttributes.labels,
            }
            switch (entry.type) {
                // case 'durations': //
                //     entryVars.durationLabel = this.searchBarV2Data.attributes.labels.durationLabel
                //     // filterListClass = new Duration(entryVars)
                //     break;
                // case 'flightRequired':
                //     entryVars.falseFlightLabel = this.searchBarV2Data.attributes.labels.falseFlightLabel
                //     entryVars.trueFlightLabel = this.searchBarV2Data.attributes.labels.trueFlightLabel
                //     // filterListClass = new flightRequired(entryVars)
                //     break;
                case 'offers':
                    entryVars.promosDetails = this.promosDetails
                    // filterListClass = new Offers(entryVars)
                    break;
                case 'destinations':
                    let mergedOptions = []
                    const filterDest = this.getFilterBySRPByKey('destinations')
                    entry.attributes.options.map(opt => {
                        const filterSearch = filterDest.list.filter(item => item.code == opt.code)[0] // console.log(filter); // console.log(opt);
                        // console.log(opt, filterSearch);
                        let newOpt = {
                            ...opt,
                            ...filterSearch,
                        } // console.log(newOpt); // console.log(mergedOptions);
                        mergedOptions.push(newOpt)
                    })
                    entryVars.options = mergedOptions
                    // filterListClass = new destinationList(entryVars)
                    break;
                case 'months':
                    let mergedOptionsMonths = []
                    const filterMonths = this.getFilterBySRPByKey('months').list.options // [opt.month]
                    // console.log(filterMonths);
                    entry.attributes.options.map(opt => {
                        const filterSearch = filterMonths[Number(opt.month) - 1][opt.month] // console.log(filterSearch);
                        let newOpt = {
                            ...opt,
                            ...filterSearch,
                        } // console.log(newOpt); // console.log(mergedOptions);
                        mergedOptionsMonths.push(newOpt)
                    }) // console.log(mergedOptionsMonths);
                    entryVars.options = mergedOptionsMonths
                    // filterListClass = new monthsList(entryVars)
                    break;
                case 'occupancy':
                    // occupancy non arriva da occSearch
                    const filterOccupancy = this.getFilterBySRPByKey('occupancy')
                    // console.log(filterOccupancy);
                    // entryVars.guestNumber = searchBarV2Data.attributes.labels.guestNumber
                    // filterListClass = new occupancyList(entryVars)
                    break;
                default:
                    // filterListClass = new filterList(entryVars)
                    break;
            }

            this.entryOccSrcFilterList[entry.type] = entryVars
        })

        // console.log(this.entryOccSrcFilterList);
        return this.entryOccSrcFilterList
    }

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