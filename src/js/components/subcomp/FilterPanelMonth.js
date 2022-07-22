import FilterPanel from "../FilterPanel";

class FilterPanelMonth extends FilterPanel {
    constructor(props) {
        super(props)

        this.datePickerData = this.prepareDatePickerData(props.options)

        this.state = {
            ...this.state,
            limits: {
                start: this.saveSafePropertyProps(this.props.limits, 'start', false),
                end: this.saveSafePropertyProps(this.props.limits, 'end', false),
            }
        }

        // console.log('FilterPanelMonth');
        // console.log(this);
    }

    transformFilterLabelValue(optionInstance) {
        console.log('TRANSFORM BY FILTER PANEL MONTH'); // console.log(optionInstance);
        return optionInstance.props.name + " " + optionInstance.props.year
    }

    transformFilterSearchValue(el, newEl = '') {
        console.log('I CHOICE THE LIMITS');
        // console.log(el); console.log(this.state);

        let newFilterSearch = []
        newFilterSearch[this.type] = []
        let realNewCopy = el[this.type]

        if (newEl != '') {
            if (!realNewCopy.length) {
                // newFilterSearch = realNewCopy
                this.state.limits = {
                    start: false,
                    end: false,
                }
                // return
            } else {
                const month = this.getMonthYearObj(newEl) // 
                // console.log(month); // console.log(value);
    
                let newStartLimit = ''
                let newEndLimit = ''
    
                const { start, end } = this.state.hasOwnProperty('limits') ? this.state.limits : false // const { end } = this.state.hasOwnProperty('limits') ? this.state.limits : false // const { start, end } = this.state.limits // console.log(start);
    
                if (false == start/*  && false == end */) {
                    // console.log('Start False');
                    newStartLimit = month.code // this.limits.start = month.code
                } else {
                    const startDate = new Date(start), startTime = startDate.getTime(),
                        newTime = new Date(month.code).getTime()
    
                    if (false == end) {
                        // console.log('End False');
                        if (newTime < startTime) {
                            //console.log('New Time Minus');
                            newStartLimit = month.code
                            newEndLimit = start // console.log(start); 
                        } else if (newTime == startTime) {
                            //console.log('New Time Equal Start');
                            newStartLimit = false // this.limits.start = false // this.limits.end = aux
                        } else {
                            //console.log('New Time Major Start');
                            newStartLimit = start
                            newEndLimit = month.code
                        }
    
                    } else {
                        const endTime = new Date(end).getTime()
                        //console.log('Both Initialized');
                        if (newTime > startTime && newTime < endTime) {
                            newStartLimit = start
                            newEndLimit = month.code
                        }
    
                        if (newTime < startTime) {
                            newStartLimit = month.code
                            newEndLimit = end
                        }
    
                        if (newTime == startTime) {
                            newStartLimit = this.state.limits.end
                            newEndLimit = false
                        }
    
                        if (newTime > endTime) {
                            newStartLimit = start
                            newEndLimit = month.code
                        }
    
                        if (newTime == endTime) {
                            newStartLimit = start
                            newEndLimit = false
                        }
                    }
                }
    
                this.state.limits = { // console.log(newStartLimit, newEndLimit);
                    start: newStartLimit,
                    end: newEndLimit,
                }
            }
        } else {
            let first = realNewCopy.shift(),
                last = realNewCopy.pop()
            this.state.limits = {
                start: undefined != first ? first : false,
                end:  undefined != last ? last : false,
            }
        }

        
        console.log(this.state.limits);
        Object.keys(this.state.limits).map(limit => {
            if (false != this.state.limits[limit]) {
                newFilterSearch[this.type].push(this.state.limits[limit])
            }
        })
        // console.log(newFilterSearch);
        this.updateLimits(this.state.limits.start, this.state.limits.end)

        return newFilterSearch // [this.type] // this.state.filterSearchValue[this.type] = Object.keys(newFilterSearch).map(newValue => newFilterSearch[newValue]/*  += '-01T00:00:00Z' */) // newFilterSearch
    }


    getMonthYearObj(string) {
        const dateArray = String(string).split('-')
        const searchArray = dateArray.length > 1 ? dateArray : [
            new Date().getFullYear(),
            new Date().getMonth()
        ]
        if (undefined == this.datePickerData) {
            this.datePickerData = this.prepareDatePickerData(this.props.options)
        }
        const monthArr = this.datePickerData[searchArray[0]].filter(item => (Number(item.month) == searchArray[1]))
        return monthArr.length ? monthArr[0] : {} /*  && {} */
    }

    updateLimits(start, end) {
        // console.log('Updating Limits...'); console.log(start + ',' + end);
        const startClassPattern = 'start',
            endClassPattern = 'end',
            selectedClass = 'selected'
        let searchFilterCalendar = $(`.search-filter-calendar`)

        // console.log(this.OptionsInstances);
        Object.keys(this.OptionsInstances).map(optionInstance => {
            this.OptionsInstances[optionInstance].state.end = false
            this.OptionsInstances[optionInstance].state.end = false
            // console.log(optionInstance);
        })
        if (start) {
            this.OptionsInstances[start].state.start = true
        }
        if (end) {
            this.OptionsInstances[end].state.end = true
        }

        const startBtn = $(`.search-filter-calendar.start`).length ? $('.search-filter-calendar.start') : undefined,  //monthsBtnsStyle = $('.search-filter-calendar'), // .removeClass('selected'),
            endBtn = $(`.search-filter-calendar.end`).length ? $('.search-filter-calendar.end') : undefined

        if (undefined != startBtn) { // console.log($(`.search-filter-calendar button[value=${startValue}]`));
            startBtn.removeClass(startClassPattern)
        }
        if (undefined != endBtn) { // console.log($(`.search-filter-calendar button[value=${endValue}]`));
            endBtn.removeClass(endClassPattern)
        }
        searchFilterCalendar.removeClass(selectedClass)

        let startValue = start ? start.substr(0, 7) : ''
        let endValue = end ? end.substr(0, 7) : ''

        if (start) {
            const startClosestBtn = $(`.search-filter-calendar button[value=${startValue}]`).closest('div')
            startClosestBtn.addClass(startClassPattern + ' ' + selectedClass)
            // startClosestBtn.index() // let listSearch = $(`.search-filter-calendar`) //console.log(listSearch); //console.log(listSearch.index($('.selected.start')))
        }

        if (end) {
            const endClosestBtn = $(`.search-filter-calendar button[value=${endValue}]`).closest('div')
            endClosestBtn.addClass(endClassPattern + ' ' + selectedClass) // newStartIndex = endClosestBtn.addClass(endClassPattern)
        }

        /** BewtweenWalker */ // console.log($(`.search-filter-calendar.start`), $(`.search-filter-calendar.end`));
        const newStartIndex = searchFilterCalendar.index($('.start')) // .index('.search-filter-calendar.selected.start') // .index(`.start`)
        const newEndIndex = searchFilterCalendar.index($('.end')) // .index(`.search-filter-calendar.end`)
        // console.log(newStartIndex, newEndIndex);
        searchFilterCalendar.removeClass('between')
        if (newEndIndex > 0) {
            for (let i = 1 + newStartIndex; i < newEndIndex; i++) {
                $(searchFilterCalendar[i]).addClass('between')
            }
        }
    }

    prepareDatePickerData(listData) {
        let datePickerData = {}
        // return 
        listData.map(month => {
            // console.log(month);
            if (Array.isArray(datePickerData[month.year])) {
                datePickerData[month.year].push(month)
            } else {
                datePickerData[month.year] = []
                datePickerData[month.year].push(month)
            }
        }) // 

        // console.log(datePickerData);
        return datePickerData
    }

    getButtonsHtmlJson() {
        return [
            {
                attrs: {
                    class: "cc-srp-fe cc-date-picker-container",
                    id: "cc-months-date-picker",
                },
                children: [
                    {
                        attrs: {
                            class: "cc-calendar-header-bar",
                        },
                        children: [
                            {
                                attrs: {
                                    class: "cc-calendar-nav prev",
                                },
                            },
                            ...Object.keys(this.datePickerData).map(el => (
                                {
                                    attrs: {
                                        class: "year-container",
                                    },
                                    content: el
                                }
                            )),
                            {
                                attrs: {
                                    class: "cc-calendar-nav next",
                                },
                            }
                        ]
                    },
                    {
                        attrs: {
                            class: "cc-calendar-body-container",
                        },
                        children: [
                            {
                                attrs: {
                                    class: "cc-calendar-body_slider-wrapper",
                                },
                                children: Object.keys(this.datePickerData).map(el => {
                                    // console.log(el);
                                    // return this.OptionsInstances[el][].getHtmlJson()
                                    return {
                                        attrs: {
                                            class: "cc-calendar-body",
                                        },
                                        children: this.datePickerData[el].map(opt => {
                                            // console.log(opt)
                                            return this.OptionsInstances[opt.code].getHtmlJson()
                                        })
                                    }
                                })
                            }
                        ]
                    }
                ],
            }
        ]
    }
}

export default FilterPanelMonth