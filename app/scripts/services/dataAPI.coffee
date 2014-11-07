"use strict"

# Need to add the Dashboard ID to the data and screen requests
# we may need to make the data request use POST to pass the current selection

angular.module('angularDcjsApp').

service "dataAPI", ($http, $q)->
  @getData = (id)->
    id = if id then id else '3'
    return $http.get('sampledata' + id + '.json')

  @getScreenParams = (id)->
    id = if id then id else '3'
    return $http.get('screen' + id + '.json')

  # param network may contain full URL, or relative to current
  @getNetwork = (network)->
    return $http.get(network)
  return