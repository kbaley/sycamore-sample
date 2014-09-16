'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, $q, School, Me, Students, News, Classes) {
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

      Students.get({familyId: familyId})
        .$promise.then( function(students) {
          angular.forEach(students, function(value) {

            console.log('processing student');
            loadClass(value);
          });
          console.log('pushing students');
          $scope.students = students;
        });
    }

    function loadNewsItems() {
      $scope.newsItems = News.get();
    }

    function loadClass(student) {

      student.classes = [];
      Classes.get({studentId: student.ID})
        .$promise.then( function(classes) {
          console.log('Processing class: ');
          angular.forEach(classes.Daylong, function(value) {
            console.log('Processing news');
            loadClassNews(value);
          });
          student.classes = classes.Daylong;
        });
    }

    function loadClassNews(theClass) {

      News.get({classid: theClass.ID})
        .$promise.then(function( news ) {
          console.log('setting news');
          theClass.news = news;
        } );
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
