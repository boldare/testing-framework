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
