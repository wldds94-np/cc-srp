import filterList from "../../classes/filterList"

class monthsList extends filterList {
    constructor(props) {
        super(props)

        console.log(props);
        this.datePickerData = this.prepareDatePickerData(props.options)

        this.parentElementToStyle = '.search-filter-calendar'

        this.contentTransformValueCallback = this.transformContentValue.bind(this)
        // this.valueTransformCallback = this.transformValueSrc.bind(this)
        this.transformFilterSearchValue = this.transformFilterSearchValue.bind(this)

        this.limits = {
            start: false,
            end: false,
        }
        // this.start = false
        // this.end = false

        this.abortToStyleElement = true
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

    transformFilterSearchValue(value, newCopy, prevCopy) {
        // console.log(value, newCopy, prevCopy);
        let newFilterSearch = []
        if (!newCopy.length) {
            newFilterSearch = newCopy
            this.limits = {
                start: false,
                end: false,
            }
            // return
        } else {
            const month = this.getMonthYearObj(value) // 
            // console.log(month); // console.log(value);

            let newStartLimit = ''
            let newEndLimit = ''

            const { start, end } = this.limits // console.log(start);

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
                    // else  if (newTime == endTime) {
                    //     newEndLimit = false // this.limits.start = false // this.limits.end = aux
                    // } 

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
                        newStartLimit = this.limits.end
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

            // console.log(newStartLimit, newEndLimit);
            this.limits = {
                start: newStartLimit,
                end: newEndLimit,
            }
        }

        // this.filterSearchValue = []
        Object.keys(this.limits).map(limit => {
            if (false != this.limits[limit]) {
                newFilterSearch.push(this.limits[limit] ? this.limits[limit] : '')
            }
        }) // console.log(this.filterSearchValue, this.limits);

        this.updateLimits(this.limits.start, this.limits.end)
        // console.log(this.filterSearchValue); console.log(this.limits);

        this.filterSearchValue = newFilterSearch
        // console.log(newFilterSearch);
        return newFilterSearch
    }

    // transformValueSrc(value) {
    //     // const month = this.getMonthYearObj(value) // 
    //     // console.log(month);
    //     // console.log(value);

    //     // const { start, end } = this.limits
    //     // if (false == start) {
    //     //     this.limits.start = month.code
    //     // } else {
    //     //     if (false == end) {
    //     //         console.log('In END');
    //     //         this.limits.end = month.code
    //     //     } else {

    //     //     } 
    //     // }

    //     // console.log(this.limits);
    //     // if (!end) {
    //     //     this.limits.end = month.code
    //     // } else {
    //     const startDate = new Date(start), startTime = startDate.getTime(),
    //         endTime = new Date(end).getTime(),
    //         newTime = new Date(month.code).getTime()
    //     if (newTime > startTime && newTime < endTime) {
    //         this.limits.end = month.code
    //     }
    //     if (newTime == startTime) {
    //         this.limits = {
    //             start: this.limits.end,
    //             end: false
    //         }
    //     }
    //     if (newTime == endTime) {
    //         this.limits.end = false
    //     }
    //     // }
    //     console.log(this.limits.start, this.limits.end);
    //     this.updateLimits(this.limits.start, this.limits.end)
    //     const srcValue = this.limits.start ? this.limits.start + (/* false !=  */this.limits.end ? (',' + this.limits.end) : '') : ''
    //     // return month.hasOwnProperty('code') ? month.code : '' 
    //     return srcValue
    // }

    transformContentValue(value) {
        // console.log(value);
        const month = this.getMonthYearObj(value)
        // console.log(month);
        return month.label + ' ' + month.year
    }

    getMonthYearObj(string) {
        const dateArray = String(string).split('-')
        const searchArray = dateArray.length > 1 ? dateArray : [
            new Date().getFullYear(),
            new Date().getMonth()
        ]
        const monthArr = this.datePickerData[searchArray[0]].filter(item => (Number(item.month) == searchArray[1]))
        return monthArr.length ? monthArr[0] : {} /*  && {} */
    }

    updateLimits(start, end) {
        console.log('Updating Limits...'); console.log(start + ',' + end);
        const startClassPattern = 'start',
            endClassPattern = 'end',
            selectedClass = 'selected'
        let searchFilterCalendar = $(`.search-filter-calendar`)

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
        console.log(newStartIndex, newEndIndex);
        searchFilterCalendar.removeClass('between')
        if (newEndIndex > 0) {
            for (let i = 1 + newStartIndex; i < newEndIndex; i++) {
                $(searchFilterCalendar[i]).addClass('between')
            }
        }
    }

    addZeroPad(number, width = 2) {
        let str = String(number)
        while (str.length < width) {
            str = '0' + str
        }
        return str
    }

    getButtonsHtmlJson(options) {
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
                                    return {
                                        attrs: {
                                            class: "cc-calendar-body",
                                        },
                                        children: this.datePickerData[el].map(opt => {
                                            // console.log(opt)
                                            return {
                                                attrs: {
                                                    class: "search-filter-calendar " + (opt.enabled ? '' : this.disabledClassStyle),
                                                },
                                                children: [
                                                    {
                                                        tagName: "button",
                                                        attrs: {
                                                            class: "cc-fe_srp cc-fe_srp-filters__action-value", //  " + (opt.enabled ? '' : this.disabledClassStyle)
                                                            value: opt.year + '-' + opt.month
                                                        },
                                                        // props: {
                                                        //     onclick: this.updateLimits.bind(this)
                                                        // },
                                                        children: [
                                                            {
                                                                tagName: 'span',
                                                                content: opt.value
                                                            }
                                                        ]
                                                    }
                                                ]
                                            };
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

export default monthsList