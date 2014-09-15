'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, School) {
  	////////////////////////////
  	//   LOCAL VARS           //
  	////////////////////////////
    var key = '6f9da01f0b53de10b522470a0db10168';

  	////////////////////////////
  	//   SCOPE VARS           //
  	////////////////////////////
    $scope.newsItems = [];
    $scope.classNews = [];
    $scope.me = {};
    $scope.students = [];
    $scope.classes = [];
    $scope.school = School.query();

    
  	////////////////////////////
  	//   LOCAL FUNCTIONS      //
  	////////////////////////////
    function getStudentDetails() {
      var url = 'https://app.sycamoreeducation.com/api/v1/Me';
      var responsePromise = $http(
          {
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Bearer ' + key}
          }
        );

      responsePromise.success(function(data) {
        $scope.me = data;
        loadStudents();
      });
    }

    function loadStudents() {
      var familyId = $scope.me.FamilyID;
      var url = 'https://app.sycamoreeducation.com/api/v1/Family/' + familyId + '/Students';
      var responsePromise = $http(
          {
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Bearer ' + key}
          }
        );

      responsePromise.success(function(data) {
        $scope.students = data;
        loadClasses();
      });

    }

    function loadNewsItems() {

      var url = 'https://app.sycamoreeducation.com/api/v1/School/1701/News';
      var responsePromise = $http(
          {
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Bearer ' + key}
          }
        );

      responsePromise.success(function(data) {
      window.alert($scope.school.Name);
        $scope.newsItems = data;
      });
    }

    function loadClasses() {

      angular.forEach($scope.students, function(value) {
        loadClass(value);
      });
    }

    function loadClass(student) {

      var url = 'https://app.sycamoreeducation.com/api/v1/Student/' + student.ID + '/Classes';
      var responsePromise = $http(
          {
            method: 'GET',
            url: url,
            headers: {'Authorization': 'Bearer ' + key}
          }
        );

      responsePromise.success(function(data) {
        angular.forEach(data.Daylong, function(value) {
          $scope.classes.push(value);
        });
        loadClassNews();
      });
    }

    function loadClassNews() {
      angular.forEach($scope.classes, function(value) {

        value.news = [];
        var url = 'https://app.sycamoreeducation.com/api/v1/School/1701/News';
        var responsePromise = $http(
            {
              method: 'GET',
              url: url,
              params: {'classid': value.ID},
              headers: {'Authorization': 'Bearer ' + key}
            }
          );

        responsePromise.success(function() {

        });
      });
    }

  	////////////////////////////
  	//   SCOPE FUNCTIONS      //
  	////////////////////////////


  	////////////////////////////
  	//   ONLOAD               //
  	////////////////////////////

    loadNewsItems();
    getStudentDetails();

  });
