var schoolServices = angular.module('schoolServices', ['ngResource']);

schoolServices.factory('School', ['$resource',
  function($resource){
  	'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/School/1701', {}, {
      get: {
        isArray:false
      }
    });
  }]);

schoolServices.factory('Student', ['$resource',
  function($resource){
    'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/Student/:studentId', 
      {studentId: '@id'},
      {
        get: {isArray: false}
      }
      );
  }]);

schoolServices.factory('Me', ['$resource',
  function($resource){
    'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/Me', {},
      {
        get: { isArray: false }
      });
  }]);

schoolServices.factory('Students', ['$resource',
  function($resource){
    'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/Family/:familyId/Students', 
      {familyId: '@id'},
      {
        get: { isArray: true }
      });
  }]);

schoolServices.factory('Classes', ['$resource',
  function($resource){
    'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/Student/:studentId/Classes', 
      {studentId: '@id'},
      {
        get: { isArray: false }
      });
  }]);

schoolServices.factory('News', ['$resource',
  function($resource){
    'use strict';
    return $resource('https://app.sycamoreeducation.com/api/v1/School/1701/News', 
      {classId: '@id'},
      {
        get: { isArray: true }
      });
  }]);
