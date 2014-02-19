"use strict"

angular.module('dcModule.templates',[]).
run(($templateCache)->
  $templateCache.put "dc/line/template.html",
    "<div id='{{ chartId }}' class='line-chart'>"+
    "<div>"+
    "<select ng-show='dimFilters' name='dimensions' ng-model='dimFilter' ng-change='setMetrics()' ng-options='item as item for item in dimFilters'>" +
    "</select>" +
    "</div>"+
    "<div>"+
    "<select ng-show='measureFilters' name='measures' ng-model='measureFilter' ng-change='setMetrics()' ng-options='item as item for item in measureFilters'>" +
    "</select>" +
    "</div>"+
    "</div>"

  $templateCache.put "dc/pie/template.html",
    "<div id='{{ chartId }}' class='pie-chart'>"+
    "<select ng-show='dimFilters' name='dimensions' ng-model='dimFilter' ng-change='setMetrics()' ng-options='item as item for item in dimFilters'>" +
    "</select>" +
    "<select ng-show='measureFilters' name='measures' ng-model='measureFilter' ng-change='setMetrics()' ng-options='item as item for item in measureFilters'>" +
    "</select>" +
    "</div>"

  return
)