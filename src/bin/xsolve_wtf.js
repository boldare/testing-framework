#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const clu = require('command-line-usage');
const fs = require('fs');
const path = require('path');
const Joi = require('joi');
const exec = require('child_process').exec;

const version = require('../package.json').version;
const cucumberPath = 'node_modules/cucumber/bin/cucumber.js'
const cucumberRequireDirectories = '--require node_modules/xsolve_wtf/dist/ --require features/'
const CHILD_MAX_BUFFER_SIZE = 10 * 1024 * 1024;

const help = [
    {
        header: 'XSolve Web Testing Framework (xsolve_wtf)',
        content: 'Help.'
    },
    {
        header: 'Options',
        optionList: [
            {
                name: 'help, -h',
                description: 'Displays this help.'
            },
            {
                name: 'tags, -t',
                typeLabel: '[underline]{"tags"}',
                description: 'Tags'
            },
            {
                name: 'cucumber, -c',
                typeLabel: '[underline]{"parameters"}',
                description: 'Cucumber parameters. If you need to use double quotes (") inside you have to escape them using backslash.'
            },
            {
                name: 'version, -v',
                desctiption: 'Shows framework version.'
            }
        ]
    }
]

const configSchema = Joi.object().keys({
    baseUrl: Joi.string().required(),
    seleniumServerHost: Joi.string().required(),
    seleniumServerPort: Joi.number().integer().required(),
    proxyHost: Joi.string().required(),
    proxyPort: Joi.number().integer().required(),
    proxyHttpPort: Joi.number().integer().required(),
    platform: Joi.string().required(),
    runMaximized: Joi.boolean().required(),
    xvfbMode: Joi.boolean().required(),
    xvfbSettings: Joi.object().required(),
    defaultTimeout: Joi.number().integer().required(),
    defaultStepTimeout: Joi.number().integer().required(),
    seleniumDriverLogLevel: Joi.string().required(),
    seleniumBrowserLogLevel: Joi.string().required(),
    proxyCaptureHeaders: Joi.boolean().required(),
    proxyCaptureContent: Joi.boolean().required(),
    detailedTestLog: Joi.boolean().required(),
    enableScreenshotReports: Joi.boolean().required(),
    truncateLogsFileName: Joi.boolean().required(),
    extendedPageReadyStateValidation: Joi.boolean().required(),
    pollingRate: Joi.number().integer().required(),
    user: Joi.object().optional(),
    custom: Joi.object().optional()
});

const clu_help = clu(help);

const cliOptionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'tags', alias: 't', type: String, multiple: true },
    { name: 'cucumber', alias: 'c', type: String, multiple: true },
    { name: 'version', alias: 'v', type: Boolean }
]
const cliOptions = commandLineArgs(cliOptionDefinitions);

if(cliOptions.help) {
    console.log(clu_help);
    process.exit(0);
}

if(cliOptions.version) {
    console.log(`xsolve_wtf: "${ version }"\n`);
    process.exit(0);
}

    console.log(`XSolve Web Testing Framework (xs_wtf), version ${ version }\n`);
    validateConfig();

    let cucumberTags = cliOptions.tags ? `--tags "${ cliOptions.tags }"` : '';
    var cucumberOptions = cliOptions.cucumber ? cliOptions.cucumber : 'features/';
    var execValue = `${ cucumberPath } ${ cucumberTags } ${ cucumberOptions } ${ cucumberRequireDirectories }`;

    console.log(`Running Cucumber, command: "${ execValue }"`);

    var child = exec(execValue, { maxBuffer: CHILD_MAX_BUFFER_SIZE });
    child.stdout.on('data', function(data) {
        console.log(data);
    });
    child.stderr.on('data', function(data) {
        console.log('ERROR: ' + data);
    });
    child.on('close', function(code) {
        console.log(`Cucumber finished with exit code "${ code }"`);
        process.exit(code);
    });


function validateConfig() {
    const configPath = path.join(__dirname, '../../..') + '/config.json';//TODO: temporary

    if(!fs.existsSync(configPath)) {
        console.log('Config validation failed - missing config.json file. \n')
        process.exit(1);
    }

    var config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

    Joi.validate(config, configSchema).catch((error) => {
        console.log('Config validation failed. \n')
        console.log(error.details);
        process.exit(1);
    });
}
