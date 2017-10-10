'use strict';

angular.module('app').factory('Url',
    function ($location) {
        return {
            updateParams: function (params) {
                var nonEmptyParams = {};

                angular.forEach(params, function (value, key) {
                    if (value) nonEmptyParams[key] = value;
                });
                $location.search(nonEmptyParams);
            }
        }
    }
);