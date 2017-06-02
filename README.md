# About
Design of JS testing framework above Selenium Webdriver.

Main goals:

  - Easy to use, high-level methods
  - All needed waits build-in
  - BDD Layer (Gherkin)
  - Reports useful from both business and developers point of view (Gherkin scenarios, Screenshots, Driver logs, Proxy logs)
  - Headless execution
  - Parallel execution (in the future)
  - Multiple driver configs and devices support (in the future)

# Requirements
Not yet specified.

For the JS version probably something like:

  - Node
  - NPM
  - Selenium Webdriver
  - Cucumber-js
  - BrowserMob Proxy
  - GNU Make (for parallel execution)
  - Xvfb (for headless execution)
  - Superagent (for requests)


# Directory structure
Directory structure.

```plaintext
|-- features
    |-- steps
        |-- example-context.js
    |-- example.feature
|-- pages
    |-- universal
    |-- ExamplePage.js
|-- support
    |-- config.js.dist
    |-- env.js
    |-- hooks.js
    |-- project-world.js.dist
    |-- world.js
|-- data
    |-- test_files
    |-- pageUrlData.js.dist
    |-- testData.js.dist
|-- logs
    |-- execution_logs
    |-- screenshot_reports
|-- docs
```

## features
Features directory contains all project files.

### .feature files
`features` directory contains .feature files that contains Gherkin scenarios.

### steps
`steps` directory contains Step definitions (Context methods) that connect Gherkin steps to the Page methods.

## pages
`pages` directory contains Page Object files. Additional `universal` directory is available for reusable components that exist on multipla pages.

## support
`support` is framework directory. All framework methods are implemented here (mainly `world.js`). This directory also contains `config.js.dist` file that is default framework config.

## data
`testData.js.dist` is file for JSONs containing test data. `pageUrlData.js.dist` is file for page routes definitions.
`test_files` directory is for test data files needed for test execution like images etc.

## logs
Directory where logs are written. `execution_logs` contains typical logs from test execution - screenshots on failures and .har files for all scenarios.

## docs
Documentation.

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


# Config

```javascript
//project settings
baseDirectory: '/home/user/project/tests/',
baseUrl: 'http://localhost:82/',

//Selenium settings
seleniumServerHost: 'localhost',
seleniumServerPort: 4444,

//proxy settings:
proxyHost: 'localhost',
proxyPort: 8888,
proxyHttpPort: 8082,
disableProxy: false,

//Browser settings:
platform: process.env.PLATFORM || 'CHROME',
runMaximized: true,
xvfbMode: false,
XvfbSettings: {
	windowWidth: 1920,
	windowHeight: 1080
},

//timeouts
defaultTimeout: 30000,//ms
defaultAfterTimeout: 45000,//ms

//logs:
seleniumDriverLogLevel: 'SEVERE',
seleniumBrowserLogLevel: 'ALL',
proxyCaptureHeaders: true,
proxyCaptureContent: false,
detailedTestLog: true,
testDebugLog: false,
enableScreenshotReports: false,

//other:
extendedPageReadyStateValidation: true,

//project specific settings:
```
