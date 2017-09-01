Function.prototype.curry = function() {
    let func = this;
    let slice = Array.prototype.slice;
    let appliedArgs = slice.call(arguments, 0);

    return function() {
        let leftoverArgs = slice.call(arguments, 0);
        return func.apply(this, appliedArgs.concat(leftoverArgs));
    };
};

global.tf = global.tf || {};

//imports
const path = require('path');
global.tf.projectDir = path.join(__dirname, '../../..');//TODO: temporary solution
const webdriver = require('selenium-webdriver'),
    By = webdriver.By;
const webdriverRemote = require('selenium-webdriver/remote');
const config = require(`${ global.tf.projectDir }/config.js`);
const pageUrlData = require(`${ global.tf.projectDir }/data/pageUrlData.js`);//should be loaded from config file
const fs = require('fs');

//vars
let driver;
let logsDirName;
const seleniumServerUrl = `http://${ config.seleniumServerHost }:${ config.seleniumServerPort }/wd/hub`;

const PLATFORM  = {
    CHROME: 'CHROME',
    FIREFOX: 'FIREFOX',
    IE: 'IE',
    EDGE: 'EDGE',
    OPERA: 'OPERA',
    SAFARI: 'SAFARI',
    PHANTOMJS: 'PHANTOMJS',
    HTMLUNITWITHJS: 'HTMLUNITWITHJS',
    ANDROID: 'ANDROID',
    IPHONE: 'IPHONE',
    IPAD: 'IPAD'
};

init();

//methods
function logMessage(logMessage, detailedOnlyLog = false) {
    let displayDetailedLog = config.detailedTestLog !== undefined ? config.detailedTestLog : false;

    if(displayDetailedLog && detailedOnlyLog) {
        console.log(`LOG-info: ${ logMessage }`);
    } else if(!displayDetailedLog) {
        console.log(`LOG: ${ logMessage }`);
    }
}

function logError(errorMessage, noThrow = false) {
    let message = `ERROR: ${ errorMessage }`;

    if(noThrow) {
        throw(message);
    } else {
        console.log(message);
    }
}

function loadPage(page) {
    return driver.get(page);
}

function loadPageByRoute(routeName, customTimeout) {//TODO: timeout
    let routeValue = pageUrlData['basic'][routeName];

    if(routeValue.charAt(0) === '/') {
        routeValue = routeValue.substr(1);
    }

    return driver.get(config.baseUrl + routeValue);
}

function validateUrl(url, customTimeout = config.defaultTimeout) {
    return driver.wait(function() {
            return driver.getCurrentUrl().then(function(currentUrl) {
                if(currentUrl.indexOf(url) !== -1) {
                    return true;
                }

                return sleep(config.pollingRate).then(function() {
                    return false;
                });
            });
        },
        customTimeout
    );
}

function validateUrlByRegex(regex, customTimeout = config.defaultTimeout) {
    return driver.wait(function() {
            return driver.getCurrentUrl().then(function(currentUrl) {
                let r = new RegExp(regex);
                if(r.test(currentUrl)) {
                    return true;
                }

                return sleep(config.pollingRate).then(() => false);
            });
        },
        customTimeout
    );
}

function getCurrentUrl() {
    return driver.getCurrentUrl();
}

function validateUrlByRoute(pageName, customTimeout) {
    if(pageUrlData.regex && pageUrlData.regex[pageName]) {
        let url = pageUrlData.regex[pageName];

        return validateUrlByRegex(url, customTimeout);
    }
    if(pageUrlData.basic && pageUrlData.basic[pageName]) {
        let url = pageUrlData.basic[pageName];

        return validateUrl(url, customTimeout);
    }

    logError(`validateUrlByRoute - incorrect page name: ${ pageName }`);
}

 function getDocumentReadyState() {//internal only
    return driver.executeScript(
        'return document.readyState === \'complete\'',
        ''
    ).then((result) => result);
}

function checkAngularPresence() {
    let script = 'return (window.angular !== undefined)';

    return driver.executeScript(script, '')
        .then((result) => result);
}

function checkExtendedPageState() {
    if(!config.extendedPageReadyStateValidation) {
        return boolPromiseResult(true);
    }

    return checkAngularPresence().then(function(present) {
        if(present) {
            //angular-based page - validation
            let script = 'return (angular.element(document.body).injector() !== undefined) && ' +
            '(angular.element(document.body).injector().get(\'$http\').pendingRequests.length === 0)';

            return driver.executeScript(script, '')
                .then((result) => result);
        }

        return true;//currently only Angular
    });
}

function validateExtendedPageState(customTimeout = config.defaultTimeout) {
    return driver.wait(function() {
        return checkExtendedPageState()
            .then(function(value) {
                if(value) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    );
}

function validatePageReadyState(customTimeout = config.defaultTimeout) {
    return driver.wait(function() {
        return getDocumentReadyState()
            .then(function(value) {
                if(value) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    ).then(function() {
        return validateExtendedPageState(customTimeout);
    });
}

function waitForElement(xpath, customTimeout = config.defaultTimeout) {//internal only
    return driver.wait(
        function () {
            return driver.findElements(By.xpath(xpath)).then(function(el) {
                if(el.length > 0) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`waitForElement failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function findElement(xpath, customTimeout) {
    return waitForElement(xpath, customTimeout)
        .then(() => driver.findElement(By.xpath(xpath)));
}

function findElements(xpath, customTimeout) {
    return waitForElement(xpath, customTimeout)
        .then(() => driver.findElements(By.xpath(xpath)));
}

function getElementsNumber(xpath, customTimeout) {
    return driver.findElements(By.xpath(xpath), customTimeout)
        .then((el) => el.length);
}

function validateElementsNumber(xpath, number, customTimeout = config.defaultTimeout) {
    if(number === 0) {
        return validatePageReadyState()
            .then(() => validateElementNotVisible(xpath, customTimeout));
    } else {
        return driver.wait(
            function () {
                return findElements(xpath, customTimeout).then(function(elem) {
                    if(elem.length === number) {
                        return true;
                    }

                    return sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateElementsNumber failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }
}

function validateElementDisplayed(xpath, customTimeout = config.defaultTimeout) {//visible in sources AND displayed
    return driver.wait(
        function () {
            return findElements(xpath, customTimeout).then(function(elem) {
                if(elem[0].isDisplayed()) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`validateElementDisplayed failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function validateElementNotDisplayed(xpath, customTimeout = config.defaultTimeout) {//element visible in sources and not displayed
    return driver.wait(
        function () {
            return findElements(xpath, customTimeout).then(function(elem) {
                if(!elem[0].isDisplayed()) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`validateElementNotDisplayed failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function validateElementVisible(xpath, customTimeout = config.defaultTimeout) {//element visible in sources and may be displayed or not
    return driver.wait(
        function () {
            return findElements(xpath).then(function(elem) {
                if(elem.length !== 0) {
                    return true;
                }

                return sleep(config.pollingRate)
                    .then(() => false);
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`validateElementVisible failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function validateElementNotVisible(xpath, customTimeout = config.defaultTimeout) {//not visible in sources and not displayed
    return validatePageReadyState().then(function() {
        return driver.wait(
            function () {
                return driver.findElements(By.xpath(xpath)).then(function(elem) {
                    if(elem.length === 0) {
                        return true;
                    }

                    return sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).catch(function(err){
                throw(`validateElementNotVisible failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    });
}

function jsBasedClick(xpath) {
    //TODO2: timeout
    return findElement(xpath, 0)
        .then(function() {
            return driver.executeScript(
                `document.evaluate('${ xpath }', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();`
            ).then(() => false);
        });
}

function click(xpath, customTimeout) {
    return validatePageReadyState()
        .then(function() {
            return findElement(xpath, customTimeout)
                .then(function(el) {
                    el.click().catch(function(err) {
                        logMessage(`Standard click failed with error message: "${ err.message }"`, true);
                        return jsBasedClick(xpath);
                    });
                });
        });
}

function hover(xpath, customTimeout) {
    return validatePageReadyState()
        .then(function() {
            return findElement(xpath, customTimeout)
                .then((el) => driver.actions().mouseMove(el).perform());
        });
}

function fillInInput(xpath, value, blur, customTimeout) {
    let element;

    return findElement(xpath, customTimeout)
        .then(function(el) {
            element = el;

            return element.clear();
        })
        .then(() => element.sendKeys(typeof blur !== 'undefined' && blur ? value  + '\t': value));
}

function getCheckboxValue(xpath, customTimeout) {
    return findElement(xpath, customTimeout)
        .then((el) => el.isSelected());
}

function validateCheckboxValue(xpath, value, customTimeout = config.defaultTimeout) {
    return driver.wait(
        function () {
            return getCheckboxValue(xpath, customTimeout)
                .then((currentValue) => currentValue === value);
        },
        customTimeout
    ).catch(function(err){
        throw(`validateCheckboxValue failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function setCheckboxValue(xpath, value, customTimeout = config.defaultTimeout) {
    return getCheckboxValue(xpath, customTimeout).then(function(isChecked) {
        if(isChecked === value) {
            return true;
        }

        return click(xpath, customTimeout).then(() => true);
    });
}

function getElementText(xpath, customTimeout = config.defaultTimeout) {
    return findElement(xpath, customTimeout)
        .then((el) => el.getText());
}

function validateElementText(xpath, text, customTimeout = config.defaultTimeout) {
    return driver.wait(
        function () {
            return getElementText(xpath, customTimeout).then(function(currentText) {
                return currentText === text;
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`validateElementText failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

function selectFileInputValue(inputXP, fileName, customTimeout = config.defaultTimeout) {
    return findElement(inputXP, customTimeout)
        .then(function(el) {
            let filePath = global.tf.projectDir + `/data/test_files/${ fileName }`;
            logMessage(`Selecting ${ filePath } file.`);

            return el.sendKeys(filePath);
      });
}

function sleep(sleepTime) {
    return new Promise((resolve) => setTimeout(resolve, sleepTime));
}

function getDriver() {
    return driver;
}

function getLogsDirName() {//internal only
    return logsDirName;
}

function cleanBrowserState() {
    return driver.executeScript('return window.location.hostname.length > 0', '').then(function(result) {//data URLs
        if(result) {
            driver.executeScript('localStorage.clear()');
            driver.executeScript('sessionStorage.clear()');
            driver.executeScript('console.clear()');
        } else {
            logError('Can\'t clean localStorage and sessionStorage');
        }

        return driver.manage().deleteAllCookies();
    });
}

function takeScreenshot(fileName, directory) {
    let screenshotFilePath = path.join(directory, `${ fileName }.png`);

    return driver.takeScreenshot().then(function(data){
        let base64Data = data.replace(/^data:image\/png;base64,/,"");

        return fs.writeFile(screenshotFilePath, base64Data, 'base64', function(err) {
            if(err) {
                logError(`takeScreenshot eror: ${ err }`);
            }
        });
    });
}

//angular-specific methods

function getAngularInputValue(xpath, customTimeout = config.defaultTimeout) {
    return findElement(xpath, customTimeout).then(function() {
        var script = `return document.evaluate('${ xpath }', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value`;

        return driver.executeScript(script, '')
            .then((result) => result);
    });
}

function validateAngularInputValue(xpath, expectedValue, customTimeout = config.defaultTimeout) {
    return driver.wait(
        function () {
            return getAngularInputValue(xpath, customTimeout).then(function(currentValue) {
                return currentValue === expectedValue;
            });
        },
        customTimeout
    ).catch(function(err){
        throw(`validateAngularInputValue failed on element: "${ xpath }". Error message: "${ err.message }", error stack: "${ err.stack }`);
    });
}

//internal methods

function boolPromiseResult(value) {
    return new Promise((resolve, reject) => { resolve(value); });
}

function init() {

    logsDirName = getCurrentDate();

    driver = buildDriver(config.platform);
    loadDriverOptions(driver);
}

function getCurrentDate() {
    let date = new Date();

    return `${ date.toJSON().slice(0,10) }_${ date.getHours() }-${ date.getMinutes() }-${ date.getSeconds() }-${ date.getMilliseconds() }`;
}

function buildDriver(platform) {
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
    logPreferences.setLevel('driver', config.seleniumDriverLogLevel);
    logPreferences.setLevel('browser', config.seleniumBrowserLogLevel);

    let seleniumProxy = require('selenium-webdriver/proxy');
    let proxyUrl = config.proxyHost + ':' + config.proxyHttpPort;

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
        driver.manage().window().setSize(config.xvfbSettings.windowWidth, config.xvfbSettings.windowHeight);
    }

    driver.setFileDetector(new webdriverRemote.FileDetector);
}

module.exports = {
    logMessage: logMessage,
    logError: logError,
    loadPage: loadPage,
    loadPageByRoute: loadPageByRoute,
    findElement: findElement,
    findElements: findElements,
    validateElementDisplayed: validateElementDisplayed,
    validateElementNotDisplayed: validateElementNotDisplayed,
    validateElementVisible: validateElementVisible,
    validateElementNotVisible: validateElementNotVisible,
    validateElementsNumber: validateElementsNumber,
    click: click,
    getCheckboxValue: getCheckboxValue,
    setCheckboxValue: setCheckboxValue,
    validateCheckboxValue: validateCheckboxValue,
	getElementText: getElementText,
    validateElementText: validateElementText,
    getCurrentUrl: getCurrentUrl,
    hover: hover,
    fillInInput: fillInInput,
    selectFileInputValue: selectFileInputValue,
    getDriver: getDriver,
    getElementsNumber: getElementsNumber,
    getCurrentDate: getCurrentDate,
    sleep: sleep,
    getLogsDirName: getLogsDirName,
    cleanBrowserState: cleanBrowserState,
    takeScreenshot: takeScreenshot,
    validatePageReadyState: validatePageReadyState,
    validateUrl: validateUrl,
    validateUrlByRegex: validateUrlByRegex,
    validateUrlByRoute: validateUrlByRoute,
    getAngularInputValue,
    validateAngularInputValue
};
