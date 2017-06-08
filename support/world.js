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
var log = function(logMessage, detailedLog) {
    var displayDetailedLog = detailedLog !== 'undefined' ? detailedLog : false;

    if(displayDetailedLog && config.detailedTestLog) {
        console.log(sprintf('LOG-info: %s', logMessage));
    } else if(!displayDetailedLog) {
        console.log(sprintf('LOG: %s', logMessage));
    }
};

var loadPage = function(page) {
    return driver.get(page);
};

var loadPageByRoute = function(routeName, customTimeout) {
    //TODO: implement
};

var validateUrl(url, customTimeout) {
    return driver.wait(function() {
            return driver.getCurrentUrl().then(function(currentUrl) {
                return currentUrl.indexOf(url) !== -1;
            });
        },
        defaultTimeout
    );
};

var validateUrlByRoute(pageName, customTimeout) {
    //TODO: implement regex-based version
    var url = pageUrlData['basic'][pageName];

    return validateUrl(url, customTimeout);
};

var getDocumentReatyState = function() {
    return driver.executeScript(
        'return document.readyState === \'complete\'',
        ''
    ).then(function(result) {
        return result;
    });
};

var validatePageReadyState = function() {
    //TODO: code style
    return driver.wait(function() {
        return getDocumentReatyState()
            .then(function(value) {
                return value;
            },
            function() {
                return getDocumentReatyState()
                    .then(function(value) {
                        return value;
                    });
            });
    }, defaultTimeout);
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

var isDisplayed = function(xpath, customTimeout) {
    //TODO: implement
};

var isNotDisplayed = function(xpath, customTimeout) {
    //TODO: implement
};

var isElementVisible = function(xpath, customTimeout) {
    //TODO: implement
};

var isElementNotVisible = function(xpath, customTimeout) {
    //TODO: implement
};

var jsBasedClick = function(xpath) {
    return findElement(xpath, 0)
        .then(function() {
            return driver.executeScript(
                'document.evaluate(\''+ xpath +'\', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();'
            ).then(function() {
                return true;
            });
        });
};

var click = function(xpath, customTimeout) {
    return validatePageReadyState()
        .then(function() {
            return findElement(xpath, customTimeout)
                .then(function(el) {
                    el.click().catch(function(e) {
                        console.log('Standard click failed.');
                        return jsBasedClick(xpath);
                    });
                });
        });
};

var hover = function(xpath, customTimeout) {
    return validatePageReadyState()
        .then(function() {
            return findElement(xpath, customTimeout).then(function(el) {
                return driver.actions().mouseMove(el).perform();
            });
        });
};

var fillInInput = function(xpath, value, blur, customTimeout) {
    return findElement(xpath, customTimeout)
        .clear()
        .sendKeys(typeof blur !== 'undefined' && blur ? value  + '\t': value);
};

var selectImage(imageInputXP, imageName, customTimeout) {
    return waitForElement(imageInputXP, customTimeout)
        .then(function() {
            return findElement(xpath, 0)
                .then(function(el) {
                    var imageDir = config.baseDirectory + 'testImages/' + imageName;

                    return el.sendKeys(imageDir);
                });
        });
};

var sleep = function(sleepTime) {
    return new Promise((resolve) => setTimeout(resolve, sleepTime));
};

var getDriver = function() {
    return driver;
};

//angular-specific methods

var getAngularInputValue = function(xpath, customTimeout) {
    //TODO: implement
};

var validateDynamicAngularInputValue = function(xpath, expectedValue, customTimeout) {
    //TODO: implement
};

var World = function() {
};

module.exports = {
    loadPage: loadPage,
    findElement: findElement,
    findElements: findElements,
    click: click,
    hover: hover,
    fillInInput: fillInInput,
    selectImage: selectImage,
    getDriver: getDriver,
    sleep: sleep
};
