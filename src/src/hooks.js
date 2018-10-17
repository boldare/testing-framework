import * as world from './xsolve_wtf';
const config = world.getConfig();
import {defineSupportCode} from 'cucumber';
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';

let driver;

const proxyPortUrl = `http://${ config.proxyHost }:${ config.proxyPort }/proxy`;
const proxyHarUrl = `http://${ config.proxyHost }:${ config.proxyPort }/proxy/${ config.proxyHttpPort }/har` +
    `?captureContent=${ config.proxyCaptureContent }&captureHeaders=${ config.proxyCaptureHeaders }`;
const logsDirName = world.getCurrentDate();

const logsDir = `logs/execution_logs/${ logsDirName }`;
const screenshotReportsDir = `logs/screenshot_reports/${ logsDirName }`;

function isProxyHttpPortOpen() {
    return superagent
        .get(proxyPortUrl)
        .then(function(res) {//TODO: error support (browsermob not running etc.)
            if(res.status !== 200) {
                world.logError(`Proxy response error: "${ res.status }"`);
                return false;
            }

            let portsObj = JSON.parse(res.text);

            if( portsObj !== undefined &&
                portsObj.proxyList !== undefined &&
                portsObj.proxyList[0] !== undefined &&
                portsObj.proxyList[0].port == config.proxyHttpPort
            ) {
                return true;
            }

            return false;
        });
}

function openProxyHttpPort(proxyHttpPort) {
    return isProxyHttpPortOpen().then(function(isOpen) {
        if(!isOpen) {
            world.logMessage(`Opening proxy HTTP port: "${ config.proxyHttpPort }"`, true);

            return superagent
                .post(proxyPortUrl)
                .send('port=' + proxyHttpPort)
                .then(function(res) {
                    if(res.status !== 200) {
                        world.logError(`Proxy response error: "${ res.status }"`);
                    }

                    return true;
                });
        }
    });
}

function startHar() {
    return superagent
        .put(proxyHarUrl)
        .then(function(res) {
            if(res.status !== 200 && res.status !== 204) {
                world.logError(`Proxy start HAR error: "${ res.status }"`);
            }

            return true;
        });
}

function saveHar(fileName, directory) {
    let harFilePath = path.join(directory, `${ fileName }.har`);

    return superagent
        .get(proxyHarUrl)
        .pipe(fs.createWriteStream(harFilePath));
}

defineSupportCode(function({After, Before}) {
    let logFileName;

    createLogDirs(logsDir, screenshotReportsDir);

    Before(function(scenario, callback) {
        this.driver.then(function(d) {
            driver = d;

            openProxyHttpPort(config.proxyHttpPort).then(function() {
                startHar();
            })
            .catch(function (err) {
                world.logError(`Proxy response error: "${ err }"`);
            });

            let featureName = scenario.scenario.feature.name;
            let scenarioName = scenario.scenario.name;
            logFileName = `${ world.getCurrentDate() }__${ featureName }-${ scenarioName }`;
            if(config.truncateLogsFileName)
                logFileName = truncate(logFileName, 100);

            callback();
        });
    });

    After(function(scenario) {
        if(scenario.isFailed()) {
            world.takeScreenshot(logFileName, logsDir);

            driver.manage().logs().get('driver').then(function(logs){
                world.logMessage(`Driver logs: "${ JSON.stringify(logs) }"`);
            });

            driver.manage().logs().get('browser').then(function(logs){
                world.logMessage(`Browser logs: "${ JSON.stringify(logs) }"`);
            });
        }

        saveHar(logFileName, logsDir);
        return driver.quit();
        //return world.cleanBrowserState();
    });
});


defineSupportCode(function({registerHandler}) {
    registerHandler('AfterStep', function(afterStepData) {
        if(!config.enableScreenshotReports)
            return;

        if(afterStepData.constructor.name !== 'Step')
            return;

        //screenshot reports
        let featureName = afterStepData.scenario.feature.name;
        let scenarioName = afterStepData.scenario.name;
        let stepName = afterStepData.name;
        let screenshotReportFileName = `${ world.getCurrentDate() }__${ featureName }-${ scenarioName }-${ stepName }`;
        if(config.truncateLogsFileName)
            screenshotReportFileName = truncate(screenshotReportFileName, 100);

        world.takeScreenshot(screenshotReportFileName, screenshotReportsDir);
    });
});

function truncate(str, n){
    return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

function createLogDirs(logsDir, screenshotReportsDir) {
    if(!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    if(config.enableScreenshotReports) {
        if(!fs.existsSync(screenshotReportsDir)) {
            fs.mkdirSync(screenshotReportsDir);
        }
    }
}
