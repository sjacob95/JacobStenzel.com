'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ui.router',
  'ngAnimate',
  'isLoggedIn',
  'welcome-page',
  'composer-landing',
  'programmer-landing',
  'general-landing',
  'about',
  'connect-page',
  'projects',
  'music',
  'blog',
  'login'
]).
config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.when('/landing', '/landing/general')
  .when('/landing/', '/landing/general')
	.otherwise('/welcome');
}])

.controller('AppCtrl', ['$scope', '$state', '$stateParams', 'isLoggedIn', function($scope, _$state_, _$stateParams_, isLoggedIn) {
  $scope.$state = _$state_;
  $scope.$stateParams = _$stateParams_;
  isLoggedIn().then(function(res) {
    $scope.isLoggedIn = res.data;
  }, function(res) {
    $scope.isLoggedIn = false;
  })
}])
