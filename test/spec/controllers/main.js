'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('sampleApp'));

  var $q,
    $rootScope,
    $scope,
    mockNewsService,
    mockNewsResponse = [{ID: 1, Title: 'Moo'}],
    mockMeService,
    mockMeResponse = [{ID: 3, FamilyID: 10}],
    mockStudentService,
    // mockStudentResponse = [{ID: 2, FirstName: 'Jake'}],
    queryDeferred,
    getMeDeferred,
    getStudentsDeferred;

  beforeEach(inject(function(_$q_, _$rootScope_) {
    $q = _$q_;
    $rootScope = _$rootScope_;
  }));

  beforeEach(inject(function($controller) {
    $scope = $rootScope.$new();

    mockNewsService = {
      query: function() {
        queryDeferred = $q.defer();
        return {$promise: queryDeferred.promise};
      }
    };

    spyOn(mockNewsService, 'query').andCallThrough();

    mockStudentService = {
      get: function() {
        getStudentsDeferred = $q.defer();
        return {$promise: getStudentsDeferred.promise};
      }
    };

    spyOn(mockStudentService, 'get').andCallThrough();

    mockMeService = {
      get: function() {
        getMeDeferred = $q.defer();
        return {$promise: getMeDeferred.promise};
      }
    };

    spyOn(mockMeService, 'get').andCallThrough();
    
      console.log(getStudentsDeferred);
    $controller('MainCtrl', {
      '$scope': $scope,
      'Students': mockStudentService,
      'News': mockNewsService,
      'Me': mockMeService
    });
  }));

  describe( 'News.query', function() {
    beforeEach(function() {
      queryDeferred.resolve(mockNewsResponse);
      getMeDeferred.resolve(mockMeResponse);
      // getStudentsDeferred.resolve(mockStudentResponse);
      $rootScope.$apply();
    });

    it('should query the news service', function() {
      expect(mockNewsService.query).toHaveBeenCalled();
    });

    it('should load the news', function() {
      expect($scope.newsItems).toEqual(mockNewsResponse);
    });

    it('should get me', function() {
      expect(mockMeService.get).toHaveBeenCalled();
    });

  });

});
