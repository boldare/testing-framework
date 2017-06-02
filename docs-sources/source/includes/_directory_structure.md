# Directory structure
Directory structure.

```plaintext
|-- features
    |-- steps
        |-- example-context.js
    |-- example.feature
|-- pages
    |-- universal
    |-- ExamplePage.js
|-- support
    |-- config.js.dist
    |-- env.js
    |-- hooks.js
    |-- project-world.js.dist
    |-- world.js
|-- data
    |-- test_files
    |-- pageUrlData.js.dist
    |-- testData.js.dist
|-- logs
    |-- execution_logs
    |-- screenshot_reports
|-- docs
```

## features
Features directory contains all project files.

### .feature files
`features` directory contains .feature files that contains Gherkin scenarios.

### steps
`steps` directory contains Step definitions (Context methods) that connect Gherkin steps to the Page methods.

## pages
`pages` directory contains Page Object files. Additional `universal` directory is available for reusable components that exist on multipla pages.

## support
`support` is framework directory. All framework methods are implemented here (mainly `world.js`). This directory also contains `config.js.dist` file that is default framework config.

## data
`testData.js.dist` is file for JSONs containing test data. `pageUrlData.js.dist` is file for page routes definitions.
`test_files` directory is for test data files needed for test execution like images etc.

## logs
Directory where logs are written. `execution_logs` contains typical logs from test execution - screenshots on failures and .har files for all scenarios.

## documentation
Documentation.
