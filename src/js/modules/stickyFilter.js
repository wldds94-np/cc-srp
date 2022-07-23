const stickyFilter = () => {
    console.log('Init Sticky FIlter');

    updateSticky()
    const breakpoint = 240 // seems good
    /* ========================================== 
     * scrollTop() >= breakpoint
     * Should be equal the the height of the header
     * ========================================== */

    $(window).scroll(function () {
        updateSticky()
    });

    function updateSticky() {
        // console.log($(window).scrollTop());
        if ($(window).scrollTop() >= breakpoint) {
            $('.cc-fe_srp.cc-fe_srp-container').addClass('sticky-filter'); // $('nav div').addClass('visible-title');
        }
        else {
            $('.cc-fe_srp.cc-fe_srp-container').removeClass('sticky-filter'); // $('nav div').removeClass('visible-title');
        }
    }
}

export default stickyFilter