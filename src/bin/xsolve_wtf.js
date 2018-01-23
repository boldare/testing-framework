#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const clu = require('command-line-usage')

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

const clu_help = clu(help);

const cliOptionDefinitions = [
    { name: 'help', alias: 'h', type: Boolean },
    { name: 'cucumber', alias: 'c', type: String, multiple: true, defaultOption: true }
]
const cliOptions = commandLineArgs(cliOptionDefinitions)

if(cliOptions.help) {
    console.log(clu_help);
} else {
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
