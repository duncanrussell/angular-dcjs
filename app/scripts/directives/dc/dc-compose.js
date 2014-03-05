// Generated by CoffeeScript 1.6.3
(function() {
  "use strict";
  if (!dc || !d3 || !crossfilter || !_) {
    throw 'You need to load DC, D3, Crossfilter and Underscore library';
  }

  angular.module('dcCompose', []).directive("dcCompose", function() {
    return {
      restrict: 'AC',
      scope: {
        dcCompose: '=',
        dimensions: '=',
        measures: '=',
        filter: '='
      },
      templateUrl: 'dc/compose/template.html',
      link: function($scope, element, attrs) {
        var _this = this;
        attrs.$observe('id', function(id) {
          return $scope.chartId = id ? id : 'dcComposeDefault';
        });
        $scope.height = attrs.height ? attrs.height : 150;
        $scope.$watch('dimensions', function(dim) {
          if (dim) {
            return $scope.dimFilters = dim;
          }
        });
        $scope.$watch('measures', function(measure) {
          if (measure) {
            return $scope.measureFilters = measure;
          }
        });
        $scope.$watch('dcCompose', function(dcCompose) {
          if (dcCompose) {
            $scope.create();
          }
        });
        $scope.$watch('filter', function(filter) {
          if ($scope.dcComposeChart) {
            $scope.dcComposeChart.filterAll();
            if (filter) {
              $scope.dcComposeChart.filter(filter);
            }
            return $scope.dcComposeChart.redraw();
          }
        });
        $scope.dcCompose.update = function() {
          return $scope.create();
        };
        $scope.create = function() {
          var lineCharts;
          $scope.dcComposeChart = dc.compositeChart('#' + $scope.chartId);
          lineCharts = [];
          angular.forEach($scope.dcCompose.sum.objects, function(value) {
            var line;
            line = dc.lineChart($scope.dcComposeChart).renderArea(true).group(value.object, value.title);
            lineCharts.push(line);
          });
          $scope.dcComposeChart.width(element.width()).height($scope.height).dimension($scope.dcCompose.dimension).group($scope.dcCompose.measure).margins({
            top: 40,
            right: 50,
            bottom: 30,
            left: 60
          }).x(d3.time.scale().domain([$scope.dcCompose.min, $scope.dcCompose.max])).renderHorizontalGridLines(true).elasticY(true).brushOn($scope.dcCompose.brush).legend(dc.legend().x(element.width() - 50).y(10)).compose(lineCharts);
          $scope.dcComposeChart.render();
        };
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=dc-compose.map
*/
