'use strict'

angular.module('angularDcjsApp', ['ngRoute', 'gridster', 'dcModule',
  'PivotTable', 'ui.select2'])

.config ($routeProvider)->
  $routeProvider
  .when('/', controller:'MainController', templateUrl:'views/main.html')
  .otherwise(redirectTo: '/')