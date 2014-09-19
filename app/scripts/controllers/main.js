'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, $q, $sce, School, Me, Students, News, Classes,
    Events, Accounts) {
  	////////////////////////////
  	//   LOCAL VARS           //
  	////////////////////////////
    var key = '6f9da01f0b53de10b522470a0db10168';
    $http.defaults.headers.common.Authorization = 'Bearer ' + key;
    var allNews = [];
    var allEvents = [];

  	////////////////////////////
  	//   SCOPE VARS           //
  	////////////////////////////
    $scope.newsItems = [];
    $scope.classNews = [];
    $scope.me = {};
    $scope.students = [];
    $scope.classes = [];
    $scope.events = [];
    $scope.accounts = [];

 
  	////////////////////////////
  	//   LOCAL FUNCTIONS      //
  	////////////////////////////
    function getStudentDetails() {
      Me.get()
        .$promise.then(function(me) {
          $scope.me = me;
          loadStudents();
          loadAccounts();
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
      News.query()
        .$promise.then(function(news) {
          $scope.newsItems = news;
          angular.forEach(news, function(value) {
            allNews[value.ID] = value;
          });
        });

      Events.query()
        .$promise.then(function(events) {
          $scope.events = events;
          angular.forEach(events, function(value) {
            allEvents[value.ID] = value;
            loadEventStart(value.ID);
          });
        });
    }

    function loadEventStart(eventId) {

      Events.get({eventId: eventId})
        .$promise.then(function(data) {
          if (data.AllDay === '1') {
            allEvents[eventId].Start = '(all day)';
          } else {
            allEvents[eventId].Start = '@ ' + data.Start;
          }
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

    function loadAccounts() {
      var familyId = $scope.me.FamilyID;
      $scope.accounts = Accounts.query({familyId: familyId});
    } 

  	////////////////////////////
  	//   SCOPE FUNCTIONS      //
  	////////////////////////////
    $scope.showNews = function(newsId, e) {
      if (e.target.innerText.indexOf('read') > -1) { 
        News.get({newsId: newsId}, function(data) {
          allNews[newsId].Content = '<div style=\'padding: 15px;\'>' + data.Content + '</div>';
        }); 
        e.target.innerHTML = 'hide <span style=\'font-size: 8px;\'>&#x25B2;</span>';
      }
      else {
        allNews[newsId].Content = '';
        e.target.innerHTML = 'read more <span style=\'font-size: 8px;\'>&#x25BC;</span>';
      }
    };

    $scope.showEvent = function(eventId, e) {
      if (e.target.innerText.indexOf('read') > -1) { 
        Events.get({eventId: eventId}, function(data) {
          allEvents[eventId].Notes = '<div style=\'padding: 15px;\'>' + 
          data.Notes + '</div>';
        }); 
        e.target.innerHTML = 'hide <span style=\'font-size: 8px;\'>&#x25B2;</span>';
      }
      else {
        allEvents[eventId].Notes = '';
        e.target.innerHTML = 'read more <span style=\'font-size: 8px;\'>&#x25BC;</span>';
      }
    };

    $scope.skipValidation = function(text) {
      return $sce.trustAsHtml(text);
    };

    $scope.isRecent = function(news) {
      var newsDate = Date.parse(news.Day);
      var threeMonthsAgo = new Date();
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
      return newsDate > threeMonthsAgo;
    };

  	////////////////////////////
  	//   ONLOAD               //
  	////////////////////////////

    loadNews();
    getStudentDetails();

  });
