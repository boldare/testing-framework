import {projectDir} from './helpers';
import {PLATFORM} from './constants';
import {defineSupportCode} from 'cucumber';
import webdriver from 'selenium-webdriver';
import {By} from 'selenium-webdriver';
import webdriverRemote from 'selenium-webdriver/remote';
import fs from 'fs';
import path from 'path';

//framework modules
import Logger from './logger';
import Validator from './validator';
import Action from './action';

let driver;
let logsDirName;
let config;
let logger;
let validator;
let action;

const seleniumServerUrl = `http://${ getConfig().seleniumServerHost }:${ getConfig().seleniumServerPort }/wd/hub`;

export function CustomWorld({attach, parameters}) {
    console.log('customWorld constructor');

    this.attach = attach;
    this.parameters = parameters;

    this.driver = buildDriver(getConfig().platform).then(function(d) {
        driver = d;
        loadDriverOptions(d);

        logger = new Logger(d);
        validator = new Validator(d);
        action = new Action(d);

        return d;
    });
}

defineSupportCode(function({setWorldConstructor}) {
    setWorldConstructor(CustomWorld);
});

Function.prototype.curry = function() {
    let func = this;
    let slice = Array.prototype.slice;
    let appliedArgs = slice.call(arguments, 0);

    return function() {
        let leftoverArgs = slice.call(arguments, 0);
        return func.apply(this, appliedArgs.concat(leftoverArgs));
    };
};


export function getConfig() {
    if (config)
        return config;

    config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../..') + '/config.json', 'utf8'));//TODO: temporary solution

    return config;
}

export function getProjectDir() {
    return projectDir;
}

export function boolPromiseResult(value) {
    return new Promise((resolve, reject) => { resolve(value); });
}

export function getLogsDirName() {//internal only
    return logsDirName;
}

export function getCurrentDate() {
    let date = new Date();

    return `${ date.toJSON().slice(0,10) }_${ date.getHours() }-${ date.getMinutes() }-${ date.getSeconds() }-${ date.getMilliseconds() }`;
}

export function getDriver() {
    return driver;
}

function buildDriver(platform) {
    console.log('platform: ' + PLATFORM);
    let capabilities;

    switch(platform) {
        case PLATFORM.CHROME:
            capabilities = webdriver.Capabilities.chrome();
            break;
        case PLATFORM.FIREFOX:
            capabilities = webdriver.Capabilities.firefox();
            break;
        case PLATFORM.IE:
            capabilities = webdriver.Capabilities.ie();
            break;
        case PLATFORM.EDGE:
            capabilities = webdriver.Capabilities.edge();
            break;
        case PLATFORM.OPERA:
            capabilities = webdriver.Capabilities.opera();
            break;
        case PLATFORM.SAFARI:
            capabilities = webdriver.Capabilities.safari();
            break;
        case PLATFORM.PHANTOMJS:
            capabilities = webdriver.Capabilities.phantomjs();
            break;
        case PLATFORM.HTMLUNITWITHJS:
            capabilities = webdriver.Capabilities.htmlunitwithjs();
            break;
        case PLATFORM.ANDROID:
            capabilities = webdriver.Capabilities.android();
            break;
        case PLATFORM.IPHONE:
            capabilities = webdriver.Capabilities.iphone();
            break;
        case PLATFORM.IPAD:
            capabilities = webdriver.Capabilities.ipad();
            break;
    }

    let logPreferences = new webdriver.logging.Preferences();
    logPreferences.setLevel('driver', getConfig().seleniumDriverLogLevel);
    logPreferences.setLevel('browser', getConfig().seleniumBrowserLogLevel);

    let seleniumProxy = require('selenium-webdriver/proxy');
    let proxyUrl = getConfig().proxyHost + ':' + getConfig().proxyHttpPort;

    return new webdriver.Builder()
        .usingServer(seleniumServerUrl)
        .withCapabilities(capabilities)
        .setLoggingPrefs(logPreferences)
        .setProxy(seleniumProxy.manual({
            http: proxyUrl
        }))
        .build();
}

function loadDriverOptions(driver) {
    if(config.runMaximized) {
        driver.manage().window().maximize();
    }

    if(config.xvfbMode) {
        driver.manage().window().setSize(getConfig().xvfbSettings.windowWidth, getConfig().xvfbSettings.windowHeight);
    }

    return driver.setFileDetector(new webdriverRemote.FileDetector);
}

//loggers

export let logMessage = function(...args) {
    return logger.logMessage(...args);
};

export let logError = function(...args) {
    return logger.logError(...args);
};

//validators
export let checkAngularPresence = function(...args) {//internal
    return validator.checkAngularPresence(...args);
};

export let checkExtendedPageState = function(...args) {//internal
    return validator.checkExtendedPageState(...args);
};

export let getDocumentReadyState = function(...args) {//internal
    return validator.getDocumentReadyState(...args);
};

export let validateElementDisplayed = function(...args) {
    return validator.validateElementDisplayed(...args);
};

export let validateElementNotDisplayed = function(...args) {
    return validator.validateElementNotDisplayed(...args);
};

export let validateElementVisible = function(...args) {
    return validator.validateElementVisible(...args);
};

export let validateElementNotVisible = function(...args) {
    return validator.validateElementNotVisible(...args);
};

export let validateElementsNumber = function(...args) {
    return validator.validateElementsNumber(...args);
};

export let validateCheckboxValue = function(...args) {
    return validator.validateCheckboxValue(...args);
};

export let validateElementText = function(...args) {
    return validator.validateElementText(...args);
};

export let validatePageReadyState = function(...args) {
    return validator.validatePageReadyState(...args);
};

export let validateExtendedPageState = function(...args) {
    return validator.validateExtendedPageState(...args);
};

export let validateUrl = function(...args) {
    return validator.validateUrl(...args);
};

export let validateUrlByRegex = function(...args) {
    return validator.validateUrlByRegex(...args);
};

export let validateAngularInputValue = function(...args) {
    return validator.validateAngularInputValue(...args);
};

//actions

export let waitForElement = function(...args) {
    return action.waitForElement(...args);
};

export let loadPage = function(...args) {
    return action.loadPage(...args);
};

export let loadPageByRoute = function(...args) {
    return action.loadPageByRoute(...args);
};

export let findElement = function(...args) {
    return action.findElement(...args);
};

export let findElements = function(...args) {
    return action.findElements(...args);
};

export let click = function(...args) {
    return action.click(...args);
};

export let jsBasedClick = function(...args) {
    return action.jsBasedClick(...args);
};

export let getCheckboxValue = function(...args) {
    return action.getCheckboxValue(...args);
};

export let setCheckboxValue = function(...args) {
    return action.setCheckboxValue(...args);
};

export let getCurrentUrl = function(...args) {
    return action.getCurrentUrl(...args);
};

export let hover = function(...args) {
    return action.hover(...args);
};

export let fillInInput = function(...args) {
    return action.fillInInput(...args);
};

export let selectFileInputValue = function(...args) {
    return action.selectFileInputValue(...args);
};

export let getElementsNumber = function(...args) {
    return action.getElementsNumber(...args);
};

export let sleep = function(...args) {
    return action.sleep(...args);
};

export let cleanBrowserState = function(...args) {
    return action.cleanBrowserState(...args);
};

export let takeScreenshot = function(...args) {
    return action.takeScreenshot(...args);
};

export let getAngularInputValue = function(...args) {
    return action.getAngularInputValue(...args);
};
