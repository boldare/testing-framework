var world = require('./world.js');
var driver = require('./world.js').getDriver();
var config = require('./config.js');
var fs = require('fs');

var {defineSupportCode} = require('cucumber');

defineSupportCode(function({After, Before}) {
    var logsDir = 'logs/execution_logs/' + world.getLogsDirName();
    if(!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir);
    }

    if(config.enableScreenshotReports) {
        var screenshotReportsDir = 'logs/screenshot_reports/' + world.getLogsDirName();
        if(!fs.existsSync(screenshotReportsDir)) {
            fs.mkdirSync(screenshotReportsDir);
        }
    }

    Before(function (scenarioResult, callback) {
        console.log('Before');
        callback();
    });

    After(function () {
        console.log('After');
        return world.cleanBrowserState();
    });
});

defineSupportCode(function({registerHandler}) {
    registerHandler('AfterFeatures', function(event) {
        console.log('AfterFeatures');
        return driver.quit();
    });
});
