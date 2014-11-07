"use strict"
if not dc or not d3 or not crossfilter or not _
	throw new Error('You need to load Pivot')

angular.module('PivotTable',[]).

directive "pivotTable", ()->
	restrict: 'AC'
	scope:
		data: '='
		pivotTable: '='
	template: '<div></div>'
	link: ($scope, element, attrs)->

		$scope.create = ()->
			element.pivotUI($scope.data)

		$scope.$watch('data',(data)->
			$scope.create()
		)


