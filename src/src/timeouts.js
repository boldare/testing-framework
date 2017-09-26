import {defineSupportCode} from 'cucumber';
import * as world from './xsolve_wtf';
const config = world.getConfig();

defineSupportCode(function({setDefaultTimeout}) {
    setDefaultTimeout(config.defaultStepTimeout);
});
