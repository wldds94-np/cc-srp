import ClassPrototype from "../abstract/ClassPrototype"

class Funnel extends ClassPrototype {
    constructor() {
        super()
        // configs HTML JS VAR  // console.log(configs); // EMPTY -> console.log(configs.srpFilters);
        const { taxCurrencyCodes } = configs
        this.taxCurrencyCodes = taxCurrencyCodes
        // general HTML JS VAR // console.log(general);
        const memberLoyaltyLevel = 'anonymous' // general
        this.memberLoyaltyLevel = memberLoyaltyLevel

        // FILTERS KEY OF SRP - We can use dynamic array by the responses ?? THINK!
        this.filtersKey = ['departures', 'portOfCalls', "ships", "durations", 'flightRequired', 'offers', "destinations", "months", "occupancy",] // ['departures', 'portOfCalls', "destinations", "months", "offers"]
        // this.filtersKey = ["occupancy", 'departures'/*, "months", */] // this.filtersKey = [/* 'departures', 'offers',  */"occupancy",]

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

        // THE PARAMETERS OF CLASSES - minus callbacks
        this.filtersData = {
            search: {
                // months: {
                //     filterClassProps: {},
                //     filterPanelProps: {},
                //     filterPanelOptionsProps: {},
                // }

                // SearchMirror Data
            },
            secondary: {
                // ... equal
            },
            mirror: {
                labels: {}
            }
        }

        // SYNCRONIZATIONS DATA ENTRY
        this.promosDetails = {}
        // OFFERS SECTION VARIABLES
        // DEALS
        this.offerDeals = [] // offerDeals // console.log(this.offerDeals);
        // DISCOUNTS
        this.specialOffers = [] // specialOffers // console.log(this.specialOffers);

        // Catch the request for initialize the occupancy
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
                    filter.filterTagKey = filter.filterTagKey.replace(/\{\{\w+\}\}/, taxCurrencyCodes).replace(/\{\{\w+\}\}/, memberLoyaltyLevel)
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

    syncBestPrice(data, query) {
        // Catch the request ARGS of Best Price for OCCUPANCY & PRIORITY(sorting)
        console.log('Sync BestPrice...'); // console.log(data); // console.log(JSON.parse(data.body))
        // console.log('QUERY:'); console.log(query);

        if (!this.filtersKey.includes('occupancy')) {
            return
        }

        // BASE QUERY EXAMPLE -> &occupancy_EUR_anonymous=AAI&guestAges=30,30,1&guestBirthdates=1992-07-23,1992-07-23,2021-01-12
        // SORT QUERY EXAMPLE group.sort=departDate%20asc
        const promosBestPriceCatched = JSON.parse(data.body)
        // Not use this Period -> use the query of Router for set months (Period) initial value 
        // The value of the request of occupancy (e.q. AA or AAI or AAC ecc)
        const { Occupancy } = promosBestPriceCatched.Cruise // console.log(Occupancy.split(''));
        const { Priority } = promosBestPriceCatched

        this.promosBestPrice = {
            Occupancy,
            Priority,
        } // console.log(promosBestPriceCatched); console.log(this.promosBestPrice); // console.log(this.taxCurrencyCodes); console.log(this.memberLoyaltyLevel);
        // console.log(promosBestPriceCatched); // console.log(this.searchFilters.occupancy);

        // IS RESETTABLE ??  CHECK THE DIFFERENT BY DEFAULT
        let occIsResettable = false
        if (Occupancy != 'AA') {
            occIsResettable = true
        }

        // ADJUST OPTIONS
        const occTypeLabels = {
            A: {
                singular: this.searchFilters.occupancy.labels.adultSingular,
                plural: this.searchFilters.occupancy.labels.adultPlural,
                subtypeOption: {
                    guestAges: 30,
                    guestBirthdates: this.getDateByYear(30),
                },
                range: {
                    min: 18,
                    max: -1,
                }
            },
            C: {
                singular: this.searchFilters.occupancy.labels.childSingular,
                plural: this.searchFilters.occupancy.labels.childPlural,
                subtypeOption: {
                    guestAges: '', // 3,
                    guestBirthdates: '', // this.getDateByYear(3),
                },
                range: {
                    min: 2,
                    max: 17,
                },
            },
            I: {
                singular: this.searchFilters.occupancy.labels.infantSingular,
                plural: this.searchFilters.occupancy.labels.infantPlural,
                subtypeOption: {
                    guestAges: '', // 1,
                    guestBirthdates: '', // this.getDateByYear(1),
                },
                range: {
                    min: 0,
                    max: 1,
                },
            },
        }
        let occupancyOptions = []
        const occupancySplitted = Occupancy.split('')

        // let occPanelSearchFilterValue = [] - NOT USED
        let occupancyObjsSearchFilterValue = [] // Array of object [{occupancy: A, guestAges: ..., guestBirthdates}]
        let occupancyPanelSearchFilterValue = []

        Object.keys(occupancySplitted).map(index => {
            let occSrcObj = {}

            let guestAgesArray = undefined != query['guestAges'] ? query['guestAges'].split(',') : [] // console.log(guestAgesArray[index]);
            let guestBirthdatesArray = undefined != query['guestBirthdates'] ? query['guestBirthdates'].split(',') : []

            occSrcObj.occupancy = occupancySplitted[index]
            occSrcObj.guestAges = null != guestAgesArray[index] ? guestAgesArray[index] : occTypeLabels[occupancySplitted[index]].subtypeOption.guestAges
            occSrcObj.guestBirthdates = null != guestBirthdatesArray[index] ? guestBirthdatesArray[index] : this.getDateByYear(occSrcObj.guestAges)

            occupancyObjsSearchFilterValue.push(occSrcObj)
            // console.log(index);
            // PANEL
            if (!occupancyPanelSearchFilterValue.hasOwnProperty('occupancy')) {
                occupancyPanelSearchFilterValue['occupancy'] = [] // filterSearchValue[type].push(opt.code)
            }
            occupancyPanelSearchFilterValue['occupancy'].push(occupancySplitted[index])
            if (!occupancyPanelSearchFilterValue.hasOwnProperty('guestAges')) {
                occupancyPanelSearchFilterValue['guestAges'] = [] // filterSearchValue[type].push(opt.code)
            }
            occupancyPanelSearchFilterValue['guestAges'].push(occSrcObj.guestAges)
            if (!occupancyPanelSearchFilterValue.hasOwnProperty('guestBirthdates')) {
                occupancyPanelSearchFilterValue['guestBirthdates'] = [] // filterSearchValue[type].push(opt.code)
            }
            occupancyPanelSearchFilterValue['guestBirthdates'].push(occSrcObj.guestBirthdates)
        })
        // console.log(occupancyObjsSearchFilterValue);
        // console.log(occupancyPanelSearchFilterValue);

        let occupancySearchLabel = [] // FOR THE FILTER SEARCH LABEL -> Array of String
        // let countersValues = {} // FOR THE COUNTER INITIAL VALUE
        this.searchFilters.occupancy.attributes.options.map(opt => {
            // console.log(opt);
            let newLabel = opt.label + " " + opt.range.replace(/{{\w+}}/, '0').replace(/\{\{\w+\}\}/, opt.max).replaceAll(' ', '')
            opt.realLabel = opt.label
            opt.name = newLabel
            opt.ID = opt.type
            opt.code = opt.type
            opt.parentType = 'occupancy'
            opt.datePickerType = opt.type == 'A' ? opt.type : 'C'
            // opt.datePickerActive = opt.type == 'A' ? false : true
            opt.enabled = true
            opt.selected = false

            // LABELS SINGULAR / PLURAL
            opt.singular = occTypeLabels[opt.type].singular
            opt.plural = occTypeLabels[opt.type].plural

            // VALUE AND LABEL FILTER
            let occStringLabel = ''
            opt.value = this.countIndexInArray(occupancySplitted, opt.type) //
            if (opt.value > 0) {
                // countersValues[opt.type] = opt.value
                occStringLabel += opt.value + " " + (opt.value > 1 ? occTypeLabels[opt.type].plural : occTypeLabels[opt.type].singular)
                // if (opt.value > 1) { occStringLabel += opt.value + " " + occTypeLabels[opt.type].plural } 
                // else { occStringLabel += opt.value + " " + occTypeLabels[opt.type].singular }
                occupancySearchLabel.push(occStringLabel)
            }

            opt.search = occupancyObjsSearchFilterValue.filter(obj => { return obj.occupancy == opt.type }) // console.log(obj); 
            occupancyOptions.push(opt)
        })

        // Set the OCCUPANCY MIRROR
        if (!this.filtersData.mirror.hasOwnProperty('labels')) {
            this.filtersData.mirror.labels = {}
        }
        const defGuests = this.searchFilters.occupancy.defaultGuests
        const defaultGuestsFilterValue = defGuests + " " + occTypeLabels.A.plural
        this.filtersData.mirror.labels.occupancy = {
            defaultFilterValue: defaultGuestsFilterValue,
            searchLabel: occupancySearchLabel,
        }

        this.filtersData.search.occupancy.options = occupancyOptions

        // ADJUST FILTER
        let filter = {} //
        let searchOccFilter = this.searchFilters.occupancy.filter

        filter = {
            ...searchOccFilter,
            defaultFilterValue: defaultGuestsFilterValue,
            realFilterTagKey: searchOccFilter.filterTagKey,
            filterTagKey: searchOccFilter.filterTagKey.replace(/\{\{\w+\}\}/, this.taxCurrencyCodes).replace(/\{\{\w+\}\}/, this.memberLoyaltyLevel),
        }
        // console.log(filter);
        filter.subType = {
            occupancy: {
                filterTagKey: filter.filterTagKey, // '{!tag=offerTag}fareType={cc*\w+*cc}'
                filterTagValue: '{cc*filterSearch*cc}',
                regex: /\{cc\*filterSearch\*cc\}/,
                indexTag: false,
                valueQuerySeparator: '',
            },
            guestAges: {
                filterTagKey: 'guestAges', // '{!tag=offerTag}fareType={cc*\w+*cc}'
                filterTagValue: '{cc*filterSearch*cc}',
                regex: /\{cc\*filterSearch\*cc\}/,
                indexTag: false,
                valueQuerySeparator: ',',
            },
            guestBirthdates: {
                filterTagKey: 'guestBirthdates', // '{!tag=offerTag}fareType={cc*\w+*cc}'
                filterTagValue: '{cc*filterSearch*cc}',
                regex: /\{cc\*filterSearch\*cc\}/,
                indexTag: false,
                valueQuerySeparator: ',',
            },
        }

        filter.label = occupancySearchLabel
        let searchFilter = []
        occupancyObjsSearchFilterValue.map(src => {
            Object.keys(src).map(subtype => {
                if (!Array.isArray(searchFilter[subtype])) {
                    searchFilter[subtype] = []
                }
                searchFilter[subtype].push(src[subtype]) // console.log(subtype);
            }) // console.log(src);
        })
        filter.search = searchFilter //  occupancyPanelSearchFilterValue //  occupancyObjsSearchFilterValue

        // PREPARE PANEL
        this.filtersData.search.occupancy.panel = {
            filterSearchValue: occupancyObjsSearchFilterValue, // occupancyPanelSearchFilterValue, // filterSearchValue,
            filterSearchLabel: [], // filterSearchLabel,
            labels: this.childAttributes.labels, // GENERIC LABELS FOT TOPHeader ecc
            type: 'occupancy',
            options: occupancyOptions,
            maxOptions: this.searchFilters.occupancy.maxGuests,
            counters: [
                {
                    type: 'A',
                    minValue: 1,
                    maxValue: this.searchFilters.occupancy.maxGuests - occupancySplitted.length,
                    value: Number(this.countIndexInArray(occupancyPanelSearchFilterValue.occupancy, 'A')),
                    labelName: occupancyOptions.filter(opt => opt.type == 'A').reduce((prev, next) => { return prev + next.name }, ''),
                    datePicker: {
                        injectabled: false,
                        labels: occTypeLabels, // ['A'],
                        endModalTitle: this.searchFilters.occupancy.modalAddKid.title,
                        minAge: 18,
                        maxAge: -1,
                        emptyErrorLabel: this.searchFilters.occupancy.labels.emptyErrorLabel, // '',
                        minErrorLabel: this.searchFilters.occupancy.labels.minErrorLabel, // '',
                        maxErrorLabel: this.searchFilters.occupancy.labels.maxErrorLabel, // '',
                    },
                    search: occupancyOptions.find(opt => opt.datePickerType == 'A').search,
                },
                {
                    type: 'C',
                    minValue: 0,
                    maxValue: this.searchFilters.occupancy.maxGuests - occupancySplitted.length,
                    value: Number(this.countIndexInArray(occupancyPanelSearchFilterValue.occupancy, 'C') + this.countIndexInArray(occupancyPanelSearchFilterValue.occupancy, 'I')),
                    labelName: occupancyOptions.filter(opt => opt.type == 'C').reduce((prev, next) => { return prev + next.name }, ''),
                    datePicker: {
                        injectabled: true,
                        labels: occTypeLabels, // {...occTypeLabels['C'], ...occTypeLabels['I']},
                        endModalTitle: this.searchFilters.occupancy.modalAddKid.title,
                        minAge: 0,
                        maxAge: 17,
                        emptyErrorLabel: this.searchFilters.occupancy.labels.emptyErrorLabel, // '',
                        minErrorLabel: this.searchFilters.occupancy.labels.minErrorLabel, // '',
                        maxErrorLabel: this.searchFilters.occupancy.labels.maxErrorLabel, // '',
                    },
                    search: occupancyOptions.filter(opt => opt.datePickerType == 'C').reduce((prev, next) => {
                        return [...prev, ...next.search]
                    }, []),
                }
            ],
            // limits: {}
        }

        this.filtersData.search.occupancy.panel.isResettable = occIsResettable
        // console.log(this.filtersData.search.occupancy); // console.log(this.searchFilters.occupancy);
        this.filtersData.search.occupancy.filter = filter
        // console.log(this.filtersData); 
        this.isInitializedBestPrc = true
    }

    // getSumValue(array, type = []) {
    //     let sum = 0
    //     array.map
    // }

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
        // console.log(this.newSecondaryFilters);
        // Add the occupancy  // this.newSecondaryFilters.push(this.searchFilters.occupancy)

        let isFilterPanelResettable = false
        this.newSecondaryFilters.map(optionsObject => { // console.log(optionsObject);

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
                        opt.ID = opt.code
                        break;
                    case 'durations':
                        const durationLabel = this.searchBarV2Data.attributes.labels.durationLabel
                        const { start, end } = opt
                        opt.code = start + '-' + end
                        opt.name = durationLabel.replace(/{{\w+}}/, opt.label + ('*' == end ? '+' : ''))
                        opt.ID = start + '-' + end
                        break;
                    case 'ships':
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
                        opt.ID = opt.code
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
                        // console.log(opt);
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
                                filterTagValue: this.memberLoyaltyLevel,
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
                    filter.label = filterSearchLabel
                    filter.valorised = filterSearchLabel.length
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
            // console.log(filter); // console.log(type); // console.log(options);

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

        // Mirror Search
        let searchMirrorData = {}

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

                // console.log(this.filtersData.search[type].filter.label);
                if (!searchMirrorData.hasOwnProperty(type)) {
                    searchMirrorData[type] = {}
                }
                searchMirrorData[type].searchLabel = this.filtersData.search[type].filter.label
                searchMirrorData[type].defaultFilterValue = this.filtersData.search[type].filter.defaultFilterValue

            } else {
                filter = this.filtersData.secondary[type].filter
                filterLayoutType += 'secondary'
            }

            this.filtersData[filterLayoutType][type].panel.isResettable = isFilterPanelResettable || this.filtersData.search.occupancy.panel.isResettable // DONT TOUCH // isFilterPanelResettable
        })
        // SYNC WITH OCCUPANCY
        // this.filtersData['search']['occupancy'].panel.isResettable = isFilterPanelResettable

        this.filtersData.mirror.labels = {
            ...this.filtersData.mirror.labels,
            ...searchMirrorData,
        }
        // this.filtersData.mirror.labels = searchMirrorData

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
        // console.log(offersOptions); console.log(this.specialOffers);
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
        // console.log(this.offerDeals);
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