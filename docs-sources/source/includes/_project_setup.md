# Project setup

There are currently few requirements according to the directory and files structure.

## config.js

`config.js` file must be available in the main project directory. Example `config.js` file can be found in Config section of this doc.

## cucumber.js config

`cucumber.js` config file is needed if you want to run tests with just `cucumber.js`
```javascript
module.exports = {
    "default" : "--require node_modules/xsolve_wtf/dist/ --require features/"
};
```

## data/pageUrlData.js

`data/pageUrlData.js` file is (currently) required by `validateUrlByRoute` and `loadPageByRoute` methods. Probably won't be neeeded in next major version because these methods are marked as deprecated now.

```javascript
module.exports = {
    regex: {
    },
    basic: {
        'example_route': '/example_page_route/asdf',
    }
};
```
