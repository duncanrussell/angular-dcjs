"use strict"

describe "Controller:MainController", ()->
  $controller = undefined
  $rootScope = undefined
  $scope = undefined
  Debug = undefined
  $httpBackend = undefined
  dataAPI = undefined
  dataResponse = undefined
  MainController = undefined

  beforeEach( ()->
    module('angularDcjsApp')
  )

  beforeEach( ()->
    inject(($injector, _Debug_, _dataAPI_)->
      Debug = _Debug_
      dataAPI = _dataAPI_
      $rootScope = $injector.get('$rootScope')
      $scope = $rootScope.$new()
      $controller = $injector.get('$controller')
      $httpBackend = $injector.get('$httpBackend')
      dataResponse = [
        {"DATETIME:date":"9/27/13","MEASURE:Units":1,"MEASURE:Royalty Price":3.49,"MEASURE:Customer Price":4.99,"DIMENSION:Vendor Identifier":"0144_20121109","DIMENSION:Title":"Headh","DIMENSION:Label/Studio/Network":"Yello","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"5.02E+09","DIMENSION:Postal Code":"49915-2504","DIMENSION:Customer Identifier":2240000173,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"CL","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"HD"},
        {"DATETIME:date":"9/24/13","MEASURE:Units":1,"MEASURE:Royalty Price":1.39,"MEASURE:Customer Price":1.99,"DIMENSION:Vendor Identifier":"0099_20120827","DIMENSION:Title":"A Ond","DIMENSION:Label/Studio/Network":"Const","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"2.03E+09","DIMENSION:Postal Code":"29284-3466","DIMENSION:Customer Identifier":1642627348,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"BR","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"SD"},
        {"DATETIME:date":"9/29/13","MEASURE:Units":1,"MEASURE:Royalty Price":3.49,"MEASURE:Customer Price":4.99,"DIMENSION:Vendor Identifier":"0144_20121109","DIMENSION:Title":"Headh","DIMENSION:Label/Studio/Network":"Yello","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"5.70E+09","DIMENSION:Postal Code":"26586-2424","DIMENSION:Customer Identifier":4967191007,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"CO","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"HD"},
        {"DATETIME:date":"9/28/13","MEASURE:Units":1,"MEASURE:Royalty Price":2.79,"MEASURE:Customer Price":3.99,"DIMENSION:Vendor Identifier":"0144_20121109","DIMENSION:Title":"Headh","DIMENSION:Label/Studio/Network":"Yello","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"3.05E+09","DIMENSION:Postal Code":"23322-2800","DIMENSION:Customer Identifier":3573922889,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"CL","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"SD"},
        {"DATETIME:date":"9/23/13","MEASURE:Units":1,"MEASURE:Royalty Price":2.09,"MEASURE:Customer Price":2.99,"DIMENSION:Vendor Identifier":"0211_20132108","DIMENSION:Title":"AlÃŒÂ©m","DIMENSION:Label/Studio/Network":"Wakin","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"4.34E+09","DIMENSION:Postal Code":"18509-2108","DIMENSION:Customer Identifier":4368359068,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"BR","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"HD"},
        {"DATETIME:date":"9/28/13","MEASURE:Units":1,"MEASURE:Royalty Price":1.39,"MEASURE:Customer Price":1.99,"DIMENSION:Vendor Identifier":"0145_20121109","DIMENSION:Title":"Habem","DIMENSION:Label/Studio/Network":"Sache","DIMENSION:Product Type Identifier":"D","DIMENSION:Order Id":"3.77E+09","DIMENSION:Postal Code":"16346-1910","DIMENSION:Customer Identifier":4481458708,"DIMENSION:Sale/Return":"S","DIMENSION:Customer Currency":"USD","DIMENSION:Country Code":"BR","DIMENSION:Royalty Currency":"USD","DIMENSION:Asset/Content Flavor":"SD"}
      ]
      dataResponse2 = {
        "name": "Charts",
        "gridster": {
          "options": {
            "minRows": 2,
            "maxRows": 5,
            "columns": 3,
            "colWidth": "auto",
            "rowHeight": "match",
            "margins": [20, 20],
            "draggable": {
              "enabled": true
            },
            "resizable": {
              "enabled": false
            }
          },
          "blocks": [
            {
              "gridster" : {
                "sizeX": 2,
                "sizeY": 1,
                "row": 0,
                "col": 0
              },
              "indexBy":{
                "dimension": "DATETIME:date",
                "sum": "MEASURE:Customer Price"
              },
              "id": "grid1",
              "type":"dc-line",
              "brush": false,
              "dimension": {},
              "sum": {}
            },
            {
              "gridster" : {
                "sizeX": 2,
                "sizeY": 1,
                "row": 0,
                "col": 0
              },
              "id": "grid2",
              "type":"dc-compose",
              "indexBy":{
                "dimension": "DATETIME:date",
                "sum": "DIMENSION:Asset/Content Flavor"
              },
              "stack": ["HD","SD"],
              "dimension": {},
              "sum": {}
            },
            {
              "gridster" : {
                "sizeX": 1,
                "sizeY": 1,
                "row": 1,
                "col": 0
              },
              "id": "grid3",
              "type":"dc-pie",
              "indexBy":{
                "dimension": "DIMENSION:Country Code",
                "sum": "MEASURE:Units"
              },
              "dimension": {},
              "sum": {}
            },
            {
              "gridster" : {
                "sizeX": 1,
                "sizeY": 1,
                "row": 1,
                "col": 1
              },
              "id": "grid4",
              "type":"dc-pie",
              "indexBy":{
                "dimension": "DIMENSION:Title",
                "sum": "MEASURE:Units"
              },
              "dimension": {},
              "sum": {}
            },
            {
              "gridster" : {
                "sizeX": 1,
                "sizeY": 1,
                "row": 1,
                "col": 2
              },
              "id": "grid5",
              "type":"dc-pie",
              "indexBy":{
                "dimension": "DIMENSION:Asset/Content Flavor",
                "sum": "MEASURE:Customer Price"
              },
              "dimension": {},
              "sum": {}
            }
          ]
        }
      }
      $scope.sourceData = dataResponse
      $scope.screen = dataResponse2

      MainController = $controller('MainController', {'$rootScope':$rootScope,'$scope':$scope, 'Debug': Debug})
      return
    )
    return
  )

  afterEach( ()->
    $httpBackend.verifyNoOutstandingExpectation()
    $httpBackend.verifyNoOutstandingRequest()
  )

  it "Debug should be loaded", ()->
    expect(Debug).not.toBeNull

  it "DataAPI should be loaded", ()->
    expect(dataAPI).not.toBeNull

  it "should call retrieveData", ()->
    spyOn($scope,'retrieveData').andCallThrough()
    $scope.retrieveData()
    expect($scope.retrieveData).toHaveBeenCalled()

  it "should call getScreenParams", ()->
    spyOn($scope,'getScreenParams').andCallThrough()
    $scope.getScreenParams()
    expect($scope.getScreenParams).toHaveBeenCalled()

  it "should see check response screen data",()->
    expect($scope.screen).not.toBeNull

  it "should call setScreenData", ()->
    spyOn($scope,'setScreenData').andCallThrough()
    $scope.rows = crossfilter(dataResponse)
    $scope.setScreenData()
    expect($scope.setScreenData).toHaveBeenCalled()

  it "should call createStructure", ()->
    spyOn($scope,'createStructure').andCallThrough()
    $scope.rows = crossfilter(dataResponse)
    $scope.createStructure($scope.screen.gridster.blocks[1])
    expect($scope.createStructure).toHaveBeenCalled()

  it "should see check response data",()->
    expect($scope.sourceData).not.toBeNull

  it "should call render",()->
    expect($scope.render).not.toBeNull
    spyOn($scope,'render').andCallThrough()
    $scope.render()
    expect($scope.render).toHaveBeenCalled()

  it "should format dates", ()->
    dataResponse.forEach((d)->
      d['DATETIME:date'] = d3.time.format("%m/%d/%Y").parse(d['DATETIME:date'])
      expect(d['DATETIME:date']).not.ToBeNull
    )

  it "should populate sourceData", ()->
    expect($scope.sourceData).toEqual jasmine.any(Object)


  it "should call render",()->
    spyOn($scope,'render').andCallThrough()
    $scope.render()
    expect($scope.render).toHaveBeenCalled()

  it "should populate lineChartDim", ()->
    $scope.rows = crossfilter(dataResponse)
    $scope.lineChartDim = $scope.rows.dimension((d)->
      return d['DATETIME:date']
    )
    expect($scope.lineChartDim).toEqual jasmine.any(Object)

  it "should populate composeChartDim", ()->
    $scope.rows = crossfilter(dataResponse)
    $scope.composeChartDim = $scope.rows.dimension((d)->
      return d['DATETIME:date']
    )
    expect($scope.composeChartDim).toEqual jasmine.any(Object)

  it "should populate linePieDim", ()->
    $scope.rows = crossfilter(dataResponse)
    $scope.linePieDim = $scope.rows.dimension((d)->
      return d['DIMENSION:Asset/Content Flavor']
    )
    expect($scope.linePieDim).toEqual jasmine.any(Object)

  it "should call setChartDim", ()->
    $scope.rows = crossfilter(dataResponse)
    $scope.lineChartDim = $scope.rows.dimension((d)->
      return d['DATETIME:date']
    )
    $scope.pieChartDim = $scope.rows.dimension((d)->
      return d['DIMENSION:Asset/Content Flavor']
    )
    $scope.composeChartDim = $scope.rows.dimension((d)->
      return d['DATETIME:date']
    )
    spyOn($scope,'setChartDim').andCallThrough()
    $scope.setChartDim()
    expect($scope.setChartDim).toHaveBeenCalled()

  it "should call identifyHeaders", ()->
    spyOn($scope,'identifyHeaders').andCallThrough()
    $scope.identifyHeaders()
    expect($scope.identifyHeaders).toHaveBeenCalled()

  it "should call getParams", ()->
    spyOn($scope,'getParams').andCallThrough()
    $scope.getParams()
    expect($scope.getParams).toHaveBeenCalled()

  it "should call log for Measures", ()->
    spyOn(Debug,'input').andCallThrough()
    Debug.input()
    expect(Debug.input).toHaveBeenCalled()

  it "should call getParams", ()->
    spyOn($scope,'getParams').andCallThrough()
    $scope.getParams()
    expect($scope.getParams).toHaveBeenCalled()

  it "should call log for Dimensions", ()->
    spyOn(Debug,'input').andCallThrough()
    Debug.input()
    expect(Debug.input).toHaveBeenCalled()

  it "should add an input value", ()->
    spyOn(Debug, 'input').andCallThrough()
    Debug.input('Test')
    expect(Debug.input).toHaveBeenCalled()

  it "should call output and get more than one item in array", ()->
    spyOn(Debug, 'output').andCallThrough()
    expect(Debug.output().length).toBe > 0
    expect(Debug.output).toHaveBeenCalled()