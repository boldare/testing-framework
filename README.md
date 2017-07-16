# About
Testing framework above Selenium Webdriver and Cucumber written in JS (Node).

Main goals:

  - Easy to use, high-level methods
  - All needed waits build-in
  - BDD Layer (Gherkin)
  - Reports useful from both business and developers point of view (Gherkin scenarios, Screenshots, Driver logs, Proxy logs)
  - Headless execution
  - Parallel execution (not in first release)
  - Multiple driver configs and devices support (not in first release)

# Requirements

  - Node.js (v6.X or newer)
  - NPM
  - Selenium Server (recommended 3.X)
  - Cucumber-js (v2.X, from NPM)
  - BrowserMob Proxy (v2.1.X or newer)

Optional:

  - Xvfb (for headless execution)

# Installation

Described for Ubuntu 16.04 LTS.

## Node.js and NPM
Install Node.js and NPM from NodeSource.
`curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh &&
sudo apt-get install build-essential nodejs`

## Java
Oracle Java may be needed here.
You can install it and set as default version using:
`sudo apt-get install python-software-properties && sudo add-apt-repository ppa:webupd8team/java && sudo apt-get update && sudo apt-get install oracle-java8-installer`.

Verify Java version using `java -version` and change if needed using `sudo update-alternatives --config java`

## Selenium Server
Download Selenium Server Standalone using wget (here version 3.4.0):
`wget https://selenium-release.storage.googleapis.com/3.4/selenium-server-standalone-3.4.0.jar`

or manually from Selenium website: `http://docs.seleniumhq.org/download/`

## Selenium Drivers
Download Driver you want to use (Chromedriver recomended).

### Chromedriver
Download latest version from `https://sites.google.com/a/chromium.org/chromedriver/`.
You can use wget for this:
`wget http://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip` (here version 2.30, x86-64)

Unzip (if needed install Unzip using `sudo apt-get install unzip`):
`unzip chromedriver_linux64.zip`

Copy chromedriver binary to `/user/bin` or `/usr/local/bin`:
`sudo cp chromedriver /usr/bin`

Check if Chromedriver is visible: `chromedriver --version`.

## BrowserMob Proxy
Download BrowserMob Proxy using: `wget https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.4/browsermob-proxy-2.1.4-bin.zip`
or manually from project page: `http://bmp.lightbody.net/`.

Unzip: `unzip browsermob-proxy-2.1.4-bin.zip`

## Other dependancies
On project dir run `npm install`. All needed dependancies like Cucumber-js or Superagent would be installed. You can check full dependancies list in `package.json` file.

## Xvfb (optional)
If you want to run tests on headless server you would also need Xvfb.
`sudo apt-get install xvfb xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps imagemagick`

# Running

## Start Selenium Server
Selenium Server must be running during test execution:
If you want to run Selenium Server on default port (4444):
`java -jar selenium-server-standalone-3.*.jar`

You can also set custom port running with `-port` parameter:
`java -jar selenium-server-standalone-3.*.jar -port 4444`

### Xvfb
If you want to run headlessly you must create virtual display and set it as default BEFORE running Selenium Server.
You can create display using:
`/usr/bin/Xvfb :99 -ac -screen 0 1920x1080x24` (here display number 99 with resolution 1920x1080)
Then you have to set display you want to use (99 in this case):
`export DISPLAY=:99`

If you want to return to "normal" display you have to set value to :0:
`export DISPLAY=:0` and rerun Selenium Webdriver if needed.

### Start BrowserMob Proxy
BrowserMob Proxy also must be running during test execution. You can run proxy by running:
`bin/browsermob-proxy -port 8888` from inside BrowserMob Proxy directory.

### Copy .dist files
Copy all .js.dist files (`/support/config.js.dist`, `/data/testData.js.dist` and `/data/pageUrlData.js.dist`) to .js files on project directory.
For example `config.js.dist` file should be copied to `config.js` etc.

## Run tests
Tests can be run using:
`node_modules/cucumber/bin/cucumber.js --require support/ --require features/`

You can pass "normal" cucumber parameters - specify .feature files, select tags etc.
Currently `--require` parameters are needed, custom runner is planned.


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
`pages` directory contains Page Object files. Additional `universal` directory is available for reusable components that exist on multiple pages.

## support
`support` is framework directory. All framework methods are implemented here (mainly `world.js`). This directory also contains `config.js.dist` file that is default framework config.

## data
`testData.js.dist` is file for JSONs containing test data. `pageUrlData.js.dist` is file for page routes definitions.
`test_files` directory is for test data files needed for test execution like images etc.

## logs
Directory where logs are written. `execution_logs` contains typical logs from test execution - screenshots on failures and .har files for all scenarios. `screentshot_reports` directory contains Screenshot reports.

## docs
Documentation.


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

#### loadPageByRoute(routeName, customTimeout) (NOT YET IMPLEMENTED)
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

#### getElementsNumber(xpath, customTimeout)
Returns number of elements.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### getCheckboxValue(xpath, customTimeout)
Returns checkbox value.

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateCheckboxValue(xpath, value, customTimeout)
Validates if checkbox is set to expected value.

`xpath` string with element xpath

`value` expected value

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementDisplayed(xpath, customTimeout)
Validates if element is displayed (not only visible in page source - visible in sources AND displayed).

`xpath` string with element xpath

`customTimeout` (optional) - would be used instead of default config timeout.

#### validateElementNotDisplayed(xpath, customTimeout)
Validates if element is not displayed (visible in sources and not displayed).

`xpath` string with element xpath

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
Validates if the page load is complete. `extendedPageReadyStateValidation` may be enabled in config file for extended validation (not implemented yet).

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


# Config

```javascript
//project settings
baseUrl: 'http://localhost:82/',

//Selenium settings
seleniumServerHost: 'localhost',
seleniumServerPort: 4444,

//proxy settings:
proxyHost: 'localhost',
proxyPort: 8888,
proxyHttpPort: 8082,

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
defaultStepTimeout: 45000,//ms

//logs:
seleniumDriverLogLevel: 'SEVERE',
seleniumBrowserLogLevel: 'ALL',
proxyCaptureHeaders: true,
proxyCaptureContent: false,
detailedTestLog: true,
enableScreenshotReports: false,

//other:
extendedPageReadyStateValidation: true,//NOT YET IMPLEMENTED

//project specific settings:
```


# TODO
Planned features:

  - Polling rate
  - Require wrapper
  - Runner
  - Proxy disable/enable config
  - Framework specific methods (for example for Angular)
  - Multiple devices support, Profiles
  - Parallel execution
  - Actions support
