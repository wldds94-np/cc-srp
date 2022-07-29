import FilterPanel from "../FilterPanel";

import Counter from "../inc/Counter";
// import DatePicker from "../inc/DatePicker";

class FilterPanelOccupancy extends FilterPanel {
    constructor(props) {
        super(props)

        this.config = {
            ...this.config,
            counters: this.saveSafePropertyProps(props, 'counters', []),
            maxOptions: Number(this.saveSafePropertyProps(props, 'maxOptions', 4))
        }

        this.state = {
            ...this.state,
            initMax: 0,
        }

        this.CounterInstances = []
        this.config.counters.map(counter => {
            const counterObj = {
                ...counter,
                onBeforeAlterCounter: this.onBeforeAlterCounterCallback.bind(this),
                onUpdateValidation: this.updateValidation.bind(this)
            }
            this.CounterInstances[counter.type] = new Counter(counterObj)
        })

        // Add the callback for updating
        this.update = {
            callbacks: {
                ...this.update.callbacks,
                FilterPanelOccupancyUpdate: this.updatePanelOccState.bind(this)
            }
        }

        this.close = {
            callbacks: {
                ...this.close.callbacks,
                FilterPanelOccupancyClose: this.closePanelOccState.bind(this)
            },
        }

        // console.log('FILTER PANEL OCCUPANCY');
        // console.log(this);
    }

    onBeforeAlterCounterCallback(nextCounterValue, counterType) {
        // console.log('You want alter COUNTER value');

        const { maxOptions } = this.config

        if (maxOptions > -1) {
            let counter = nextCounterValue >= 0 ? nextCounterValue : 0 // typeValue // typeValue
            // console.log(counter);

            Object.keys(this.CounterInstances)
                .filter(filter => this.CounterInstances[filter].props.type != counterType)
                .map(counterKey => {
                    counter += this.CounterInstances[counterKey].DatePickersInstances.length // .state.value
                })

            // I HAVE TO UPDATE THE OTHERS COUNTERS
            Object.keys(this.CounterInstances)
                .filter(index => this.CounterInstances[index].props.type != counterType) // I dont want update the option that has send request to update
                .map(key => {
                    this.CounterInstances[key].state.maxValue = maxOptions - counter
                    this.CounterInstances[key].restyleOption()
                })
            // console.log(counter);
            return { updatebled: maxOptions >= counter, maxValue: maxOptions - counter }
        } else {
            return { updatebled: true, maxValue: -1 }
        }
    }

    closePanelOccState() {
        console.log('Called by FilterPanel Close Stack');
        console.log('FILTER PANEL OCCUPANCY');
        console.log(this); //  console.log(this.CounterInstances);

        Object.keys(this.CounterInstances).map(index => {
            this.CounterInstances[index].returnToInitialState(this.getMaxOptions())
        })
    }

    getMaxOptions() {
        let counter = 0

        Object.keys(this.CounterInstances)
            .map(counterKey => {
                counter += this.CounterInstances[counterKey].state.search.length // .state.value
            })      
        
        return counter
    }

    savePanel() {
        this.updateValidation()
        if (this.state.isValid) {
            console.log('Save Panel By Occupancy Prototype'); // 
            console.log(this);
    
            // UPDATE THIS FILTER SEARCH VALUE
            this.state.filterSearchValue = this.getSearchPanel() // search
            
            // CREATE THE ARRAYS FOR SEARCH FILTER
            let searchFilter = this.getSearchFilter(this.state.filterSearchValue)
            
            // GENERATE THE LABELS ARRAY FOR FILTER
            let labels = this.getLabelsFilterByOccupancy(searchFilter.occupancy)
    
            this.Filter.registerChoice(
                labels,
                searchFilter, // this.valueTransformCallback(updatedFilterValue),
            ) 
        } else {

        }

    }

    updatePanelOccState(props) {
        console.log('FILTER PANEL OCCUPANCY UPDATING - FilterPanel Update Stack');
        // console.log(props);

        // I HAVE TO SYNC THE DATEPICKERS AND COUNTERS
        props.counters.map(counter => {
            this.CounterInstances[counter.type].updateCounter(counter)
        })
    }

    getSearchPanel() {
        let search = []

        Object.keys(this.CounterInstances).map(index => {
            let newSearchType = this.CounterInstances[index].getSearch()
            this.CounterInstances[index].state.search = newSearchType
            // this.CounterInstances[index].
            search = [...search, ...newSearchType]
        })
        console.log(search);
        return search
    }

    getSearchFilter(search = this.state.filterSearchValue) {
        let searchFilter = []

        // CREATE THE ARRAYS FOR SEARCH FILTER
        search.map(src => {
            Object.keys(src).map(subtype => {
                if (!Array.isArray(searchFilter[subtype])) {
                    searchFilter[subtype] = []
                }
                searchFilter[subtype].push(src[subtype]) // console.log(subtype);
            }) // console.log(src);
        })
        // console.log(searchFilter);
        return searchFilter
    }

    getLabelsFilterByOccupancy(occupancies) {
        let labels = []
        Object.keys(this.OptionsInstances).map(type => {
            const value = this.countIndexInArray(occupancies, type)
            if (value > 0) {
                labels.push(value + ' ' + (value > 1 ? this.OptionsInstances[type].props.plural : this.OptionsInstances[type].props.singular))
            }
        })
        return labels
    }

    transformFilterSearchValue(el, newEl = '', prevCopy = []) {
        return el
    }

    // OVERRIDE
    getLabelValueBySearch(updatedFilterValue, callback = this.transformFilterLabelValue) {
        // console.log(updatedFilterValue);
        let occupancies = Object.keys(updatedFilterValue).map(index => {
            return updatedFilterValue[index].occupancy
        })

        let labels = this.getLabelsFilterByOccupancy(occupancies)

        return labels
    }
    // OVERRIDE
    getFilterValueBySearch(updatedFilterValue) {
        return this.getSearchFilter(updatedFilterValue)
    }

    getButtonsHtmlJson(options = this.props.options) {

        return [
            {
                attrs: {
                    id: "cc-occupancy-age-picker",
                    class: "cc-srp-fe cc-age-picker-container",
                },
                children: [
                    {
                        attrs: {
                            class: "cc-age-buttons-container",
                        },
                        children: Object.keys(this.CounterInstances).map(types => {
                            return this.CounterInstances[types].getHtmlJson()
                        }) // options.filter(filter => filter.injectabled).map(opt => { return this.OptionsInstances[opt.code].getHtmlJson() }),
                    },
                ]
            }
        ]
    }
    
    // OVERRIDE
    getObjsValidation() {
        let datePickers = []
        let counter = 0
        // console.log(this.CounterInstances);//
        Object.keys(this.CounterInstances).map(type => {
            // console.log(this.CounterInstances[type]); console.log(this.CounterInstances[type].DatePickersInstances); console.log(this.CounterInstances[type].DatePickersInstances.length);
            for (let i = 0; i < this.CounterInstances[type].DatePickersInstances.length; i++) {
                // console.log(this.CounterInstances[type].DatePickersInstances[i]);
                datePickers[counter] = this.CounterInstances[type].DatePickersInstances[i]
                counter++            
            }            
        })
        return datePickers
    }
}

export default FilterPanelOccupancy