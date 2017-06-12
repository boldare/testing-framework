var world = require('./world.js');
var driver = require('./world.js').getDriver();
var config = require('./config.js');
var fs = require('fs');

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({After, Before}) {
    var logsDir = 'logs/execution_logs/' + world.getLogsDirName();
    var logFileName = scenario.getName() + '_' + world.getCurrentTime();
    var screenshotReportsDir = 'logs/screenshot_reports/' + world.getLogsDirName();

    if(!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    // if(config.enableScreenshotReports) {
    //     if(!fs.existsSync(screenshotReportsDir)) {
    //         fs.mkdirSync(screenshotReportsDir);
    //     }
    // }

    Before(function (scenarioResult, callback) {
        console.log('Before');
        callback();
    });

    After(function (scenario) {
        console.log('After');

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
