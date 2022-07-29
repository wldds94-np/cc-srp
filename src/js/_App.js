// CC CalendarPicker
import monthsPicker from './modules/monthsPicker'
// STICKY
import stickyFilter from './modules/stickyFilter';

class _App {
    constructor() {
        console.log('Instance Here all other auxiliary modules');
        // eslint-disable-next-line no-console
        // console.log('Initialize App');

        this.srpMob = '.srp-header-mob'
        this.srpResInfo = '.srp-header-results'

        this.removable = [
            '.srp-header-left'
        ]

        monthsPicker()
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
