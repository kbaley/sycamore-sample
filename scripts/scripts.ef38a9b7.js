"use strict";angular.module("sampleApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","schoolServices","ui.bootstrap"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/calendar",{templateUrl:"views/calendar.html",controller:"CalendarCtrl"}).otherwise({redirectTo:"/"})}]);var schoolServices=angular.module("schoolServices",["ngResource"]);schoolServices.factory("School",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701")}]),schoolServices.factory("Student",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Student/:studentId",{studentId:"@id"})}]),schoolServices.factory("Me",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Me")}]),schoolServices.factory("Students",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Family/:familyId/Students",{familyId:"@id"},{get:{isArray:!0}})}]),schoolServices.factory("Classes",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Student/:studentId/Classes",{studentId:"@id"},{get:{isArray:!1}})}]),schoolServices.factory("News",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701/News/:newsId",{classid:"@id",newsId:"@id"},{})}]),schoolServices.factory("Events",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/School/1701/Calendar/:eventId",{eventId:"@id"},{})}]),schoolServices.factory("Accounts",["$resource",function(a){return a("https://app.sycamoreeducation.com/api/v1/Family/:familyId/Accounts",{familyId:"@id"},{})}]),angular.module("sampleApp").controller("MainCtrl",["$scope","$http","$q","$sce","School","Me","Students","News","Classes","Events","Accounts",function(a,b,c,d,e,f,g,h,i,j,k){function l(){f.get().$promise.then(function(b){a.me=b,m(),r()})}function m(){var b=a.me.FamilyID;g.get({familyId:b}).$promise.then(function(b){angular.forEach(b,function(a){p(a)}),a.students=b})}function n(){h.query().$promise.then(function(b){a.newsItems=b,angular.forEach(b,function(a){t[a.ID]=a})}),j.query().$promise.then(function(b){a.events=b,angular.forEach(b,function(a){u[a.ID]=a,o(a.ID)})})}function o(a){j.get({eventId:a}).$promise.then(function(b){u[a].Start="1"===b.AllDay?"(all day)":"@ "+b.Start})}function p(a){a.classes=[],i.get({studentId:a.ID}).$promise.then(function(b){angular.forEach(b.Daylong,function(a){q(a)}),a.classes=b.Daylong})}function q(a){h.query({classid:a.ID}).$promise.then(function(b){a.news=b,angular.forEach(b,function(a){t[a.ID]=a})})}function r(){var b=a.me.FamilyID;a.accounts=k.query({familyId:b})}var s="6f9da01f0b53de10b522470a0db10168";b.defaults.headers.common.Authorization="Bearer "+s;var t=[],u=[];a.newsItems=[],a.classNews=[],a.me={},a.students=[],a.classes=[],a.events=[],a.accounts=[],a.showNews=function(a,b){b.target.innerText.indexOf("read")>-1?(h.get({newsId:a},function(b){t[a].Content="<div style='padding: 15px;'>"+b.Content+"</div>"}),b.target.innerHTML="hide <span style='font-size: 8px;'>&#x25B2;</span>"):(t[a].Content="",b.target.innerHTML="read more <span style='font-size: 8px;'>&#x25BC;</span>")},a.showEvent=function(a,b){b.target.innerText.indexOf("read")>-1?(j.get({eventId:a},function(b){u[a].Notes="<div style='padding: 15px;'>"+b.Notes+"</div>"}),b.target.innerHTML="hide <span style='font-size: 8px;'>&#x25B2;</span>"):(u[a].Notes="",b.target.innerHTML="read more <span style='font-size: 8px;'>&#x25BC;</span>")},a.skipValidation=function(a){return d.trustAsHtml(a)},a.isRecent=function(a){var b=Date.parse(a.Day),c=new Date;return c.setDate(c.getDate()-90),b>c},n(),l()}]);