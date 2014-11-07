"use strict"
if not dc or not d3 or not crossfilter or not _
  throw new Error('You need to load DC, D3, Crossfilter and Underscore library')

angular.module('dcLine',[]).

directive "dcLine", ()->
  restrict: 'AC'
  scope:
    dcLine: '='
    dimensions: '='
    measures: '='
    filter: '='
  templateUrl: 'dc/line/template.html'
  link: ($scope, element, attrs)->
    attrs.$observe('id', (id)->
      $scope.chartId = if id then id else 'dcLineDefault'
    )

    $scope.height = if attrs.height then attrs.height else 150


    $scope.$watch('dimensions',(dim)->
      if dim
        $scope.dimFilters = dim
    )

    $scope.$watch('measures',(measure)->
      if measure
        $scope.measureFilters = measure
    )

    $scope.$watch('dcLine', (dcLine)->
      if dcLine
        $scope.create()
        return
    )

    $scope.dcLine.update = ()->
      $scope.create()

    $scope.create = ()->
      $scope.dcLineChart = dc.lineChart('#' + $scope.chartId)
      $scope.dcLineChart.
        width(element.width()).
        height($scope.height).
        margins({ top: 10, left: 50, right: 10, bottom: 50 }).
        dimension($scope.dcLine.dimension).
        group($scope.dcLine.sum).
        x(d3.time.scale().domain([$scope.dcLine.min,$scope.dcLine.max])).
        yAxisLabel($scope.dcLine.indexBy.sum).
        xAxisLabel($scope.dcLine.indexBy.dimension).
        renderArea(true).
        brushOn($scope.dcLine.brush).
        renderHorizontalGridLines(true).
        elasticY(true).
        elasticX(true).
        title((d)->
          return d.data.key + "  " + d.data.value
        ).
        render()
      return
    return