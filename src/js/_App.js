// CC CalendarPicker
import datePicker from './modules/datePicker'
// STICKY
import stickyFilter from './modules/stickyFilter';

class _App {
    constructor() {
        console.log('Instace Here all other auxiliary modules');
        // eslint-disable-next-line no-console
        // console.log('Initialize App');

        this.srpMob = '.srp-header-mob'
        this.srpResInfo = '.srp-header-results'

        this.removable = [
            '.srp-header-left'
        ]

        datePicker()
        stickyFilter()
    }

    // registerHandler() {
    //     document.addEventListener('click', '.cc-fe_srp-togglePanel', function(e) {
    //         e.preventDefault()

    //         let toFind = e.target
    //         // let panel = 
    //         console.log(toFind);
    //     })
    // }
}

export default _App;
