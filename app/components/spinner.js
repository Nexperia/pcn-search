'use strict';

angular.module('app').component('spinner', {
    bindings: {
        show: '<',
        height: '@'
    },
    templateUrl: 'app/views/spinner.html'
});