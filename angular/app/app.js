/* global angular */
'use strict';

var app = angular.module('ChatApp', [
  'sampleAppControllers',
  'conversationPanelControllers',
  'conversationListControllers',
  'newConversationPanelControllers',
  'messageListControllers',
  'messageItemControllers',
  'infinite-scroll',
  'ngRoute'
]);

/*
 * Adds support for an ng-enter directive that
 * executes the specified function on receiving
 * an ENTER keydown event.
 */
app.directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind('keydown', function(e) {
      if (e.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter, {'e': e});
        });
        e.preventDefault();
      }
    });
  };
});
