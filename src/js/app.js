// Style
import '../scss/app.scss';

// FUNNEL DATA
import Funnel from './base/funnel';

// Interept fetch Windows Requests
import Interceptor from './classes/Interceptor';

/* Config the setup and adjust the layout before */
import Setup from './base/setup';

/* Start app */
import _App from './_App.js';

// import Router from './base/router';
import Router from './classes/Router';
// CC CalendarPicker
// import datePicker from './modules/datePicker';


const app = () => {
    const setup = new Setup(new Router, new Funnel())
    // console.log('Init app...');

    // The variable that await all request and the setup Initialization
    let appCouldStart = false

    // Request to INTERCEPT
    let toIntercept = {
        '/promos.promosDetails.json': {
            cb: handlerPromosDetails,
            response: true,
            resolve: false,
            // resolveState: state => 
        },
        '/itineraries/bestPrice': {
            cb: handlerBestPrice,
            response: false,
            resolve: false,
        },
        '/occupancysearch': {
            cb: handlerOccupancySearch,
            response: true,
            resolve: false,
        },
    }
    Interceptor(toIntercept)

    function handlerPromosDetails(data) {
        toIntercept['/promos.promosDetails.json'].resolve = true
        setup.Funnel.syncPromos(data)
        setup.isInitializedPromos = true
    }

    function handlerBestPrice(data) {
        if (appCouldStart) {

        } else {
            toIntercept['/itineraries/bestPrice'].resolve = true
            setup.Funnel.syncBestPrice(data)
            setup.isInitializedBestPrc  = true
        }
        // console.log('HANDLER BestPrice: ', data);
    }

    function handlerOccupancySearch(data) {
        setup.syncOccupancySearch(data)
        toIntercept['/occupancysearch'].resolve = true
        setup.isInitializedOccSrc = true

    }

    function couldStart(intID) {
        if (appCouldStart) {
            setup.draw()
            clearInterval(intID)
            return true
        }
        return false
    } 
    
    let firstSync = setInterval(function () {
        // console.log(firstSync);
        if (setup.isInitializedPromos && setup.isInitializedBestPrc && setup.isInitializedOccSrc) {
            clearInterval(firstSync)
            console.log('Instanciate the Class');
            setup.init()
    
            appCouldStart = true
        }
    }, 300)

    document.addEventListener("DOMContentLoaded", function () {
        // console.log(firstSync);
        if (appCouldStart) {
            setup.draw()
        } else {
            let drawSync = setInterval(function () {
                if(couldStart(drawSync)) {
                    new _App()
                }
            }, 300)
        }
    });
}

export default app