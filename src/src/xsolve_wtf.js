import {projectDir} from './helpers';
import {PLATFORM} from './constants';
import {defineSupportCode} from 'cucumber';
import webdriver from 'selenium-webdriver';
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
    return new Promise((resolve) => { resolve(value); });
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

export function logMessage(...args) {
    return logger.logMessage(...args);
}

export function logError(...args) {
    return logger.logError(...args);
}

//validators
export function checkAngularPresence(...args) {//internal
    return validator.checkAngularPresence(...args);
}

export function checkExtendedPageState(...args) {//internal
    return validator.checkExtendedPageState(...args);
}

export function getDocumentReadyState(...args) {//internal
    return validator.getDocumentReadyState(...args);
}

export function validateElementDisplayed(...args) {
    return validator.validateElementDisplayed(...args);
}

export function validateElementNotDisplayed(...args) {
    return validator.validateElementNotDisplayed(...args);
}

export function validateElementVisible(...args) {
    return validator.validateElementVisible(...args);
}

export function validateElementNotVisible(...args) {
    return validator.validateElementNotVisible(...args);
}

export function validateElementsNumber(...args) {
    return validator.validateElementsNumber(...args);
}

export function validateCheckboxValue(...args) {
    return validator.validateCheckboxValue(...args);
}

export function validateElementText(...args) {
    return validator.validateElementText(...args);
}

export function validatePageReadyState(...args) {
    return validator.validatePageReadyState(...args);
}

export function validateExtendedPageState(...args) {
    return validator.validateExtendedPageState(...args);
}

export function validateUrl(...args) {
    return validator.validateUrl(...args);
}

export function validateUrlByRegex(...args) {
    return validator.validateUrlByRegex(...args);
}

export function validateAngularInputValue(...args) {
    return validator.validateAngularInputValue(...args);
}

//actions

export function waitForElement(...args) {
    return action.waitForElement(...args);
}

export function loadPage(...args) {
    return action.loadPage(...args);
}

export function findElement(...args) {
    return action.findElement(...args);
}

export function findElements(...args) {
    return action.findElements(...args);
}

export function click(...args) {
    return action.click(...args);
}

export function jsBasedClick(...args) {
    return action.jsBasedClick(...args);
}

export function getCheckboxValue(...args) {
    return action.getCheckboxValue(...args);
}

export function getElementText(...args) {
    return action.getElementText(...args);
}

export function setCheckboxValue(...args) {
    return action.setCheckboxValue(...args);
}

export function getCurrentUrl(...args) {
    return action.getCurrentUrl(...args);
}

export function hover(...args) {
    return action.hover(...args);
}

export function fillInInput(...args) {
    return action.fillInInput(...args);
}

export function selectFileInputValue(...args) {
    return action.selectFileInputValue(...args);
}

export function getElementsNumber(...args) {
    return action.getElementsNumber(...args);
}

export function sleep(...args) {
    return action.sleep(...args);
}

export function cleanBrowserState(...args) {
    return action.cleanBrowserState(...args);
}

export function takeScreenshot(...args) {
    return action.takeScreenshot(...args);
}

export function getAngularInputValue(...args) {
    return action.getAngularInputValue(...args);
}
