"use strict"
if not dc or not d3 or not crossfilter or not _
  throw new Error('You need to load DC, D3, Crossfilter and Underscore library')

angular.module('dcPie',[]).

directive "dcPie", ($rootScope)->
  restrict: 'AC'
  scope:
    dcPie: '='
    dimensions: '='
    measures: '='
    filter: '='
  templateUrl: 'dc/pie/template.html'
  link: ($scope, element, attrs)->

    attrs.$observe('id', (id)->
      $scope.chartId = if id then id else 'dcPieDefault'
    )

    $scope.$watch('dimensions',(dim)->
      if dim
        $scope.dimFilters = dim
    )

    $scope.$watch('measures',(measure)->
      if measure
        $scope.measureFilters = measure
    )

    $scope.$watch('filter',(filter)->
      if $scope.dcPieChart
        $scope.dcPieChart.filterAll()
        if filter
          $scope.dcPieChart.filter(filter)
        $scope.dcPieChart.redraw()
    )

    $scope.$watch('dcPie', (dcPie)->
      if dcPie
        $scope.create()
    )

    $scope.setHeight = (height)->
      if $scope.dcPieChart and height
        $scope.dcPieChart.height(height)

    $scope.dcPie.update = ()->
      $scope.dcPieChart.
      dimension($scope.dcPie.dimension).
      group($scope.dcPie.sum).
      redraw()


    $scope.setMetrics = ()->
      if $scope.dimFilter and $scope.measureFilter
        $scope.dcPieChart.filterAll()
        $scope.dcPie.dimension = $scope.dcPie.data.dimension((d)->
          d['DIMENSION:' + $scope.dimFilter]
        )
        $scope.dcPie.sum  = $scope.dcPie.dimension.group().reduceSum((d)->
          return d['MEASURE:' + $scope.measureFilter]
        )
        $scope.dcPieChart.
          dimension($scope.dcPie.dimension).
          group($scope.dcPie.sum).
          redraw()

    $scope.create = ()->
      $scope.dcPieChart = dc.pieChart('#' + $scope.chartId)
      $scope.dcPieChart.
        width(attrs.width).
        height(attrs.height).
        dimension($scope.dcPie.dimension).
        group($scope.dcPie.sum)
      $scope.dcPieChart.render()
      return
    return