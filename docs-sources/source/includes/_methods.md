# Methods

## World

World contains all basic methods needed for development of functional tests of websites. Driver is available too so it is possible to use all low-level Webdriver methods. All methods that need if contain build-in waits (timeouts configurable in config file), custom timeout can be set too.

### Actions

#### click(xpath, customTimeout)
Clicks element identified by xpath.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### getCurrentUrl()
Returns current Url

#### hover(xpath, customTimeout)
Hovers mouse cursor over element.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### loadPage(url, customTimeout)
Loads page by URL.

`url` page URL
`customTimeout` (optional) - would be used instead of default config timeout.

#### loadPageByRoute(routeName, customTimeout)
Loads page by route from pageUrlData file.

`routeName` route name from pageUrlData that would be opened (only basic - can't be regex).

`customTimeout` (optional) - would be used instead of default config timeout.

#### fillInInput(xpath, value, blur, customTimeout)
Fills in input with value.

`xpath` string with element xpath

`value` string with text value

`blur` (optional) - blur support

`customTimeout` (optional) - would be used instead of default config timeout.

#### findElement(xpath, customTimeout)
Just like Webdriver findElement with wait.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### findElements(xpath, customTimeout)
Just like Webdriver findElements with wait.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### selectFileInputValue(inputXP, fileName, customTimeout)
Sets file input value.

`inputXP` string with file input element xpath.

`fileName` fileName that would be set

`customTimeout` (optional) - would be used instead of default config timeout.

#### setCheckboxValue(xpath, value, customTimeout)
Sets checkbox value.

`xpath` string with element xpath

`value` checkbox value

`customTimeout` (optional) - would be used instead of default config timeout.

### Validators

#### getCheckboxValue(xpath, customTimeout)
Returns checkbox value.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### getElementsNumber(xpath, customTimeout)
Returns number of elements.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### getElementText(xpath, customTimeout)
Returns element text.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateCheckboxValue(xpath, value, customTimeout)
Validates if checkbox is set to expected value.

`xpath` string with element xpath

`value` expected value

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementDisplayed(xpath, customTimeout)
Validates if element is displayed (not only visible in page source - visible in sources AND displayed).
May be browser-specific because of the driver differences.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementNotDisplayed(xpath, customTimeout)
Validates if element is not displayed (visible in sources and not displayed).
May be browser-specific because of the driver differences.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementText(xpath, text, customTimeout)
Validates if text of element is equal to expected.

`xpath` string with element xpath

`text` expected text

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementVisible(xpath, customTimeout)
Checks if element is visible in page source. May not be displayed.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementNotVisible(xpath, customTimeout)
Checks if element is not visible in page source.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementsNumber(xpath, number, customTimeout)
Validates if number of elements is correct.

`xpath` string with element xpath

`number` expected number of elements

`customTimeout` (optional) - would be used instead of default config timeout.

#### validatePageReadyState()
Validates if the page load is complete. `extendedPageReadyStateValidation` may be enabled in config file for extended validation (currently only Angular support implemented).

#### validateUrlByRoute(pageName, customTimeout)
Validates page route based on page route defined in `pageRoute.js` file. If regex is available it would be used, if not simplified validation would be used (by URL part).
`pageName` page route name

#### validateUrl(url, customTimeout)
Validates url by url text.

`url` url string
`customTimeout` (optional) - would be used instead of default config timeout.

#### validateUrlByRegex(regex, customTimeout)
Validates url by regex.

`regex` regex
`customTimeout` (optional) - would be used instead of default config timeout.

### Other
#### getDriver()
Returns current driver. May be used for direct driver access when low-level driver methods are needed.

#### getInstanceNumber() (NOT YET IMPLEMENTED)
Returns number of instance in case of parallel execution.

#### logError(errorMessage, noThrow)
Error logger.
`errorMessage` message
`noThrow` (optional) - can be set if error message should only be displayed and not thrown.

#### logMessage(logMessage, detailedOnlyLog)
Message logger - writes custom messages for steps.
`logMessage` message
`detailedOnlyLog` (optional) - can be set if message should be only shown if config `detailedTestLog` is enabled.

#### sleep(sleepTime)
Static sleep.

`sleepTime` sleep time (ms)

#### cleanBrowserState
Cleans browser state - Cookies, localStorage, sessionStorage and console logs.

#### takeScreenshot(fileName, directory)
Takes screenshot.

`fileName` screenshot file name (without extension - would be saved as .png).

`directory` directory where screenshot would be saved.

#### getCurrentDate()
Returns current date in `YYYY-MM-DD_HH-MM-SS-mmm` format (for example `2017-06-26_13-53-51-122`)

### Angular-specific (NOT YET IMPLEMENTED)
Angular specific methods.

#### getAngularInputValue(xpath, customTimeout) (NOT YET IMPLEMENTED)
Returns angular input value.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateDynamicAngularInputValue(xpath, expectedValue, customTimeout) (NOT YET IMPLEMENTED)
Validates if angular input value is correct.

`xpath` string with element xpath

`expectedValue` expected input value

`customTimeout` (optional) - would be used instead of default config timeout.
