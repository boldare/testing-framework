# About

**XSolve Web Testing Framework** is test framework above Selenium Webdriver and Cucumber written in JS (Node).
NPM: https://www.npmjs.com/package/xsolve_wtf

Main goals:

  - Easy to use, high-level methods
  - All needed waits built-in
  - BDD Layer (Gherkin)
  - Reports useful from both business and developers point of view (Gherkin scenarios, Screenshots, Driver logs, Proxy logs)
  - Headless execution support
  - Parallel execution (not in first release)
  - Multiple driver configs and devices support (not in first release)

# Table of Contents

  - [About](#about)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Project Setup](#project-setup)
  - [Installation](#installation)
  - [Running](#running)
  - [Runner](#runner)
  - [Required changes](#required-changes)
  - [Methods](#methods)
  - [Config](#config)
  - [TODO](#todo)

# Requirements

  - Linux (currently, support for other systems may be added later)
  - Node.js (v6.X or newer)
  - NPM 3.X or later (older versions can't be used because of different `node_modules` directory structure)
  - Selenium Server (recommended 3.X)
  - BrowserMob Proxy (v2.1.X or newer)

Optional:

  - Xvfb (for headless execution)

# Project setup

There are currently few requirements according to the directory and files structure.

## config.json

`config.json` file must be created in the main project directory. Example `config.json` file can be found in Config section of this doc.

## cucumber runner - config (optional)

If you want to run tests without using `xsolve_wtf.js` runner using `cucumber.js` command `cucumber.js` require parameters must be passed to cucumber:

```javascript
--require node_modules/xsolve_wtf/dist/ --require features/
```

It is also possible to create `cucumber.js` file in main project directory - adding parameters directly won't be needed then.

```javascript
module.exports = {
  "default" : "--require node_modules/xsolve_wtf/dist/ --require features/"
};
```

# Installation
Described for Ubuntu 16.04 LTS.

## Node.js and NPM
Install Node.js and NPM from NodeSource.
`curl -sL https://deb.nodesource.com/setup_6.x -o nodesource_setup.sh && sudo bash nodesource_setup.sh &&
sudo apt-get install build-essential nodejs`

## Java
Oracle Java may be needed because of the BrowserMob Proxy (OpenJDK may not work correctly).
You can install it and set as default version using:
`sudo apt-get install python-software-properties && sudo add-apt-repository ppa:webupd8team/java && sudo apt-get update && sudo apt-get install oracle-java8-installer`.

Verify Java version using `java -version` and change if needed using `sudo update-alternatives --config java`

## Selenium Server
Download Selenium Server Standalone using wget (here version 3.4.0):
`wget https://selenium-release.storage.googleapis.com/3.4/selenium-server-standalone-3.4.0.jar`

or manually from Selenium website: `http://docs.seleniumhq.org/download/`

## Selenium Drivers
Download Driver you want to use (Chromedriver recommended, other driver weren't tested yet).

### Chromedriver
Download latest version from `https://sites.google.com/a/chromium.org/chromedriver/`.
You can use wget for this:
`wget http://chromedriver.storage.googleapis.com/2.30/chromedriver_linux64.zip` (here version 2.30, x86-64)

Unzip (if needed install Unzip using `sudo apt-get install unzip`):
`unzip chromedriver_linux64.zip`

Copy chromedriver binary to `/user/bin` or `/usr/local/bin`:
`sudo cp chromedriver /usr/bin`

Check if Chromedriver is visible: `chromedriver --version`.

Not only Chromedriver is needed - Chrome browser also has to be installed. Verify chrome installation with `google-chrome --version`.

## BrowserMob Proxy
Download BrowserMob Proxy using: `wget https://github.com/lightbody/browsermob-proxy/releases/download/browsermob-proxy-2.1.4/browsermob-proxy-2.1.4-bin.zip`
or manually from project page: `http://bmp.lightbody.net/`.

Unzip: `unzip browsermob-proxy-2.1.4-bin.zip`

## Xvfb (optional)
If you want to run tests on headless server you would also need Xvfb.
`sudo apt-get install xvfb xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps imagemagick`

## XSolve Web Testing Framework
Assuming you have `xsolve_wtf` dependancy in your `package.json` file just run `npm install` - framework and all needed dependencies will be installed (cucumber etc.).


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
`/usr/bin/Xvfb :99 -ac -screen 0 1920x1080x24 &` (here display number 99 with resolution 1920x1080)
Then you have to set display you want to use (99 in this case):
`export DISPLAY=:99`

If you want to return to "normal" display you have to set value to `:0`:
`export DISPLAY=:0` and rerun Selenium Webdriver if needed.

## Start BrowserMob Proxy
BrowserMob Proxy also must be running during test execution. You can run proxy by running:
`bin/browsermob-proxy -port 8888` from inside BrowserMob Proxy directory.

## Run tests
Tests can be run using:
`node_modules/xsolve_wtf/bin/xsolve_wtf.js`

More detailed information about Runner is available in [Runner](#runner) section.

# Runner
Runner is now available (0.4.X and newer versions) - it should be used instead of directly using cucumber runner.

## Cucumber parameters
You can pass "normal" cucumber parameters - specify .feature files etc. using `--cucumber` or `-c` parameter.

`node_modules/xsolve_wtf/bin/xsolve_wtf.js -c "feature/example.feature"`

If you want to use quotes (`"`) inside you have to escape them.
It's possible to insert `--tags` cucumber parameter here too but it's better to use [Tags](#tags) - it's not needed to escape all quotes then.

## Tags
Tags can be used using `--tags` or `-t` parameter.

`node_modules/xsolve_wtf/bin/xsolve_wtf.js --tags @disabled`
`node_modules/xsolve_wtf/bin/xsolve_wtf.js --tags "@test and not @disabled"`

Make sure to use Cucumber Tag Expressions, not old-style Cucumber tags - there are not available anymore since Cucumber 2.X.
https://docs.cucumber.io/tag-expressions/

## Runner - help
Help can be displayed using `--help` or `-h` parameter.

`node_modules/xsolve_wtf/bin/xsolve_wtf.js --help`

## Runner - framework version
Framework version can be displayed using `--version` or `-v` parameter.

`node_modules/xsolve_wtf/bin/xsolve_wtf.js --version`


## Cucumber runner
It's still (0.4.X version) possible to run tests using directly cucumber runner but it's not recommended.
`node_modules/cucumber/bin/cucumber.js`

# Required changes

## 0.4.X version
Config file structure is the same as in 0.3.X version but config file is now validated. You have to make sure it's correct according to the rules. All required parameters must be available and also all custom values must be placed in `user` or `custom`.

## 0.3.X version

Config file was changed in comparison to 0.2.x version - `config.json` must be used now instead of `config.js`. Example config can be found in Config section.

Deprecated loadPageByRoute and validateUrlByRoute methods were removed - pageUrlDate file isn't required anymore. It should be used on user side now - methods can be just copied from xsolve_wtf.js file.

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

Configuration options. `config.json` file must be created in main project directory. Framework settings are required. Also custom project-related settings may be added (`user` or `custom`) - more details in [Project specific settings](#project-specific-settings).

Example config:

```javascript
{
	"baseUrl": "http://localhost:82/",
	"seleniumServerHost": "localhost",
	"seleniumServerPort": 4444,
	"proxyHost": "localhost",
	"proxyPort": 8888,
	"proxyHttpPort": 8082,
	"platform": "CHROME",
	"runMaximized": true,
	"xvfbMode": false,
	"xvfbSettings": {
		"windowWidth": 1920,
		"windowHeight": 1080
	},
	"defaultTimeout": 30000,
	"defaultStepTimeout": 45000,
	"seleniumDriverLogLevel": "SEVERE",
	"seleniumBrowserLogLevel": "ALL",
	"proxyCaptureHeaders": true,
	"proxyCaptureContent": false,
	"detailedTestLog": false,
  	"enableScreenshotReports": false,
  	"truncateLogsFileName": false,
	"extendedPageReadyStateValidation": true,
	"pollingRate": 100
}
```

## Project related

### baseUrl

Url of main page. Value not required - depends on Pages implementation.

## Selenium

### seleniumServerHost

Host of Selenium Server. Remote server may be used.

### seleniumServerPort

Port of Selenium Server.

## Proxy

### proxyHost

Host of BrowserMob Proxy.

### proxyPort

Port of BrowserMob Proxy.

### proxyHttpPort

Proxy HTTP port.

## Browser

### platform

Browser/Driver the tests would be run on.
Chrome browser is recommended. Other browsers weren't tested.

Possible values:

- CHROME
- FIREFOX
- IE
- EDGE
- OPERA
- SAFARI
- PHANTOMJS
- HTMLUNITWITHJS
- ANDROID
- IPHONE
- IPAD

### runMaximized

Set if browser should be maximized. In case of Chrome running inside Xvfb display `xvfbMode` may be required to correctly maximize.

### xvfbMode

Sets static Browser window dimensions based on xvfbSettings values.

### xvfbSettings

Defines Xvfb Browser window dimensions.

`windowWidth` - width of browser window (px)
`windowHeight` - height of browser window (px)

## Timeouts

### defaultTimeout

Default timeout of specific action (for example click, validateElementVisible etc.) in ms.

### defaultStepTimeout

Default timeout of Cucumber step in ms.

## Logs

### seleniumDriverLogLevel

Sets log level for Selenium Driver.

Possible values:

- `OFF`
- `SEVERE`
- `WARNING`
- `INFO`
- `DEBUG`
- `ALL`

### seleniumBrowserLogLevel

Sets log level for Browser.

Possible values:

- `OFF`
- `SEVERE`
- `WARNING`
- `INFO`
- `DEBUG`
- `ALL`

### proxyCaptureHeaders
Controlls if request headers are logged by proxy.

### proxyCaptureContent
Controlls if request content (body) is logged by proxy.

### detailedTestLog

If enabled detailed logs are displayed. May be used for debugging.

### enableScreenshotReports

Allows to enable/disable Screenshot reports functionality. If set to `true` screenshots will be made for every action. May be useful for for example for test reports.

## Other

### extendedPageReadyStateValidation

By default actions are made after DOM is loaded (document.readystate == 'complete'). This option allows to enable additional validation for Angular apps - checking if requests are finished.

### pollingRate

Polling rate isn't supported by Selenium JS bindings - on our test environment about 60-80 requests per second to Selenium Server were made. It isn't speeding up tests execution and it's causing additional CPU usage. This option allows to limit it to some reasonable value.

## Project specific settings
```javascript
"user": {
	"test1": true,
	"test2": "aaa"
},
"custom": {
	"test3": false,
	"test4": "bbb"
}
```

Project-specific settings can also be added to config.json file. `user` or `custom` keywords may be used and may contain any needed values.

# TODO
Planned features:

  - Examples
  - Require wrapper
  - Runner
  - Proxy disable/enable config
  - Framework specific methods (for example for Angular)
  - Multiple devices support, Profiles
  - Parallel execution
  - Actions support
