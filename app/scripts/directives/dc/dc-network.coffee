"use strict"
if not dc or not d3 or not crossfilter or not _
  throw new Error('You need to load DC, D3, Crossfilter and Underscore library')

angular.module('dcNetwork',[]).

directive "dcNetwork", ()->
  console.log "launch Network chart directive"
  restrict: 'AC'
  scope:
    dcNetwork: '='
    dimensions: '='
    measures: '='
    filter: '='
  templateUrl: 'dc/network/template.html'
  link: ($scope, element, attrs)->
    attrs.$observe('id', (id)->
      $scope.chartId = if id then id else 'dcNetworkDefault'
    )

    $scope.height = if attrs.height then attrs.height else 150

    # on these changes... we should (optionally) update the network with new data
    $scope.$watch('dimensions',(dim)->
      if dim
        $scope.dimFilters = dim
    )

    $scope.$watch('measures',(measure)->
      if measure
        $scope.measureFilters = measure
    )

    $scope.$watch('dcNetwork', (dcNetwork)->
      if dcNetwork
        $scope.create()
        return
    )
# Need to add a promise to setup/update the network on change of data.
# therefore when the service returns... then update the network data
    $scope.dcNetwork.update = (data)->
      $scope.create(data)

# and means we need to create the network graph without data
# OR, we load the data in the graph object, based on cross filter selection
# and keep everything internal.
    $scope.create = (data)->
      $scope.dcNetworkChart = dc.networkGraph('#' + $scope.chartId)
      console.log "create Network chart"
      $scope.dcNetworkChart.
        width(element.width()).
        height($scope.height).
        margins({ top: 10, left: 50, right: 10, bottom: 50 }).
        dimension($scope.dcNetwork.dimension).
        group($scope.dcNetwork.sum).
        #data(data).
        title((d)->
          return 'node id:' + d.id
        ).
        render()
      return
    return