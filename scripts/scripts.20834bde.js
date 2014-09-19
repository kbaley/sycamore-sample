"use strict";angular.module("sampleApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","schoolServices","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/calendar",{templateUrl:"views/calendar.html",controller:"CalendarCtrl"}).otherwise({redirectTo:"/"})}]);var schoolServices=angular.module("schoolServices",["ngResource"]);schoolServices.factory("School",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701")}]),schoolServices.factory("Student",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Student/:studentId",{studentId:"@id"})}]),schoolServices.factory("Me",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Me")}]),schoolServices.factory("Students",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Family/:familyId/Students",{familyId:"@id"},{get:{isArray:!0}})}]),schoolServices.factory("Classes",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Student/:studentId/Classes",{studentId:"@id"},{get:{isArray:!1}})}]),schoolServices.factory("News",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701/News/:newsId",{classid:"@id",newsId:"@id"},{})}]),schoolServices.factory("Events",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701/Calendar/:eventId",{eventId:"@id"},{})}]),schoolServices.factory("Accounts",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Family/:familyId/Accounts",{familyId:"@id"},{})}]),angular.module("sampleApp").controller("MainCtrl",["$scope","$http","$q","$sce","$timeout","School","Me","Students","News","Classes","Events","Accounts",function(a,b,c,d,e,f,g,h,i,j,k,l){function m(){g.get().$promise.then(function(b){a.me=b,n(),t()})}function n(){var b=a.me.FamilyID;h.get({familyId:b}).$promise.then(function(b){angular.forEach(b,function(a){r(a)}),a.students=b})}function o(){i.query().$promise.then(function(b){a.newsItems=b,angular.forEach(b,function(a){v[a.ID]=a})}),k.query().$promise.then(function(b){a.events=b,angular.forEach(b,function(a){w[a.ID]=a,p(a.ID)})})}function p(a){k.get({eventId:a}).$promise.then(function(b){w[a].AllDay="1"===b.AllDay?!0:!1,w[a].Start=b.Day+" "+b.Start;var c=new Date(b.Day+" "+b.Start),d=new Date(b.Day+" "+b.Duration),e=60*d.getHours()+d.getMinutes();c=new Date(c.getTime()+6e4*e),w[a].End=q(c),w[a].StartTime="1"===b.AllDay?"(all day)":"@ "+b.Start,w[a].Description=b.Notes})}function q(a){var b="0"+(a.getMonth()+1);b=b.substring(b.length-2);var c="0"+a.getDate();c=c.substring(c.length-2);var d=a.getYear()+1900,e="0"+a.getHours();e=e.substring(e.length-2);var f="0"+a.getMinutes();return f=f.substring(f.length-2),b+"-"+c+"-"+d+" "+e+":"+f}function r(a){a.classes=[],j.get({studentId:a.ID}).$promise.then(function(b){angular.forEach(b.Daylong,function(a){s(a)}),a.classes=b.Daylong})}function s(a){i.query({classid:a.ID}).$promise.then(function(b){a.news=b,angular.forEach(b,function(a){v[a.ID]=a})})}function t(){var b=a.me.FamilyID;a.accounts=l.query({familyId:b})}var u="6f9da01f0b53de10b522470a0db10168";b.defaults.headers.common.Authorization="Bearer "+u;var v=[],w=[];a.newsItems=[],a.classNews=[],a.me={},a.students=[],a.classes=[],a.events=[],a.accounts=[],e(function(){window.addthisevent.refresh()},2e3),a.showNews=function(a,b){b.target.innerText.indexOf("read")>-1?(i.get({newsId:a},function(b){v[a].Content="<div style='padding: 15px;'>"+b.Content+"</div>"}),b.target.innerHTML="hide <span style='font-size: 8px;'>&#x25B2;</span>"):(v[a].Content="",b.target.innerHTML="read more <span style='font-size: 8px;'>&#x25BC;</span>")},a.showEvent=function(a,b){b.target.innerText.indexOf("read")>-1?(k.get({eventId:a},function(b){w[a].Notes="<div style='padding: 15px;'>"+b.Notes+"</div>"}),b.target.innerHTML="hide <span style='font-size: 8px;'>&#x25B2;</span>"):(w[a].Notes="",b.target.innerHTML="read more <span style='font-size: 8px;'>&#x25BC;</span>")},a.skipValidation=function(a){return d.trustAsHtml(a)},a.isRecent=function(a){var b=Date.parse(a.Day),c=new Date;return c.setDate(c.getDate()-90),b>c},o(),m()}]);