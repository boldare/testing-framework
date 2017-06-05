# Methods

## World

World will contain all basic methods needed for development of functional tests of websites. Driver would be available too so it would be possible to use all low-level Webdriver methods. All methods that need if contain build-in waits (timeouts configurable in config file), custom timeout can be set too.

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

#### loadPageByRoute(routeName, customTimeout)
Loads page by route from pageUrlData file.

`routeName` route name from pageUrlData that would be opened (only basic - can't be regex).
`customTimeout` (optional) - would be used instead of default config timeout.

#### loadPage(url, customTimeout)
Loads page by URL.

`url` page URL
`customTimeout` (optional) - would be used instead of default config timeout.

#### fillInInput(xpath, value, blur, customTimeout)
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

#### selectImage(imageInputXP, imageName, customTimeout)

### Validators

#### isDisplayed(xpath, customTimeout)
Checks if element is displayed (displayed, not only visible in page source).

#### isNotDisplayed(xpath, customTimeout)
Checks if element is not displayed (not displayed, may be visible in page source).

#### isElementVisible(xpath, customTimeout)
Checks if element is visible in page source. May not be displayed.

#### isElementNotVisible(xpath, customTimeout)
Checks if element is not visible in page source.

#### validateDynamicElementText(xpath, expectedText, timeout)

#### validatePageReadyState()
Validates if the page load is complete. `extendedPageReadyStateValidation` may be enabled in config file for extended validation.

#### validateUrlByRoute(pageName, customTimeout)
Validates page route based on page route defined in `pageRoute.js` file. If regex is available it would be used, if not simplified validation would be used (by url part).
`pageName` page route name

#### validateUrl(url, customTimeout)
Validates url by url text.
`url` url string
`customTimeout` (optional) - would be used instead of default config timeout.

### Other

#### getCurrentTime()
Returns current date and time.

#### getDriver()
Returns current driver. May be used for direct driver access when low-level driver methods are needed.

#### getInstanceNumber()
Returns number of instance in case of parallel execution.

#### log(logMessage, logLevel)
Logger

//TODO: description

#### sleep(sleepTime)
Static sleep.

`sleepTime` sleep time (ms)

### Angular-specific
Angular specific methods.

#### getAngularInputValue(xpath, customTimeout)
Returns angular input value.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateDynamicAngularInputValue(xpath, expectedValue, customTimeout)
Validates if angular input value is correct.

`xpath` string with element xpath

`expectedValue` expected input value

`customTimeout` (optional) - would be used instead of default config timeout.
