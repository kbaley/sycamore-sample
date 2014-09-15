var schoolServices = angular.module('schoolServices', ['ngResource']);

schoolServices.factory('School', ['$resource',
  function($resource){
  	'use strict';
    var key = '6f9da01f0b53de10b522470a0db10168';
    return $resource('https://app.sycamoreeducation.com/api/v1/School/:schoolId', {}, {
      query: {
      	method:'GET', 
      	params:{schoolId:'1701'}, 
        headers: {'Authorization': 'Bearer ' + key},
      	isArray:false}
    });
  }]);