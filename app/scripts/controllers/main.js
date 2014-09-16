'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, School, Me, Students, News, Classes) {
  	////////////////////////////
  	//   LOCAL VARS           //
  	////////////////////////////
    var key = '6f9da01f0b53de10b522470a0db10168';
    $http.defaults.headers.common.Authorization = 'Bearer ' + key;

  	////////////////////////////
  	//   SCOPE VARS           //
  	////////////////////////////
    $scope.newsItems = [];
    $scope.classNews = [];
    $scope.me = {};
    $scope.students = [];
    $scope.classes = [];
    $scope.school = School.get();

    
  	////////////////////////////
  	//   LOCAL FUNCTIONS      //
  	////////////////////////////
    function getStudentDetails() {
      $scope.me = Me.get(function() {
        loadStudents();
      });
    }

    function loadStudents() {
      var familyId = $scope.me.FamilyID;

      $scope.students = Students.get({familyId: familyId}, function() {
        loadClasses();
      });
    }

    function loadNewsItems() {
      $scope.newsItems = News.get();
    }

    function loadClasses() {

      angular.forEach($scope.students, function(value) {
        loadClass(value);
      });
    }

    function loadClass(student) {

      Classes.get({studentId: student.ID}, function(data) {
        angular.forEach(data.Daylong, function(value) {
          loadClassNews(value);
          $scope.classes.push(value);
        });
      });
      // var url = 'https://app.sycamoreeducation.com/api/v1/Student/' + student.ID + '/Classes';
      // var responsePromise = $http(
      //     {
      //       method: 'GET',
      //       url: url,
      //       headers: {'Authorization': 'Bearer ' + key}
      //     }
      //   );

      // responsePromise.success(function(data) {
      //   angular.forEach(data.Daylong, function(value) {
      //     loadClassNews(value);
      //     $scope.classes.push(value);
      //   });
      // });
    }

    function loadClassNews(theClass) {

      theClass.news = News.get({classId: theClass.ID});
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
