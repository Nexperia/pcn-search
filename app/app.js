'use strict';

require('angular');
require('angular-ui-router');
require('angular-ui-bootstrap');
var jsonld = require('jsonld');

angular.module('app', [
    'app.config',
    'ui.router',
    'ui.bootstrap'
]);

require('../tmp/templateCache.js');
require('../tmp/config.js');
require('./routes/app.js');
require('./components/search.js');
require('./components/results-area.js');
require('./components/spinner.js');
require('./services/data.js');
require('./services/transform.js');
require('./services/url.js');
