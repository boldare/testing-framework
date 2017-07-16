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