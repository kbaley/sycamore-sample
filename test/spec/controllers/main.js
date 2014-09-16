'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('sampleApp'));

  var MainCtrl,
    news,
    httpBackend,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _$httpBackend_, News) {
    scope = $rootScope.$new();
    news = News;
    httpBackend = _$httpBackend_;
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      News: news
    });
  }));

  it('should load student details', function() {
    var url = 'https://app.sycamoreeducation.com/api/v1/School/1701/News';
    var mockData = [{ID:1, Title: 'moo'}];
    httpBackend.whenJSONP(url).respond(mockData);


  });
});
