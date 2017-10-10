'use strict';

function SearchCtrl($scope, $stateParams, $timeout, Data, Transform, Url) {
    var ctrl = this;

    ctrl.results = {};
    ctrl.searchParams = {};
    ctrl.isLoaded = {
        results: true
    };

    ctrl.clearError = function () {
        ctrl.error = null;
    };

    ctrl.getSuggestions = function (viewValue) {
        return Data.suggestions(viewValue).then(function (response) {
            return $timeout(function () {
                return Transform.simplifySrj(response.data).map(function (pcn) {
                    return pcn.noticeCode;
                });
            });
        });
    };

    ctrl.search = function () {
        Url.updateParams(ctrl.searchParams);
        ctrl.open = {};

        ctrl.isLoaded.results = false;
        Data.searchPCNs(ctrl.searchParams.query).then(function (response) {
            $timeout(function () {
                ctrl.results = Transform.simplifySrj(response.data);
                ctrl.isLoaded.results = true;
            });
        }, function () {
            ctrl.isLoaded.results = true;
        });
    };

    if ($stateParams.query) {
        ctrl.searchParams.query = $stateParams.query;
        ctrl.search();
    }
}

angular.module('app').component('searchComp', {
    templateUrl: 'app/views/search.html',
    controller: SearchCtrl
});