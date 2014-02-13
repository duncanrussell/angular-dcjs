// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  describe("Controller:MainController", function() {
    var $controller, $httpBackend, $rootScope, $scope, Debug, createController;
    $controller = void 0;
    $rootScope = void 0;
    $scope = void 0;
    Debug = void 0;
    createController = void 0;
    $httpBackend = void 0;
    beforeEach(function() {
      module('angularDcjsApp');
      inject(function($injector) {
        $rootScope = $injector.get('$rootScope');
        $scope = $rootScope.$new();
        Debug = $injector.get('Debug');
        $controller = $injector.get('$controller');
        $httpBackend = $injector.get('$httpBackend');
        createController = function() {
          return $controller('MainController', {
            '$scope': $scope,
            'Debug': Debug
          });
        };
      });
    });
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      return $httpBackend.verifyNoOutstandingRequest();
    });
    it("should have array in measures", function() {
      var controller;
      controller = createController();
      return expect($scope.measures).toEqual(jasmine.any(Array));
    });
    it("Debug should be loaded", function() {
      var controller;
      controller = createController();
      return expect($scope.debug).not.toBeNull;
    });
    it("should add an input value", function() {
      var controller;
      controller = createController();
      $scope.debug.input('Test');
      return expect($scope.debug.output().length).toBe(1);
    });
    it("GridsterOpts to equal an Object", function() {
      var controller;
      controller = createController();
      return expect($scope.gridOpts).toEqual(jasmine.any(Object));
    });
    it("Items to equal an Array", function() {
      var controller;
      controller = createController();
      return expect($scope.items).toEqual(jasmine.any(Array));
    });
    it("should get the data from backend Mock", function() {
      var controller;
      $httpBackend.when('GET', 'sampledata.json').respond(200);
      return controller = createController();
    });
    it("should have array in metadata", function() {
      var controller;
      controller = createController();
      return expect($scope.metadata).toEqual(jasmine.any(Array));
    });
    return it("should find MEASURES and log them", function() {
      var controller;
      controller = createController();
      return expect($scope.debug.output().length).toBe > 0;
    });
  });

}).call(this);

/*
//@ sourceMappingURL=main.map
*/
