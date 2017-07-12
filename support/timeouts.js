var {defineSupportCode} = require('cucumber');
var config = require('./config.js');

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(config.defaultStepTimeout);
});
