# Directory structure
Directory structure based on Cucumber-js suggestions.

```plaintext
|-- features
    |-- page_objects
        |-- universal
        |-- ExamplePage.js
    |-- step_definitions
        |-- example-context.js
    |-- support
        |-- config.js.dist
        |-- env.js
        |-- hooks.js
        |-- project-world.js.dist
        |-- world.js
    |-- example.feature
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

### step_definitions
`step_definitions` directory contains Step definitions (Context methods) that connect Gherkin steps to the Page methods.

### page_objects
`page_objects` directory contains Page Object files. Additional `universal` directory is available for reusable components that exist on multipla pages.

### support
`support` is framework directory. All framework methods are implemented here (mainly `world.js`). This directory also contains `config.js.dist` file that is default framework config.

## data
`testData.js.dist` is file for JSONs containing test data. `pageUrlData.js.dist` is file for page routes definitions.
`test_files` directory is for test data files needed for test execution like images etc.

## logs
Directory where logs are written. `execution_logs` contains typical logs from test execution - screenshots on failures and .har files for all scenarios.

## documentation
Documentation.
