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
`node_modules/cucumber/bin/cucumber.js`

You can pass "normal" cucumber parameters - specify .feature files, select tags etc.

### Tags
Make sure to use Cucumber Tag Expressions, not old-style Cucumber tags - there are not available in Cucumber 2.X anymore.
https://docs.cucumber.io/tag-expressions/
