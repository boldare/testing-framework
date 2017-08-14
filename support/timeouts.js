let {defineSupportCode} = require('cucumber');
let config = require('./config.js');

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(config.defaultStepTimeout);
});
