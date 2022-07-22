const stickyFilter = () => {
    console.log('Init Sticky FIlter');

    updateSticky()
    /* ========================================== 
     * scrollTop() >= 180
     * Should be equal the the height of the header
     * ========================================== */

    $(window).scroll(function () {
        updateSticky()
    });

    function updateSticky() {
        console.log($(window).scrollTop());
        if ($(window).scrollTop() >= 180) {
            $('.cc-fe_srp.cc-fe_srp-container').addClass('sticky-filter'); // $('nav div').addClass('visible-title');
        }
        else {
            $('.cc-fe_srp.cc-fe_srp-container').removeClass('sticky-filter'); // $('nav div').removeClass('visible-title');
        }
    }
}

export default stickyFilter