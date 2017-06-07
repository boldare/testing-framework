var webdriver = require('selenium-webdriver'),
    By = webdriver.By;
var webdriverRemote = require('selenium-webdriver/remote');
var sprintf = require('sprintf-js').sprintf;
var config = require('./config.js');

var seleniumServerUrl = 'http://%s:%s/wd/hub';

const PLATFORM  = {
    CHROME: 'CHROME',
    FIREFOX: 'FIREFOX'
};

var buildDriver = function(platform) {
    var capabilities;

    if(platform === PLATFORM.CHROME) {
        capabilities = webdriver.Capabilities.chrome();
    } else if(platform === PLATFORM.FIREFOX) {
        capabilities = webdriver.Capabilities.firefox();
    }

    var logPreferences = new webdriver.logging.Preferences();
    logPreferences.setLevel('driver', config.seleniumDriverLogLevel);
    logPreferences.setLevel('browser', config.seleniumBrowserLogLevel);

    var seleniumProxy = require('selenium-webdriver/proxy');
    var proxyUrl = config.proxyHost + ':' + config.proxyHttpPort;

    return new webdriver.Builder()
    .usingServer(sprintf(seleniumServerUrl, config.seleniumServerHost, config.seleniumServerPort))
    .withCapabilities(capabilities)
    .setLoggingPrefs(logPreferences)
    .setProxy(seleniumProxy.manual({
        http: proxyUrl
    }))
    .build();
};

var loadDriverOptions = function(driver) {
    if(config.runMaximized) {
    driver.manage().window().maximize();
    }

    if(config.xvfbMode) {
    driver.manage().window().setSize(config.xvfbSettings.windowWidth, config.xvfbSettings.windowHeight);
    }

    driver.setFileDetector(new webdriverRemote.FileDetector);
};

//building driver
var driver = buildDriver(config.platform);
loadDriverOptions(driver);

//methods
var loadPage = function(page) {
    return driver.get(page);
};

var waitForElement = function(xpath, customTimeout) {
    var waitTimeout = timeout || defaultTimeout;

    return driver.wait(until.elementLocated(By.xpath(xpath)), waitTimeout);
};

var findElement = function(xpath, customTimeout) {
    return waitForElement(xpath, customTimeout)
    .then(function() {
        return driver.findElement(By.xpath(xpath));
    });
};

var findElements = function(xpath, customTimeout) {
    return waitForElement(xpath, customTimeout)
    .then(function() {
        return driver.findElements(By.xpath(xpath));
    });
};

var click = function(xpath, customTimeout) {
    return findElement(xpath, customTimeout)
    .then(function(el) {
        el.click().catch(function(e) {
        console.log('Standard click failed.');
        });
    });
};

var World = function() {
};

module.exports = {
    loadPage: loadPage,
};
