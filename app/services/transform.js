'use strict';

angular.module('app').factory('Transform',
    function () {
        function getJsonLdContext(repo, plmType, contextProps) {
            return {
                '@context': angular.extend({
                    '@vocab': 'http://www.data.nexperia.com/def/' + repo + '/',
                    schema: 'http://schema.org/',
                    dc: 'http://purl.org/dc/terms/',
                    nfo: 'http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#',
                    xsd: 'http://www.w3.org/2001/XMLSchema#'
                }, contextProps),
                '@type': 'http://www.data.nexperia.com/def/' + repo + '/' + plmType
            };
        }

        return {
            rewriteJsonLdProperties: function (data) {
                return data.map(function (res) {
                    for (var key in res) {
                        if (res.hasOwnProperty(key) && key.indexOf('/') !== -1) {
                            var newkey = key.split(/[\/#]/).pop();
                            res[newkey] = res[key];
                            delete res[key];
                        }
                    }
                    return res;
                });
            },
            simplifyJsonLd: function (data, repo, plmType, contextProps, onSuccess) {
                var callback = function (err, data) {
                    if (err) console.log(err);
                    else {
                        // console.log(JSON.stringify(data, null, 2));
                        onSuccess(data['@graph']);
                    }
                };
                return jsonld.compact(data, getJsonLdContext(repo, plmType, contextProps),
                    { graph: true }, callback);
            },
            simplifySrj: function (data) {
                return data.results.bindings.map(function (res) {
                    for (var key in res) {
                        if (res.hasOwnProperty(key)) {
                            res[key] = res[key].value;
                        }
                    }
                    return res;
                });
            },
            fillRepeatedChildrenPropsJsonLd: function (data, childName) {
                var map = {};
                data.forEach(function (item) {
                    item[childName] = Array.isArray(item[childName]) ? item[childName] : [item[childName]];
                    item[childName].forEach(function (child) {
                        var id = child['@id'];
                        if (map[id]) angular.extend(child, map[id]);
                        else map[id] = child;
                    });
                });
                return data;
            }
        }
    }
);