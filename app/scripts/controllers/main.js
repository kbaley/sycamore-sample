'use strict';

/**
 * @ngdoc function
 * @name sampleApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sampleApp
 */
angular.module('sampleApp')
  .controller('MainCtrl', function ($scope, $http, $q, $sce, $timeout, School, Me, Students, News, Classes,
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

 
    $timeout(function() {
      window.addthisevent.refresh();
    }, 2000);

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
      var threeMonthsAgo = new Date();
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
      var year = threeMonthsAgo.getYear() + 1900;
      var month = '0' + (threeMonthsAgo.getMonth() + 1);
      var day = '0' + threeMonthsAgo.getDate();
      var endParam = year + '-' + (month.substring(month.length - 2) + '-' + (day.substring(day.length - 2)));

      News.query({end: endParam})
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
          allEvents[eventId].AllDay = (data.AllDay === '1' ? true : false);
          allEvents[eventId].Start = data.Day + ' ' + data.Start;
          var endTime = new Date(data.Day + ' ' + data.Start);
          var duration = new Date(data.Day + ' ' + data.Duration);
          var minutes = duration.getHours() * 60 + duration.getMinutes();
          endTime = new Date(endTime.getTime() + (minutes * 60000));
          allEvents[eventId].End = formatDate(endTime);
          if (data.AllDay === '1') {
            allEvents[eventId].StartTime = '(all day)';
          } else {
            allEvents[eventId].StartTime = '@ ' + data.Start;
          }
          allEvents[eventId].Description = data.Notes;
        });
    }

    function formatDate(date) {
      var month = '0' + (date.getMonth() + 1);
      month = month.substring(month.length - 2);
      var day = '0' + date.getDate();
      day = day.substring(day.length - 2);
      var year = date.getYear() + 1900;
      var hour = '0' + date.getHours();
      hour = hour.substring(hour.length - 2);
      var minute = '0' + date.getMinutes();
      minute = minute.substring(minute.length - 2);
      return month + '-' + day + '-' + year + ' ' + hour + ':' + minute;
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
      var threeMonthsAgo = new Date();
      threeMonthsAgo.setDate(threeMonthsAgo.getDate() - 90);
      var year = threeMonthsAgo.getYear() + 1900;
      var month = '0' + (threeMonthsAgo.getMonth() + 1);
      var day = '0' + threeMonthsAgo.getDate();
      var endParam = year + '-' + (month.substring(month.length - 2) + '-' + (day.substring(day.length - 2)));

      News.query({classid: theClass.ID, end: endParam})
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
