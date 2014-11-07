"use strict"
if not dc or not d3 or not crossfilter or not _
  throw new Error('You need to load DC, D3, Crossfilter and Underscore library')

angular.module('dcCompose',[]).

directive "dcCompose", ()->
  restrict: 'AC'
  scope:
    dcCompose: '='
    dimensions: '='
    measures: '='
    filter: '='
  templateUrl: 'dc/compose/template.html'
  link: ($scope, element, attrs)->
    attrs.$observe('id', (id)->
      $scope.chartId = if id then id else 'dcComposeDefault'
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

    $scope.$watch('dcCompose', (dcCompose)->
      if dcCompose
        $scope.create()
        return
    )

    $scope.$watch('filter',(filter)->
      if $scope.dcComposeChart
        $scope.dcComposeChart.filterAll()
        if filter
          $scope.dcComposeChart.filter(filter)
        $scope.dcComposeChart.redraw()
    )

    $scope.dcCompose.update = ()->
      $scope.create()


    $scope.create = ()->
      $scope.dcComposeChart = dc.compositeChart('#' + $scope.chartId)

      lineCharts = []
      angular.forEach($scope.dcCompose.sum.objects, (value)->
        line = dc.lineChart($scope.dcComposeChart).
          renderArea(true).
          group(value.object, value.title)
        lineCharts.push(line)
        return
      )


      $scope.dcComposeChart.
        width(element.width()).
        height($scope.height).
        dimension($scope.dcCompose.dimension).
        group($scope.dcCompose.measure).
        margins({top: 40, right: 50, bottom: 30, left: 60}).
        x(d3.time.scale().domain([$scope.dcCompose.min, $scope.dcCompose.max])).
        renderHorizontalGridLines(true).
        elasticY(true).
        brushOn($scope.dcCompose.brush).
        legend(dc.legend().x(element.width() - 50).y(10)).
        compose(lineCharts)

      $scope.dcComposeChart.render()
      return
    return