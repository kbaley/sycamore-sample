'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
