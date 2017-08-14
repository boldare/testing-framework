var world = require('./world.js');
var driver = world.getDriver();
var config = require('./config.js');
var {defineSupportCode} = require('cucumber');
var fs = require('fs');
var superagent = require('superagent');
var path = require('path');

var proxyPortUrl = `http://${ config.proxyHost }:${ config.proxyPort }/proxy`;
var proxyHarUrl = `http://${ config.proxyHost }:${ config.proxyPort }/proxy/${ config.proxyHttpPort }/har` +
    `?captureContent=${ config.proxyCaptureContent }&captureHeaders=${ config.proxyCaptureHeaders }`;

var logsDir = 'logs/execution_logs/' + world.getLogsDirName();
var screenshotReportsDir = 'logs/screenshot_reports/' + world.getLogsDirName();

var isProxyHttpPortOpen = function() {
    return superagent
        .get(proxyPortUrl)
        .then(function(res) {//TODO: error support (browsermob not running etc.)
            if(res.status !== 200) {
                world.logError('Proxy response error: ' + res.status);
                return false;
            }

            var portsObj = JSON.parse(res.text);

            if( portsObj !== undefined &&
                portsObj.proxyList !== undefined &&
                portsObj.proxyList[0] !== undefined &&
                portsObj.proxyList[0].port == config.proxyHttpPort
            ) {
                return true;
            }

            return false;
        });
};

var openProxyHttpPort = function(proxyHttpPort) {
    return isProxyHttpPortOpen().then(function(isOpen) {
        if(!isOpen) {
            world.logMessage('Opening proxy HTTP port: ' + config.proxyHttpPort, true);

            return superagent
                .post(proxyPortUrl)
                .send('port=' + proxyHttpPort)
                .then(function(res) {
                    if(res.status !== 200) {
                        world.logError('Proxy response error: ' + res.status);
                    }

                    return true;
                });
        }
    });
};

var startHar = function() {
    return superagent
        .put(proxyHarUrl)
        .then(function(res) {
            if(res.status !== 200 && res.status !== 204) {
                world.logError('Proxy start HAR error: ' + res.status);
            }

            return true;
        });
};

var saveHar = function(fileName, directory) {
    var harFilePath = path.join(directory, fileName + ".har");

    return superagent
        .get(proxyHarUrl)
        .pipe(fs.createWriteStream(harFilePath));
};

defineSupportCode(function({After, Before}) {
    var logFileName;

    createLogDirs(logsDir, screenshotReportsDir);

    Before(function(scenario, callback) {
        openProxyHttpPort(config.proxyHttpPort).then(function() {
            startHar();
        })
        .catch(function (err) {
            world.logError('Proxy response error: ' + err);
        });

        var featureName = scenario.scenario.feature.name;
        var scenarioName = scenario.scenario.name;
        logFileName = `${ world.getCurrentDate() }__${ featureName }-${ scenarioName }`;

        callback();
    });

    After(function(scenario) {

        if(scenario.isFailed()) {
            world.takeScreenshot(logFileName, logsDir);

            driver.manage().logs().get('driver').then(function(logs){
                world.logMessage('Driver logs: ' + JSON.stringify(logs));
            });

            driver.manage().logs().get('browser').then(function(logs){
                world.logMessage('Browser logs: ' + JSON.stringify(logs));
            });
        }

        saveHar(logFileName, logsDir);

        return world.cleanBrowserState();
    });
});

defineSupportCode(function({registerHandler}) {
    registerHandler('AfterFeatures', function(event) {
        return driver.quit();
    });
});

defineSupportCode(function({registerHandler}) {
    registerHandler('AfterStep', function(afterStepData) {
        if(!config.enableScreenshotReports)
            return;

        if(afterStepData.constructor.name !== 'Step')
            return;

        var featureName = afterStepData.scenario.feature.name;
        var scenarioName = afterStepData.scenario.name;
        var stepName = afterStepData.name;
        var screenshotReportFileName = `${ world.getCurrentDate() }__${ featureName }-${ scenarioName }-${ stepName }`;
        world.takeScreenshot(screenshotReportFileName, screenshotReportsDir);
    });
});

function createLogDirs(logsDir, screenshotReportsDir) {
    if(!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    if(config.enableScreenshotReports) {
        if(!fs.existsSync(screenshotReportsDir)) {
            fs.mkdirSync(screenshotReportsDir);
        }
    }
};
