'use strict';

function StickyHeaderCtrl(SharePointContext) {
    SharePointContext.init();
}

angular.module('app').component('stickyHeader', {
    transclude: true,
    templateUrl: 'app/views/sticky-header.html',
    controller: StickyHeaderCtrl
});