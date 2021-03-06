// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  describe("Directive: Dc-Line", function() {
    var data, dataResponse, dimension, element, measure, scope;
    scope = void 0;
    element = void 0;
    data = void 0;
    dataResponse = void 0;
    dimension = void 0;
    measure = void 0;
    beforeEach(function() {
      module('dcModule.templates');
    });
    beforeEach(function() {
      module('dcModule');
    });
    beforeEach(inject(function($rootScope) {
      scope = $rootScope.$new();
      dataResponse = [
        {
          "DATETIME:date": "9/27/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 3.49,
          "MEASURE:Customer Price": 4.99,
          "DIMENSION:Vendor Identifier": "0144_20121109",
          "DIMENSION:Title": "Headh",
          "DIMENSION:Label/Studio/Network": "Yello",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "5.02E+09",
          "DIMENSION:Postal Code": "49915-2504",
          "DIMENSION:Customer Identifier": 2240000173,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "CL",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "HD"
        }, {
          "DATETIME:date": "9/24/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 1.39,
          "MEASURE:Customer Price": 1.99,
          "DIMENSION:Vendor Identifier": "0099_20120827",
          "DIMENSION:Title": "A Ond",
          "DIMENSION:Label/Studio/Network": "Const",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "2.03E+09",
          "DIMENSION:Postal Code": "29284-3466",
          "DIMENSION:Customer Identifier": 1642627348,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "BR",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "SD"
        }, {
          "DATETIME:date": "9/29/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 3.49,
          "MEASURE:Customer Price": 4.99,
          "DIMENSION:Vendor Identifier": "0144_20121109",
          "DIMENSION:Title": "Headh",
          "DIMENSION:Label/Studio/Network": "Yello",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "5.70E+09",
          "DIMENSION:Postal Code": "26586-2424",
          "DIMENSION:Customer Identifier": 4967191007,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "CO",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "HD"
        }, {
          "DATETIME:date": "9/28/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 2.79,
          "MEASURE:Customer Price": 3.99,
          "DIMENSION:Vendor Identifier": "0144_20121109",
          "DIMENSION:Title": "Headh",
          "DIMENSION:Label/Studio/Network": "Yello",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "3.05E+09",
          "DIMENSION:Postal Code": "23322-2800",
          "DIMENSION:Customer Identifier": 3573922889,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "CL",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "SD"
        }, {
          "DATETIME:date": "9/23/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 2.09,
          "MEASURE:Customer Price": 2.99,
          "DIMENSION:Vendor Identifier": "0211_20132108",
          "DIMENSION:Title": "AlÃŒÂ©m",
          "DIMENSION:Label/Studio/Network": "Wakin",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "4.34E+09",
          "DIMENSION:Postal Code": "18509-2108",
          "DIMENSION:Customer Identifier": 4368359068,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "BR",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "HD"
        }, {
          "DATETIME:date": "9/28/13",
          "MEASURE:Units": 1,
          "MEASURE:Royalty Price": 1.39,
          "MEASURE:Customer Price": 1.99,
          "DIMENSION:Vendor Identifier": "0145_20121109",
          "DIMENSION:Title": "Habem",
          "DIMENSION:Label/Studio/Network": "Sache",
          "DIMENSION:Product Type Identifier": "D",
          "DIMENSION:Order Id": "3.77E+09",
          "DIMENSION:Postal Code": "16346-1910",
          "DIMENSION:Customer Identifier": 4481458708,
          "DIMENSION:Sale/Return": "S",
          "DIMENSION:Customer Currency": "USD",
          "DIMENSION:Country Code": "BR",
          "DIMENSION:Royalty Currency": "USD",
          "DIMENSION:Asset/Content Flavor": "SD"
        }
      ];
      data = crossfilter(dataResponse);
      dimension = data.dimension(function(d) {
        return d['DATETIME:date'];
      });
      measure = dimension.group().reduceSum(function(d) {
        return d['MEASURE:Customer Price'];
      });
      scope.dcLine = {
        dimensions: dimension,
        sum: measure
      };
      scope.update = function() {};
      scope.create = function() {};
    }));
    it("should start directive", inject(function($compile) {
      element = angular.element('<div id="#dcLine" dc-line data="rows"></div>');
      element = $compile(element)(scope);
      return expect(element.html()).not.toBeNull;
    }));
    it("should load dcLine from scope", function() {
      return expect(scope.dcLine).toBeNull;
    });
    it("should change scope data and get an array", function() {
      return expect(scope.dcLine).toEqual(jasmine.any(Object));
    });
    it("should have D3 library", function() {
      return expect(d3).not.toBeNull;
    });
    it("should have DC library", function() {});
    expect(dc).not.toBeNull;
    it("should have CrossFilter library", function() {
      return expect(dc).not.toBeNull;
    });
    it("should have Underscore library", function() {
      return expect(_).not.toBeNull;
    });
    it("should input lineChart into the element", function() {
      scope.dcLineChart = dc.lineChart('#dcLine');
      return expect(scope.dcLineChart).not.toBeNull;
    });
    it("should load measures from scope", function() {
      return expect(scope.measures).toBeNull;
    });
    it("should load dimensions from scope", function() {
      return expect(scope.dimensions).toBeNull;
    });
    it("should change scope dcLine and get an Object", function() {
      return expect(scope.dcLine).toEqual(jasmine.any(Object));
    });
    it("should call create method", function() {
      spyOn(scope, 'create').andCallThrough();
      scope.create();
      scope.dcLineChart = dc.lineChart('#dcLine');
      expect(scope.dcLineChart.dimension).not.toBeNull;
      expect(scope.dcLineChart.sum).not.toBeNull;
      scope.dcLineChart.width(750).height(200).dimension(scope.dcLine.dimension).group(scope.dcLine.sum).x(d3.time.scale().domain([scope.dcLine.minDate, scope.dcLine.maxDate])).yAxisLabel("Total").xAxisLabel("Data");
      return expect(scope.create).toHaveBeenCalled();
    });
    return it("should call update method", function() {
      spyOn(scope, 'update').andCallThrough();
      scope.update();
      return expect(scope.update).toHaveBeenCalled();
    });
  });

}).call(this);

/*
//@ sourceMappingURL=dc-line.map
*/
