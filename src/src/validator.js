import * as world from './xsolve_wtf';
import {By} from 'selenium-webdriver';
const config = world.getConfig();
let driver;

export default class Validator {
    constructor(d) {
        this.driver = d;
        driver = d;
    }

    validateExtendedPageState(customTimeout = config.defaultTimeout) {
        return driver.wait(function() {
            return world.checkExtendedPageState()
                .then(function(value) {
                    if(value) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        );
    }

    getDocumentReadyState() {//internal only
        return driver.executeScript(
            'return document.readyState === \'complete\'',
            ''
        ).then((result) => result);
    }

    validatePageReadyState(customTimeout = config.defaultTimeout) {
        return driver.wait(function() {
            return world.getDocumentReadyState()
                .then(function(value) {
                    if(value) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).then(function() {
            return world.validateExtendedPageState(customTimeout);
        });
    }

    validateUrl(url, customTimeout = config.defaultTimeout) {
        return driver.wait(function() {
                return driver.getCurrentUrl().then(function(currentUrl) {
                    world.logMessage(`validateUrl currentUrl ${ currentUrl }, expectedUrl ${ url }`, true);
                    if(currentUrl.indexOf(url) !== -1) {
                        return true;
                    }

                    return world.sleep(config.pollingRate).then(function() {
                        return false;
                    });
                });
            },
            customTimeout
        );
    }

    validateUrlByRegex(regex, customTimeout = config.defaultTimeout) {
        return driver.wait(function() {
                return driver.getCurrentUrl().then(function(currentUrl) {
                    let r = new RegExp(regex);
                    if(r.test(currentUrl)) {
                        return true;
                    }

                    return world.sleep(config.pollingRate).then(() => false);
                });
            },
            customTimeout
        );
    }

    validateElementText(xpath, text, customTimeout = config.defaultTimeout) {
        return driver.wait(
            function () {
                return world.getElementText(xpath, customTimeout).then(function(currentText) {
                    return currentText === text;
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateElementText failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    validateCheckboxValue(xpath, value, customTimeout = config.defaultTimeout) {
        return driver.wait(
            function () {
                return world.getCheckboxValue(xpath, customTimeout)
                    .then((currentValue) => currentValue === value);
            },
            customTimeout
        ).catch(function(err){
            throw(`validateCheckboxValue failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    validateElementVisible(xpath, customTimeout = config.defaultTimeout) {//element visible in sources and may be displayed or not
        return driver.wait(
            function () {
                return world.findElements(xpath).then(function(elem) {
                    if(elem.length !== 0) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateElementVisible failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    validateElementNotVisible(xpath, customTimeout = config.defaultTimeout) {//not visible in sources and not displayed
        return world.validatePageReadyState().then(function() {
            return driver.wait(
                function () {
                    return driver.findElements(By.xpath(xpath)).then(function(elem) {
                        if(elem.length === 0) {
                            return true;
                        }

                        return world.sleep(config.pollingRate)
                            .then(() => false);
                    });
                },
                customTimeout
            ).catch(function(err){
                    throw(`validateElementNotVisible failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
            });
        });
    }

    validateElementDisplayed(xpath, customTimeout = config.defaultTimeout) {//visible in sources AND displayed
        return driver.wait(
            function () {
                return world.findElements(xpath, customTimeout).then(function(elem) {
                    if(elem[0].isDisplayed()) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateElementDisplayed failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    validateElementNotDisplayed(xpath, customTimeout = config.defaultTimeout) {//element visible in sources and not displayed
        return driver.wait(
            function () {
                return world.findElements(xpath, customTimeout).then(function(elem) {
                    if(!elem[0].isDisplayed()) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateElementNotDisplayed failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    validateElementsNumber(xpath, number, customTimeout = config.defaultTimeout) {
        if(number === 0) {
            return world.validatePageReadyState()
                .then(() => world.validateElementNotVisible(xpath, customTimeout));
        } else {
            return driver.wait(
                function () {
                    return world.findElements(xpath, customTimeout).then(function(elem) {
                        if(elem.length === number) {
                            return true;
                        }

                        return world.sleep(config.pollingRate)
                            .then(() => false);
                    });
                },
                customTimeout
            ).catch(function(err){
                throw(`validateElementsNumber failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
            });
        }
    }

    checkAngularPresence() {
        let script = 'return (window.angular !== undefined)';

        return driver.executeScript(script, '')
            .then((result) => result);
    }

    checkExtendedPageState() {
        if(!config.extendedPageReadyStateValidation) {
            return world.boolPromiseResult(true);
        }

        return world.checkAngularPresence().then(function(present) {
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
}
