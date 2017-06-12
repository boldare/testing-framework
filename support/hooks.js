var world = require('./world.js');
var driver = require('./world.js').getDriver();
var config = require('./config.js');
var fs = require('fs');

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({After, Before}) {
    var logsDir = 'logs/execution_logs/' + world.getLogsDirName();
    var logFileName;
    var screenshotReportsDir = 'logs/screenshot_reports/' + world.getLogsDirName();

    if(!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    // if(config.enableScreenshotReports) {
    //     if(!fs.existsSync(screenshotReportsDir)) {
    //         fs.mkdirSync(screenshotReportsDir);
    //     }
    // }

    Before(function(scenario, callback) {
        // openProxyHttpPort(world.proxyHttpPort).then(function() {
        //     startHar();
        // });
        console.log('before');
        var featureName = scenario.scenario.feature.name;
        var scenarioName = scenario.scenario.name;
        logFileName = `${ featureName }-${ scenarioName }__${ world.getCurrentDate() }`;
        console.log('logFileName: ' + logFileName);
        callback();
    });

    After(function(scenario) {

        if(scenario.isFailed()) {
            console.log('failed');
            world.takeScreenshot(logFileName, logsDir);
        }

        return world.cleanBrowserState('', 'logs/execution_logs/');
    });
});

defineSupportCode(function({registerHandler}) {
    registerHandler('AfterFeatures', function(event) {
        return driver.quit();
    });
});
