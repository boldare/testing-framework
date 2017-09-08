const {defineSupportCode} = require('cucumber');
const config = require(`${ global.tf.projectDir }/config.js`);

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(config.defaultStepTimeout);
});
