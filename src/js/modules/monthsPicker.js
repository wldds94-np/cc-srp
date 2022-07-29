const monthsPicker = (startDate = false, endDate = false, startClassPattern = 'selected start', endClassPattern = 'selected end') => {
    console.log('Initialize DatePicker');
    const datePickerWrap = $('#cc-months-date-picker')
    // console.log(datePickerWrap);
    const dateSliderContent = datePickerWrap.find('.cc-calendar-body_slider-wrapper')
    const dateSliderHeader = datePickerWrap.find('.cc-calendar-header-bar .year-container')
    const calNav = datePickerWrap.find('.cc-calendar-nav')

    let start = startDate,
        end = endDate

    let maxLeng = $('.cc-calendar-body').length
    let activeYearIndex = $('.cc-calendar-body.active').length ? $('.cc-calendar-body').index($('.cc-calendar-body.active')) : 0
    // console.log(activeYearIndex); console.log(maxLeng);
    $(dateSliderHeader[activeYearIndex]).addClass('active')
    moveSlider()

    /** EVENT HANDLERS */
    calNav.on('click', handleNavigation)

    function handleNavigation(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        // console.log(maxLeng, activeYearIndex);
        if ($(e.target).hasClass('next') && maxLeng - 1 < activeYearIndex + 1) { // console.log('Next');
            return
        }

        if ($(e.target).hasClass('prev') && activeYearIndex - 1 < 0) { // console.log('Prev');
            return
        }
        stepNav(e)
        moveSlider()
    }

    function moveSlider() {
        stepYear()
        dateSliderContent.css('left', activeYearIndex > 0 ? String(activeYearIndex * -100) + '%' : 0)
    }

    function stepYear() {
        dateSliderHeader.removeClass('active') // console.log(dateSliderHeader);
        $(dateSliderHeader[activeYearIndex]).addClass('active')
    }

    function stepNav(e) {

        $(e.target).hasClass('next') ? activeYearIndex++ : activeYearIndex--
    }

    // INITIALIZATIONS
    let searchFilterCalendar = $(`.search-filter-calendar`)
    const newStartIndex = searchFilterCalendar.index($('.start')) // .index('.search-filter-calendar.selected.start') // .index(`.start`)
    const newEndIndex = searchFilterCalendar.index($('.end')) // .index(`.search-filter-calendar.end`)
    // console.log(newStartIndex, newEndIndex);
    searchFilterCalendar.removeClass('between')
    if (newEndIndex > 0) {
        for (let i = 0; i < searchFilterCalendar.length; i++) {
            if (i > newStartIndex && i < newEndIndex) {
                $(searchFilterCalendar[i]).addClass('between')
            } else {
                $(searchFilterCalendar[i]).removeClass('between')
            }
        }
    }

}

export default monthsPicker