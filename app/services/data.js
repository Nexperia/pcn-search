'use strict';

angular.module('app').factory('Data',
    function ($http, config) {
        return {
            suggestions: function (query) {
                return $http.get(config.datahub_base_url + 'pws_pcn_ids.srj?$query="' + encodeURIComponent(query) + '"');
            },
            searchPCNs: function (query) {
                return $http.get(config.datahub_base_url + 'pws_pcn.srj?$query="' + encodeURIComponent(query) + '"');
            },
            searchOPNs: function (pcnId) {
                return $http.get(config.datahub_base_url + 'pws_pcn_opn.srj?$noticeCode="' + encodeURIComponent(pcnId) + '"');
            }
        }
    }
);