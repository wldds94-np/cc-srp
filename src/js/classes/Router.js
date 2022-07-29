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
            params: this.getParamsByHash(location.hash),
            // search: []
        } // console.log(this.state.params);

        this.history = [] // Array of this.query
        this.query = this.getMapQuery(this.state.params)
        // this.query = this.getMapQuery(this.state.params)
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
        console.log('I\'m pinging the request'); // console.log(newQueryValues);
        let { query } = this 
        
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

        let newHash = hash ? hash : Object.keys(this.query).reduce((prev, next) => {
            // console.log(prev, next); // console.log(this.query[prev]);
            return prev += next + '=' + this.query[next] + '&'
        }, '').slice(0, -1)

        // CHECK IF HASH IS '' and TRIM the urlPage (remove # by URL) --- TO DO
        window.location.hash = newHash
    }

    resetQuery() {
        this.query = []
        this.syncUrl()
    }

    /** EVENTS HANDLER **/
    checkUrl(e) {
        // console.log('The hash has changed!') console.log(e); console.log(e.newURL); // console.log(location.hash);
        this.state.params = this.getParamsByHash(location.hash)
        let newQuery = this.getMapQuery(this.state.params) 

        this.query = newQuery

        // console.log('CHECKING EQUALS'); // console.log(this.arraysMatch(newQuery, this.query));
        // if (this.arraysMatch(newQuery, this.query)) {
        //     console.log('ITS EQUALS QUERY'); // Nothing else
        // } else {
        //     // Ricreate my query
        //     this.query = newQuery // this.getMapQuery(newParams)
        // }
    }
}

export default Router