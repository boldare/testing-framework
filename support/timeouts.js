const {defineSupportCode} = require('cucumber');
const config = require('./config.js');

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(config.defaultStepTimeout);
});
