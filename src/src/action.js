import * as world from './xsolve_wtf';
import {By} from 'selenium-webdriver';
import fs from 'fs';
import path from 'path';
const config = world.getConfig();
let driver;

export default class Action {
    constructor(d) {
        this.driver = d;
        driver = d;
    }

    getAngularInputValue(xpath, customTimeout = config.defaultTimeout) {
        return world.findElement(xpath, customTimeout).then(function() {
            var script = `return document.evaluate('${ xpath }', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.value`;

            return driver.executeScript(script, '')
                .then((result) => result);
        });
    }

    validateAngularInputValue(xpath, expectedValue, customTimeout = config.defaultTimeout) {
        return driver.wait(
            function () {
                return world.getAngularInputValue(xpath, customTimeout).then(function(currentValue) {
                    return currentValue === expectedValue;
                });
            },
            customTimeout
        ).catch(function(err){
            throw(`validateAngularInputValue failed on element: "${ xpath }". Error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    cleanBrowserState() {
        return driver.executeScript('return window.location.hostname.length > 0', '').then(function(result) {//data URLs
            if(result) {
                driver.executeScript('localStorage.clear()');
                driver.executeScript('sessionStorage.clear()');
                driver.executeScript('console.clear()');
            } else {
                world.logError('Can\'t clean localStorage and sessionStorage');
            }

            return driver.manage().deleteAllCookies();
        });
    }

    takeScreenshot(fileName, directory) {
        let screenshotFilePath = path.join(directory, `${ fileName }.png`);

        return driver.takeScreenshot().then(function(data){
            let base64Data = data.replace(/^data:image\/png;base64,/,"");

            return fs.writeFile(screenshotFilePath, base64Data, 'base64', function(err) {
                if(err) {
                    world.logError(`takeScreenshot eror: ${ err }`);
                }
            });
        });
    }

    selectFileInputValue(inputXP, fileName, customTimeout = config.defaultTimeout) {
        return world.findElement(inputXP, customTimeout)
            .then(function(el) {
                let filePath = global.tf.projectDir + `/data/test_files/${ fileName }`;
                world.logMessage(`Selecting ${ filePath } file.`);

                return el.sendKeys(filePath);
          });
    }

    sleep(sleepTime) {
        return new Promise((resolve) => setTimeout(resolve, sleepTime));
    }

    setCheckboxValue(xpath, value, customTimeout = config.defaultTimeout) {
        return world.getCheckboxValue(xpath, customTimeout).then(function(isChecked) {
            if(isChecked === value) {
                return true;
            }

            return world.click(xpath, customTimeout).then(() => true);
        });
    }

    getElementText(xpath, customTimeout = config.defaultTimeout) {
        return world.findElement(xpath, customTimeout)
            .then((el) => el.getText());
    }


    jsBasedClick(xpath) {
        //TODO2: timeout
        return world.findElement(xpath, 0)
            .then(function() {
                return driver.executeScript(
                    `document.evaluate('${ xpath }', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.click();`
                ).then(() => false);
            });
    }

    click(xpath, customTimeout) {
        return world.validatePageReadyState()
            .then(function() {
                return world.findElement(xpath, customTimeout)
                    .then(function(el) {
                        el.click().catch(function(err) {
                            world.logMessage(`Standard click failed with error message: "${ err.message }"`, true);
                            return world.jsBasedClick(xpath);
                        });
                    });
            });
    }

    hover(xpath, customTimeout) {
        return world.validatePageReadyState()
            .then(function() {
                return world.findElement(xpath, customTimeout)
                    .then((el) => driver.actions().mouseMove(el).perform());
            });
    }

    fillInInput(xpath, value, blur, customTimeout) {
        let element;

        return world.findElement(xpath, customTimeout)
            .then(function(el) {
                element = el;

                return element.clear();
            })
            .then(() => element.sendKeys(typeof blur !== 'undefined' && blur ? value  + '\t': value));
    }

    getCheckboxValue(xpath, customTimeout) {
        return world.findElement(xpath, customTimeout)
            .then((el) => el.isSelected());
    }

    findElement(xpath, customTimeout) {
        return world.waitForElement(xpath, customTimeout)
            .then(() => driver.findElement(By.xpath(xpath)));
    }

    findElements(xpath, customTimeout) {
        return world.waitForElement(xpath, customTimeout)
            .then(() => driver.findElements(By.xpath(xpath)));
    }

    getElementsNumber(xpath, customTimeout) {
        return driver.findElements(By.xpath(xpath), customTimeout)
            .then((el) => el.length);
    }


    waitForElement(xpath, customTimeout = config.defaultTimeout) {//internal only
        return driver.wait(
             () => driver.findElements(By.xpath(xpath)).then(function(el) {
                    if(el.length > 0) {
                        return true;
                    }

                    return world.sleep(config.pollingRate)
                        .then(() => false);
                }),
            customTimeout
        ).catch(function(err){
            throw(`waitForElement failed on element: "${ xpath }" - error message: "${ err.message }", error stack: "${ err.stack }`);
        });
    }

    getCurrentUrl() {
        return driver.getCurrentUrl();
    }

     getDocumentReadyState() {//internal only
        return driver.executeScript(
            'return document.readyState === \'complete\'',
            ''
        ).then((result) => result);
    }

    loadPage(page) {
        return driver.get(page);
    }
}
