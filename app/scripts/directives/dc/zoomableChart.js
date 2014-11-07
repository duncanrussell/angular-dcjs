'use strict';
/* global
    dc, d3, crossfilter, _
    */
if (!dc || !d3 || !crossfilter || !_) {
    throw new Error('You need to load DC, D3, Crossfilter and Underscore library');
}

/**
## zoomable functions extracted from Coordinate Grid Mixin for use in 
   network graph
Includes: [Color Mixin](#color-mixin), [Margin Mixin](#margin-mixin), [Base Mixin](#base-mixin)

**/
dc.zoomableChart = function (_chart) {

    // use DC
    _chart = dc.colorChart(dc.marginable(dc.baseChart(_chart)));
    // dc default colour scale
    _chart.colors(d3.scale.category10());

    // TODO: adapt this function for network zooming using zoom.scale zoom.scaleExtent
    // define the zoom variable for this graph
    function zoomHandler () {
        _refocused = true;
        if (_zoomOutRestrict) { // use zoom extent
            _chart.x().domain(constrainRange(_chart.x().domain(), _xOriginalDomain));
            if (_rangeChart) {
                _chart.x().domain(constrainRange(_chart.x().domain(), _rangeChart.x().domain()));
            }
        }

        var domain = _chart.x().domain();
        var domFilter = dc.filters.RangedFilter(domain[0], domain[1]);

        _chart.replaceFilter(domFilter);
        _chart.rescale();
        _chart.redraw();

        if (_rangeChart && !rangesEqual(_chart.filter(), _rangeChart.filter())) {
            dc.events.trigger(function () {
                _rangeChart.replaceFilter(domFilter);
                _rangeChart.redraw();
            });
        }

        _chart._invokeZoomedListener();

        dc.events.trigger(function () {
            _chart.redrawGroup();
        }, dc.constants.EVENT_DELAY);

        _refocused = !rangesEqual(domain, _xOriginalDomain);
    }

    var _parent;
    var _g;
    var _chartBodyG;

    var _brush = d3.svg.brush();
    var _brushOn = true;
    var _round;

    var _refocused = false;
    var _unitCount;

    var _zoomScale = [1, Infinity];
    var _zoomOutRestrict = true;

    var _zoom = d3.behavior.zoom().on('zoom', zoomHandler);
    var _nullZoom = d3.behavior.zoom().on('zoom', null);
    var _hasBeenMouseZoomable = false;

    var _rangeChart;
    var _focusChart;

    var _mouseZoomable = false;

    var _outerRangeBandPadding = 0.5;
    var _rangeBandPadding = 0;

    _chart.rescale = function () {
        _unitCount = undefined;
    };

    /**
    #### .rangeChart([chart])
    Get or set the range selection chart associated with this instance. Setting the range selection
    chart using this function will automatically update its selection brush when the current chart
    zooms in. In return the given range chart will also automatically attach this chart as its focus
    chart hence zoom in when range brush updates. See the [Nasdaq 100
    Index](http://dc-js.github.com/dc.js/) example for this effect in action.

    **/
    _chart.rangeChart = function (_) {
        if (!arguments.length) {
            return _rangeChart;
        }
        _rangeChart = _;
        _rangeChart.focusChart(_chart);
        return _chart;
    };

    /**
    #### .zoomScale([extent])
    Get or set the scale extent for mouse zooms.

    **/
    _chart.zoomScale = function (_) {
        if (!arguments.length) {
            return _zoomScale;
        }
        _zoomScale = _;
        return _chart;
    };

    /**
    #### .zoomOutRestrict([true/false])
    Get or set the zoom restriction for the chart. If true limits the zoom to origional domain of the chart.
    **/
    _chart.zoomOutRestrict = function (r) {
        if (!arguments.length) {
            return _zoomOutRestrict;
        }
        _zoomScale[0] = r ? 1 : 0;
        _zoomOutRestrict = r;
        return _chart;
    };

    _chart.zoomFactor = function(factor) {
        var scale = d3.behavior.zoom().scale();
        var extent = d3.behavior.zoom().scaleExtent();
        var newScale = scale * factor;

        if (extent[0] <= newScale && newScale <= extent[1]) {
            var translate = d3.behavior.zoom().translate();
            var c = [_chart.width(), _chart.height()];
            d3.behavior.zoom().scale(newScale)
            .translate( [c[0] + (translate[0] - c[0])/ scale * newScale,
                c[1] + (translate[1] - c[1])/ scale * newScale])
            .event( _chart._g.transition().duration(750));
        }
    };

    _chart.zoomGraph = function(selector) {
        var selectArea = selector.getBBox();
        var aWidth = selectArea.width();
        var aHeight = selectArea.height();
        var factor = Math.max(aWidth/_chart.width(), aHeight/_chart.height());
        _chart.zoomFactor(factor);
    };

    _chart._generateG = function (parent) {
        if (parent === undefined) {
            _parent = _chart.svg();
        } else {
            _parent = parent;
        }

        // set up zoom and background click events
        _parent.call(_zoom);
        _parent.append('rect')
        .on('click', function(e){
            if (!d3.event.defaultPrevented()){
                // overridable background function
                _chart.backgroundClicked(e);
            }
        });

        _g = _parent.append('g');

        _chartBodyG = _g.append('g').attr('class', 'chart-body')
            .attr('transform', 'translate(' + _chart.margins().left + ', ' + _chart.margins().top + ')');

        return _g;
    };

    _chart.backgroundClicked = function(e) {
        // override this function to act on clicking on chart background
    };

    /**
    #### .g([gElement])
    Get or set the root g element. This method is usually used to retrieve the g element in order to
    overlay custom svg drawing programatically. **Caution**: The root g element is usually generated
    by dc.js internals, and resetting it might produce unpredictable result.

    **/
    _chart.g = function (_) {
        if (!arguments.length) {
            return _g;
        }
        _g = _;
        return _chart;
    };

    /**
    #### .mouseZoomable([boolean])
    Set or get mouse zoom capability flag (default: false). When turned on the chart will be
    zoomable using the mouse wheel. If the range selector chart is attached zooming will also update
    the range selection brush on the associated range selector chart.

    **/
    _chart.mouseZoomable = function (z) {
        if (!arguments.length) {
            return _mouseZoomable;
        }
        _mouseZoomable = z;
        return _chart;
    };

    /**
    #### .chartBodyG()
    Retrieve the svg group for the chart body.
    **/
    _chart.chartBodyG = function (_) {
        if (!arguments.length) {
            return _chartBodyG;
        }
        _chartBodyG = _;
        return _chart;
    };




    /**
    #### .round([rounding function])
    Set or get the rounding function used to quantize the selection when brushing is enabled.
    ```js
    // set x unit round to by month, this will make sure range selection brush will
    // select whole months
    chart.round(d3.time.month.round);
    ```

    **/
    _chart.round = function (_) {
        if (!arguments.length) {
            return _round;
        }
        _round = _;
        return _chart;
    };

    _chart._rangeBandPadding = function (_) {
        if (!arguments.length) {
            return _rangeBandPadding;
        }
        _rangeBandPadding = _;
        return _chart;
    };

    _chart._outerRangeBandPadding = function (_) {
        if (!arguments.length) {
            return _outerRangeBandPadding;
        }
        _outerRangeBandPadding = _;
        return _chart;
    };

    dc.override(_chart, 'filter', function (_) {
        if (!arguments.length) {
            return _chart._filter();
        }

        _chart._filter(_);

        if (_) {
            _chart.brush().extent(_);
        } else {
            _chart.brush().clear();
        }

        return _chart;
    });

    _chart.brush = function (_) {
        if (!arguments.length) {
            return _brush;
        }
        _brush = _;
        return _chart;
    };

    _chart.renderBrush = function (g) {
        if (_brushOn) {
            _brush.on('brush', _chart._brushing);
            _brush.on('brushstart', _chart._disableMouseZoom);
            _brush.on('brushend', configureMouseZoom);

            var gBrush = g.append('g')
                .attr('class', 'brush')
                .attr('transform', 'translate(' + _chart.margins().left + ',' + _chart.margins().top + ')')
                .call(_brush.x(_chart.x()));
            _chart.setBrushY(gBrush);
            _chart.setHandlePaths(gBrush);

            if (_chart.hasFilter()) {
                _chart.redrawBrush(g);
            }
        }
    };

    _chart.setHandlePaths = function (gBrush) {
        gBrush.selectAll('.resize').append('path').attr('d', _chart.resizeHandlePath);
    };

    _chart.extendBrush = function () {
        var extent = _brush.extent();
        if (_chart.round()) {
            extent[0] = extent.map(_chart.round())[0];
            extent[1] = extent.map(_chart.round())[1];

            _g.select('.brush')
                .call(_brush.extent(extent));
        }
        return extent;
    };

    _chart.brushIsEmpty = function (extent) {
        return _brush.empty() || !extent || extent[1] <= extent[0];
    };

    _chart._brushing = function () {
        var extent = _chart.extendBrush();

        _chart.redrawBrush(_g);

        if (_chart.brushIsEmpty(extent)) {
            dc.events.trigger(function () {
                _chart.filter(null);
                _chart.redrawGroup();
            }, dc.constants.EVENT_DELAY);
        } else {
            var rangedFilter = dc.filters.RangedFilter(extent[0], extent[1]);

            dc.events.trigger(function () {
                _chart.replaceFilter(rangedFilter);
                _chart.redrawGroup();
            }, dc.constants.EVENT_DELAY);
        }
    };

    _chart.redrawBrush = function (g) {
        if (_brushOn) {
            if (_chart.filter() && _chart.brush().empty()) {
                _chart.brush().extent(_chart.filter());
            }

            var gBrush = g.select('g.brush');
            gBrush.call(_chart.brush().x(_chart.x()));
            _chart.setBrushY(gBrush);
        }

        _chart.fadeDeselectedArea();
    };

    _chart.fadeDeselectedArea = function () {
        // do nothing, sub-chart should override this function
    };

    // borrowed from Crossfilter example
    _chart.resizeHandlePath = function (d) {
        var e = +(d === 'e'), x = e ? 1 : -1, y = brushHeight() / 3;
        /*jshint -W014 */
        return 'M' + (0.5 * x) + ',' + y
            + 'A6,6 0 0 ' + e + ' ' + (6.5 * x) + ',' + (y + 6)
            + 'V' + (2 * y - 6)
            + 'A6,6 0 0 ' + e + ' ' + (0.5 * x) + ',' + (2 * y)
            + 'Z'
            + 'M' + (2.5 * x) + ',' + (y + 8)
            + 'V' + (2 * y - 8)
            + 'M' + (4.5 * x) + ',' + (y + 8)
            + 'V' + (2 * y - 8);
        /*jshint +W014 */
    };

    _chart._preprocessData = function () {};

    _chart._doRender = function () {
        _chart.resetSvg();

        _chart._preprocessData();

        _chart._generateG();

        drawChart(true);

        configureMouseZoom();

        return _chart;
    };

    _chart._doRedraw = function () {
        _chart._preprocessData();

        drawChart(false);

        return _chart;
    };

    function drawChart (render) {
        if (_chart.isZoomable()) {
            _brushOn = false;
        }

        _chart.plotData();

        if (render) {
            _chart.renderBrush(_chart.g());
        } else {
            _chart.redrawBrush(_chart.g());
        }
    }

    function configureMouseZoom () {
        if (_mouseZoomable) {
            _chart._enableMouseZoom();
        }
        else if (_hasBeenMouseZoomable) {
            _chart._disableMouseZoom();
        }
    }

    _chart._enableMouseZoom = function () {
        _hasBeenMouseZoomable = true;
        _zoom.x(_chart.x())
            .scaleExtent(_zoomScale)
            .size([_chart.width(), _chart.height()]);
        _chart.root().call(_zoom);
    };

    _chart._disableMouseZoom = function () {
        _chart.root().call(_nullZoom);
    };

    function constrainRange(range, constraint) {
        var constrainedRange = [];
        constrainedRange[0] = d3.max([range[0], constraint[0]]);
        constrainedRange[1] = d3.min([range[1], constraint[1]]);
        return constrainedRange;
    }

    /**
    #### .focus([range])
    Zoom this chart to focus on the given range. The given range should be an array containing only
    2 elements (`[start, end]`) defining a range in the x domain. If the range is not given or set
    to null, then the zoom will be reset. _For focus to work elasticX has to be turned off;
    otherwise focus will be ignored._
    ```js
    chart.renderlet(function(chart){
        // smooth the rendering through event throttling
        dc.events.trigger(function(){
            // focus some other chart to the range selected by user on this chart
            someOtherChart.focus(chart.filter());
        });
    })
    ```

    **/
    _chart.focus = function (range) {
        if (hasRangeSelected(range)) {
            _chart.x().domain(range);
        } else {
            _chart.x().domain(_xOriginalDomain);
        }

        _zoom.x(_chart.x());
        zoomHandler();
    };

    _chart.refocused = function () {
        return _refocused;
    };

    _chart.focusChart = function (c) {
        if (!arguments.length) {
            return _focusChart;
        }
        _focusChart = c;
        _chart.on('filtered', function (chart) {
            if (!chart.filter()) {
                dc.events.trigger(function () {
                    _focusChart.x().domain(_focusChart.xOriginalDomain());
                });
            } else if (!rangesEqual(chart.filter(), _focusChart.filter())) {
                dc.events.trigger(function () {
                    _focusChart.focus(chart.filter());
                });
            }
        });
        return _chart;
    };

    function rangesEqual(range1, range2) {
        if (!range1 && !range2) {
            return true;
        }
        else if (!range1 || !range2) {
            return false;
        }
        else if (range1.length === 0 && range2.length === 0) {
            return true;
        }
        else if (range1[0].valueOf() === range2[0].valueOf() &&
            range1[1].valueOf() === range2[1].valueOf()) {
            return true;
        }
        return false;
    }

    /**
    #### .brushOn([boolean])
    Turn on/off the brush-based range filter. When brushing is on then user can drag the mouse
    across a chart with a quantitative scale to perform range filtering based on the extent of the
    brush, or click on the bars of an ordinal bar chart or slices of a pie chart to filter and
    unfilter them. However turning on the brush filter will disable other interactive elements on
    the chart such as highlighting, tool tips, and reference lines. Zooming will still be possible
    if enabled, but only via scrolling (panning will be disabled.) Default: true

    **/
    _chart.brushOn = function (_) {
        if (!arguments.length) {
            return _brushOn;
        }
        _brushOn = _;
        return _chart;
    };

    function hasRangeSelected(range) {
        return range instanceof Array && range.length > 1;
    }

    return _chart;
};
