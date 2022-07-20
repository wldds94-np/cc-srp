// import { app } from './app.js';
import app from './app.js'

const breakpoint = 800
let screenWidth = window.screen.width; // console.log(screenWidth);

if (breakpoint > screenWidth) {
    try {
        app()
    } catch (error) {
        console.log(error);
    }
}