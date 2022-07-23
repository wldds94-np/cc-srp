import ClassPrototype from "../abstract/ClassPrototype";

class Router extends ClassPrototype {
    constructor() {
        super() 

        console.log('Initialized Router');

        this.config = {
            equalChar: '='
        }

        this.state = {
            hash: location.hash,
            params: this.getParamsByHash(),
            // search: []
        } // console.log(this.state.params);

        this.history = [] // Array of this.query
        this.query = this.getMapQuery(this.state.params)
        // console.log(this);

        // // HASHCHANGE 
        window.addEventListener('hashchange', this.checkUrl.bind(this))
    }

    /** SET / GET QUERY */
    setQuery(query) {
        this.query = query
    }
    getQuery(index = -1) {
        return index == -1 ? this.query : (this.query.hasOwnProperty(index) ? this.query[index] : [])
    }

    getParamsByHash(hash = location.hash) {
        // console.log(hash);
        return hash.length ? hash.split("#")[1].split("&").map(item => {
            return decodeURI( item )
        }) : []
    }

    getMapQuery(params) {
        let query = []
        params.map(el => {
            let locs = this.locations(this.config.equalChar, el)
            // Take the last
            let lastIndex = locs.length ? locs.pop() : 0

            let [filterTagKey, filterSearchValues] = this.splitInArray(el, lastIndex) // console.log(newElArray); // this.initialQuery[filterTagKey] = filterSearchValues // this.query.push({ filterTagKey: filterSearchValues })
            query[filterTagKey] = filterSearchValues
        })

        return query
    }

    splitInArray(str, index) {
        const result = [str.slice(0, index), str.slice(index + 1)];

        return result;
    }

    /**
     * 
     * @param {string} substring 
     * @param {string} string 
     * @returns {Array}
     */
    locations(substring, string) {
        let a = [], i = -1;
        while ((i = string.indexOf(substring, i + 1)) >= 0) a.push(i);
        return a;
    }

    // pingRequestToHash(queryTag, queryValue) {
    pingRequestToHash(newQueryValues) {
        console.log('I\'m pinging the request');
        let { query } = this // console.log(query); // console.log(queryTag); // console.log(queryValue);
        // console.log(newQueryValues);
        newQueryValues.map(newParam => {
            // console.log(newParam);
            const { queryTag, queryValue, indexTag } = newParam // console.log(query[queryTag], queryTag, queryValue, indexTag);

            if (false != indexTag) {
                // console.log('indexTag its valorized...'); console.log(this.query);
                let queryKeysArray = Object.keys(query) // console.log(queryKeysArray);
                if (queryKeysArray.length) {
                    let searchIndexParam = Object.keys(queryKeysArray).filter(queryTagIndex => queryKeysArray[queryTagIndex].indexOf(indexTag) > -1)// .map(queryTagIndex => { console.log(queryTagIndex); console.log(queryKeysArray[queryTagIndex].indexOf(indexTag)); })
                    // console.log(searchIndexParam);
                    if (searchIndexParam.length) {
                        delete this.query[queryKeysArray[searchIndexParam]]
                    } // console.log(queryKeysArray[searchIndexParam]); // console.log(queryIndex);
                }
                /* IMPORTANT (N.B. !!!)
                 * Check if the second part is '' splitting the queryTag
                 * {!tag=offerTag}' + indexTag + '{cc*filterSearch*cc} -> [0] => {!tag=offerTag}, [1] => {cc*filterSearch*cc} || ''  
                 * */
                let newValueToUpdate = queryTag.split(indexTag).length > 1 ? queryTag.split(indexTag)[1] : ''          
                if ('' != newValueToUpdate) {
                    this.query[queryTag] = queryValue
                }
            } else {
                if (undefined != query[queryTag] && query[queryTag] == queryValue) {
                    return
                }

                if ('' == queryValue) {
                    delete this.query[queryTag]
                } else {
                    this.query[queryTag] = queryValue
                }
            }

        })

        this.syncUrl()
    }

    syncUrl(hash = false) {
        // console.log('BUILDING NEW URL PARAMS');

        // let newHash = ''
        let newHash = hash ? hash : Object.keys(this.query).reduce((prev, next) => {
            // console.log(prev, next); // console.log(this.query[prev]);
            return prev += next + '=' + this.query[next] + '&'
        }, '').slice(0, -1)

        // console.log(window.location); console.log(newHash);
        // CHECK IF HASH IS '' and TRIM the urlPage (remove # by URL) --- TO DO
        window.location.hash = newHash
    }

    resetQuery() {
        this.query = []
        this.syncUrl()
    }

    // syncQueryParams(listsClasses) {
    //     console.log('Sync Params');
    //     console.log(listsClasses);
    //     console.log(listsClasses);
    //     Object.keys(listsClasses).map(classIndex => {
    //         console.log(classIndex); console.log(listsClasses); console.log(listsClasses[classIndex]); // console.log(listsClasses.classIndex); - NOT WORK
    //         let FilterPanelClass = listsClasses[classIndex] // console.log(FilterPanelClass);
    //         // const index = this.query.indexOf(FilterPanelClass.state.filterLabel.props.filterTagKey) // console.log(index);
    //         let OptionClasses = FilterPanelClass.optionsInstances
    //         console.log(OptionClasses);
    //         const index = FilterPanelClass.state.filterLabel.props.filterTagKey // console.log(FilterPanelClass.state.filterLabel.props.filterTagKey); // console.log(this.query[filterPanel.state.filterLabel.props.filterTagKey]);

    //         let values = 'string' == typeof this.query[index] ? this.query[index].split(",") : []
    //         console.log(values);

    //         Object.keys(OptionClasses).map(optionCode => {
    //             console.log(values.length ? values.includes(optionCode) : 'Not Included');
    //             OptionClasses[optionCode].setSelectedState.apply(OptionClasses[optionCode], [values.length ? values.includes(optionCode) : false]) // (values.length ? values.includes(optionCode) : false)
    //         })
    //     })

    //     console.log(this);
    // }

    // pingRequest(FilterClass) {
    //     console.log('I\'m pinging the request');
    //     console.log(FilterClass);
    //     console.log(this);
    //     const filterTagKey = FilterClass.props.filterTagKey
    //     const thisQuery = this.getQuery(filterTagKey)
    //     const newSearch = FilterClass.state.search
    //     console.log(thisQuery);
    //     if (thisQuery == newSearch) {
    //         console.log('Equal');
    //     } else {
    //         console.log('Not Equal');
    //         // Update this query and push in history the last
    //         this.history.push(this.query)
    //         let newQuery = null
    //         if (newSearch == '') {
    //             delete this.query[filterTagKey] // this.query = Object.keys(this.query).filter(paramTag => paramTag != filterTagKey)
    //         } else {
    //             this.query[filterTagKey] = newSearch
    //         }

    //         this.updateUrl()
    //     }
    // }

    // updateUrl(hash = false) {
    // // let newHash = ''
    // let newHash = hash ? hash : Object.keys(this.query).reduce((prev, next) => {
    //     console.log(prev, next); // console.log(this.query[prev]);
    //     return prev += next + '=' + this.query[next] + '&'
    // }, '').slice(0, -1)

    // console.log('NEW URL PARAMS');
    // console.log(window.location); console.log(newHash);

    // window.location.hash = newHash
    // }

    checkUrl(e) {
        // console.log('The hash has changed!') console.log(e); console.log(e.newURL); // const newURL = e.newURL
        this.state.params = this.getParamsByHash()
        const newQuery = this.getMapQuery(this.state.params) // [...this.getMapQuery(newParams)]

        if (this.arrayEquals(newQuery, this.query)) {
            console.log('ITS EQUALS QUERY');
            // Nothing else
        } else {
            // Ricreate my query
            this.query = this.getMapQuery(newParams)
        }
    }

    arrayEquals = function (a, b) {
        return Array.isArray(a) &&
            Array.isArray(b) &&
            a.length === b.length &&
            a.every((val, index) => val === b[index]);
    }
}

export default Router