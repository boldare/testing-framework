#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const clu = require('command-line-usage');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');

const help = [
    {
        header: 'XSolve WTF',
        content: 'Help.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'help, -h',
                description: 'This help'
            },
            {
                name: 'cucumber, -c',
                typeLabel: '"[underline]{parameters}"',
                description: 'Cucumber parameters. You can use double (") or single (\') quotes.'
            }
        ]
    }
]

const configSchema = Joi.object().keys({
    baseUrl: Joi.string().required(),
    seleniumServerHost: Joi.string().required(),
    seleniumServerPort: Joi.number().intiger().required(),
    proxyHost: Joi.string().required(),
    proxyPort: Joi.number().intiger().required(),
    proxyHttpPort: Joi.number().intiger().required(),
    platform: Joi.string().required(),
    runMaximized: Joi.boolean().required(),
    xvfbMode: Joi.boolean().required(),
    xvfbSettings: Joi.object().required(),
    defaultTimeout: Joi.number().intiger().required(),
    defaultStepTimeout: Joi.number().intiger().required(),
    seleniumDriverLogLevel: Joi.string().required(),
    seleniumBrowserLogLevel: Joi.string().required(),
    proxyCaptureHeaders: Joi.boolean().required(),
    proxyCaptureContent: Joi.boolean().required(),
    detailedTestLog: Joi.boolean().required(),
    enableScreenshotReports: Joi.boolean().required(),
    extendedPageReadyStateValidation: Joi.boolean().required(),
    pollingRate: Joi.number().intiger().required(),
    user: Joi.object().optional(),
    custom: Joi.object().optional()
});

const clu_help = clu(help);

const cliOptionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'cucumber', alias: 'c', type: String, multiple: true, defaultOption: true }
]
const cliOptions = commandLineArgs(cliOptionDefinitions)

if(cliOptions.help) {
    console.log(clu_help);
} else {
        validateConfig();

        console.log('Running Cucumber process \n');
        var cucumberOptions = cliOptions.cucumber ? cliOptions.cucumber : `features/`;

        var exec = require('child_process').exec;
        var child = exec(`node_modules/cucumber/bin/cucumber.js ${ cucumberOptions }`);
        child.stdout.on('data', function(data) {
            console.log(data);
        });
        child.stderr.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.on('close', function(code) {
            console.log('closing code: ' + code);
        });
}

function validateConfig() {
    var config = JSON.parse(fs.readFileSync(path.join(__dirname, '../../..') + '/config.json', 'utf8'));//TODO: temporary

    Joi.validate(config, configSchema).catch((error) => {
        console.log('Config validation failed. \n')
        console.log(error.details);
        process.exit(1);
    });
}