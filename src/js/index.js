// ARRAY
// import './prototype/Array.js';


// import { app } from './app.js';
import app from './app.js'

const breakpoint = 800
const template = 'searchResultsV2Page'
let screenWidth = window.screen.width; // console.log(screenWidth);

let domTemplate = configs.template
console.log(domTemplate);

if (breakpoint > screenWidth && domTemplate == template) {
    try {
        app()
    } catch (error) {
        console.log(error);
    }
}