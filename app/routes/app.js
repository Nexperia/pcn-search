'use strict';

//Setting up route
angular.module('app').config(
    function ($stateProvider, $urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/search');

        $stateProvider
            .state('search', {
                url: '/search?query',
                templateUrl: 'app/views/main.html',
                reloadOnSearch: false
            });
        $locationProvider.html5Mode(true);
    }
);
