const datePicker = (startDate = false, endDate = false, startClassPattern = 'selected start', endClassPattern = 'selected end') => {
    console.log('Initialize DatePicker');
    const datePickerWrap = $('#cc-months-date-picker')
    // console.log(datePickerWrap);
    const dateSliderContent = datePickerWrap.find('.cc-calendar-body_slider-wrapper')
    const dateSliderHeader =  datePickerWrap.find('.cc-calendar-header-bar .year-container')
    const calNav = datePickerWrap.find('.cc-calendar-nav')

    let start = startDate,
        end = endDate
    
    let maxLeng = $('.cc-calendar-body').length
    let activeIndex = $('.cc-calendar-body.active').length ? $('.cc-calendar-body').index($('.cc-calendar-body.active')) : 0
    // console.log(activeIndex); console.log(maxLeng);
    $(dateSliderHeader[activeIndex]).addClass('active')
    moveSlider()

    /** EVENT HANDLERS */
    calNav.on('click', handleNavigation)

    function handleNavigation(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        console.log(maxLeng, activeIndex);
        if ($(e.target).hasClass('next') && maxLeng-1 < activeIndex+1) { // console.log('Next');
            return
        } 
        
        if($(e.target).hasClass('prev') && activeIndex-1 < 0) { // console.log('Prev');
            return
        }
        stepNav(e)
        moveSlider()
    }
    
    function moveSlider() {
        stepYear()
        dateSliderContent.css('left', activeIndex > 0 ? String( activeIndex * -100) + '%' : 0 )
    }

    function stepYear() {
        dateSliderHeader.removeClass('active') // console.log(dateSliderHeader);
        $(dateSliderHeader[activeIndex]).addClass('active')
    }

    function stepNav(e) {
        
        $(e.target).hasClass('next') ? activeIndex++ : activeIndex--
    }
}

export default datePicker