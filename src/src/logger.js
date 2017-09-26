import * as world from './xsolve_wtf';
const config = world.getConfig();
let driver;

export default class Logger {
    constructor(d) {
        console.log('logger constructor driver: ' + d);
        this.driver = d;
        driver = d;
    }

    logMessage(logMessage, detailedOnlyLog = false) {
        let displayDetailedLog = config.detailedTestLog !== undefined ? config.detailedTestLog : false;

        if(displayDetailedLog && detailedOnlyLog) {
            console.log(`LOG-info: ${ logMessage }`);
        } else if(!displayDetailedLog) {
            console.log(`LOG: ${ logMessage }`);
        }
    }

    logError(errorMessage, noThrow = false) {
        let message = `ERROR: ${ errorMessage }`;

        if(noThrow) {
            throw(message);
        } else {
            console.log(message);
        }
    }
}
