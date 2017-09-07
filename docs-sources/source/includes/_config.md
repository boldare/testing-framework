# Config

Configuration options. `config.js` file must be created in main project directory.

Example config:

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
detailedTestLog: false,
enableScreenshotReports: false,

//other:
extendedPageReadyStateValidation: true,
pollingRate: 100,//ms

//project specific settings:
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

Custom project config options.
