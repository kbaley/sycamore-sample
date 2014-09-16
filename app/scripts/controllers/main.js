'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, $q, $sce, School, Me, Students, News, Classes) {
  	////////////////////////////
  	//   LOCAL VARS           //
  	////////////////////////////
    var key = '6f9da01f0b53de10b522470a0db10168';
    $http.defaults.headers.common.Authorization = 'Bearer ' + key;
    var allNews = [];

  	////////////////////////////
  	//   SCOPE VARS           //
  	////////////////////////////
    $scope.newsItems = [];
    $scope.classNews = [];
    $scope.me = {};
    $scope.students = [];
    $scope.classes = [];

 
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

            loadClass(value);
          });
          $scope.students = students;
        });
    }

    function loadNews() {
      $scope.newsItems = News.query(function(news) {
        angular.forEach(news, function(value) {
          allNews[value.ID] = value;
        });
      });
    }

    function loadClass(student) {

      student.classes = [];
      Classes.get({studentId: student.ID})
        .$promise.then( function(classes) {
          angular.forEach(classes.Daylong, function(value) {
            loadClassNews(value);
          });
          student.classes = classes.Daylong;
        });
    }

    function loadClassNews(theClass) {

      News.query({classid: theClass.ID})
        .$promise.then(function( news ) {
          theClass.news = news;
          angular.forEach(news, function(value) {
            allNews[value.ID] = value;
          });
        } );
    }

  	////////////////////////////
  	//   SCOPE FUNCTIONS      //
  	////////////////////////////
    $scope.showNews = function(newsId) {
      News.get({newsId: newsId}, function(data) {
        allNews[newsId].Content = '<div style=\'padding: 15px;\'>' + data.Content + '</div>';
      });
    };

    $scope.skipValidation = function(text) {
      return $sce.trustAsHtml(text);
    };

  	////////////////////////////
  	//   ONLOAD               //
  	////////////////////////////

    loadNews();
    getStudentDetails();

  });
