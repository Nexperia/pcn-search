'use strict';

function ResultsAreaCtrl($scope, $timeout, Data, Transform) {
    var ctrl = this;

    ctrl.open = {};
    ctrl.isLoaded = {};
    ctrl.pcnOPNs = {};

    ctrl.expandAll = function () {
        ctrl.results.forEach(function (result) {
            ctrl.open[result.noticeCode] = true;
            ctrl.searchOPNs(result.noticeCode);
        });
    };

    ctrl.collapseAll = function () {
        ctrl.open = {};
    };

    ctrl.searchOPNs = function (pcnId) {
        if (!ctrl.pcnOPNs[pcnId]) {
            ctrl.isLoaded[pcnId] = false;
            Data.searchOPNs(pcnId).then(function (response) {
                return $timeout(function () {
                    ctrl.pcnOPNs[pcnId] = Transform.simplifySrj(response.data);
                    ctrl.isLoaded[pcnId] = true;
                });
            }, function () {
                ctrl.pcnOPNs[pcnId] = [];
                ctrl.isLoaded[pcnId] = true;
            });
        }
    };
}

angular.module('app').component('resultsArea', {
    bindings: {
        results: '<'
    },
    templateUrl: 'app/views/results-area.html',
    controller: ResultsAreaCtrl
});