'use strict';
/* global
    dc, d3, crossfilter, _
    */
if (!dc || !d3 || !crossfilter || !_) {
    throw new Error('You need to load DC, D3, Crossfilter and Underscore library');
}

/**
## <a name="abstract-network-graph" href="#abstract-network-graph">#</a> Abstract Network Graph [Abstract] < [Color Chart](#color-chart)
An abstraction provides reusable functionalities for any chart that needs to visualize data using a network graph

This class provdes functions to get the network properties:
    node radius, colour, label text, other node properties?
    link width, colour
**/
dc.abstractNetworkGraph = function (_chart) {
    var _minRadiusWithLabel = 5;

    _chart.NETWORK_NODE_CLASS = 'drts-node';    // node group, including circle and label
    _chart.NETWORK_LINK_CLASS = 'drts-link';
    _chart.NETWORK_LABEL_CLASS = 'drts-label';
    _chart.NETWORK_CLASS = 'drts-network';
    _chart.MIN_RADIUS = 5;

    _chart = dc.colorChart(_chart);
    var _linkColor = dc.colorChart(_chart);

    _chart.renderLabel(true);
    _chart.renderTitle(false);

    var _rScale = d3.scale.linear();
    var _rDomain = ['min', 'max'];
    var _rDomainCalculated = [0,100];   // run calculateScales to update this value
    var _rRange = [7,12];
    var _r = _rScale.domain(_rDomainCalculated).range(_rRange);

    var _linkScale = d3.scale.linear();
    var _linkDomain = ['min', 'max'];
    var _linkDomainCalculated = [0,100];   // run calculateScales to update this value
    var _linkRange = [1.5,3];
    var _link = _linkScale.domain(_linkDomainCalculated).range(_linkRange);

    // replace this via radiusValueAccessor for a value that is no 'r'
    var _rValueAccessor = function (d) {
        return d.degree;
    };

    /**
    #### .r([nodeRadiusScale])
    Get or set node radius scale. By default network graph uses ```d3.scale.linear().domain([0, 100])``` as it's r scale .

    **/
    _chart.rScale = function (_) {
        if (!arguments.length) {return _rScale;}
        _rScale = _;
        return _chart;
    };
    /**
    #### .r([nodeRadiusScale])
    Get or set node radius scale. By default network graph uses ```d3.scale.linear().domain([0, 100])``` as it's r scale .

    **/
    _chart.rDomain = function (_) {
        if (!arguments.length) {
            return _rDomainCalculated;
        }
        _rDomain = _;
        return _chart;
    };

    _chart.rMin = function (domainData) {
        var min = d3.min(domainData, function (e) {
            return _chart.radiusValueAccessor()(e);
        });
        return min;
    };

    _chart.rMax = function (domainData) {
        var max = d3.max(domainData, function (e) {
            return _chart.radiusValueAccessor()(e);
        });
        return max;
    };


    _chart.calculateScales = function (nodeData, linkData) {
        var i, domain = [0,100];
        // calc radius domain
        for (i=0; i < 2; i++) {
            if (_rDomain[i] === 'min') {
                domain[i] = _chart.rMin(nodeData);
            } else if (_rDomain[i] === 'max') {
                domain[i] = _chart.rMax(nodeData);
            } else {
                domain[i] = _rDomain[i];
            }
        }
        _rDomainCalculated = domain;
        _chart.r(_rScale.domain(_rDomainCalculated).range(_rRange));


        // calc link width domain
        domain = [0,100];
        for (i=0; i < 2; i++) {
            if (_linkDomain[i] === 'min') {
                domain[i] = _chart.linkMin(linkData);
            } else if (_linkDomain[i] === 'max') {
                domain[i] = _chart.linkMax(linkData);
            } else {
                domain[i] = _linkDomain[i];
            }
        }
        _linkDomainCalculated = domain;
        _chart.link(_linkScale.domain(_linkDomainCalculated).range([1,3]));

        return _chart;
    };

    /**
    #### .r([nodeRadiusScale])
    Get or set node radius scale. By default network graph uses ```d3.scale.linear().domain([0, 100])``` as it's r scale .

    **/
    _chart.r = function (_) {
        if (!arguments.length) {return _r;}
        _r = _;
        return _chart;
    };

    /**
    #### .radiusValueAccessor([radiusValueAccessor])
    Get or set the radius value accessor function. The radius value accessor function if set will be used to retrieve data value
    for each and every node rendered. The data retrieved then will be mapped using r scale to be used as the actual node
    radius. In other words, this allows you to encode a data dimension using node size.

    **/
    _chart.radiusValueAccessor = function (_) {
        if (!arguments.length) { return _rValueAccessor; }
        _rValueAccessor = _;
        return _chart;
    };


    _chart.nodeR = function (d) {
        var value = _chart.radiusValueAccessor()(d);
        var r = _chart.r()(value);
        if (isNaN(r) || r <= _chart.MIN_RADIUS) {
            r = 0;
        }
        // maintain node size against zoom scale
        return r / d3.behavior.zoom().scale();    // need to get this from parent
    };

    var labelFunction = function (d) {
        return d.id;
        //return _chart.label()(d);
    };

    var labelOpacity = function (d) {
        return (_chart.nodeR(d) > _minRadiusWithLabel) ? 1 : 0;
    };

    _chart.doRenderLabel = function (nodeGEnter) {
        if (_chart.renderLabel()) {
            nodeGEnter.enter().append('text')
                    .attr('class', _chart.NETWORK_NODE_CLASS)
                    .attr('text-anchor', 'middle')
                    .attr('dy', '1.6em')
                    .on('click', _chart.onClick)
                    .attr('opacity', 0)
                    .text(labelFunction)
                    .attr('transform', 'translate(0,0)');
        } else {
            nodeGEnter.select('text').remove();
        }
    };

    _chart.doUpdateLabels = function (nodeGEnter, animate) {
        if (_chart.renderLabel()) {
            var labels = nodeGEnter
                .text(labelFunction);
            (animate ? dc.transition(labels, _chart.transitionDuration()) : labels)
                .attr('opacity', labelOpacity)
                .attr('transform', function(d) { return d.x ? 'translate(' + d.x + ',' + d.y + ')' : null; });
        }
    };

    var titleFunction = function (d) {
        return _chart.title()(d);
    };

    _chart.doRenderTitles = function (g) {
        if (_chart.renderTitle()) {
            var title = g.select('title');

            if (title.empty()) {
                g.append('title').text(titleFunction);
            }
        }
    };

    _chart.doUpdateTitles = function (g) {
        if (_chart.renderTitle()) {
            g.selectAll('title').text(titleFunction);
        }
    };

    /**
    #### .minRadiusWithLabel([radius])
    Get or set the minimum radius for label rendering. If a node's radius is less than this value then no label will be rendered.
    Default value: 10.

    **/
    _chart.minRadiusWithLabel = function (_) {
        if (!arguments.length) { return _minRadiusWithLabel; }
        _minRadiusWithLabel = _;
        return _chart;
    };

    _chart.initNodeColor = function (d, i) {
        this[dc.constants.NODE_INDEX_NAME] = i;
        return _chart.getColor(d, i);
    };

    _chart.updateNodeColor = function (d) {
        // a work around to get correct node index since
        return _chart.getColor(d, this[dc.constants.NODE_INDEX_NAME]);
    };

    _chart.fadeDeselectedArea = function () {
        if (_chart.hasFilter()) {
            _chart.selectAll('g.' + _chart.NETWORK_NODE_CLASS).each(function (d) {
                if (_chart.isSelectedNode(d)) {
                    _chart.highlightSelected(this);
                } else {
                    _chart.fadeDeselected(this);
                }
            });
        } else {
            _chart.selectAll('g.' + _chart.NETWORK_NODE_CLASS).each(function () {
                _chart.resetHighlight(this);
            });
        }
    };

    _chart.isSelectedNode = function (d) {
        return _chart.hasFilter(d.key);
    };

    // select node by key (id) and apply to filter/chart group
    _chart.onClick = function (d) {
        if (d3.event.defaultPrevented) {
            console.debug('click prevented');
            return; // ignore drag
        }
        var filter = d.id;
        console.debug('clicked on node:' + filter);
        dc.events.trigger(function () {
            _chart.filter(filter);
            dc.redrawAll(_chart.chartGroup());
        });
        _chart.plotData();
    };

    /**
      network link functions
    **/

    // replace this via linkValueAccessor for a value that is no 'r'
    var _linkValueAccessor = function (d) {
        return d.weight;
    };

    /**
    #### .r([nodeRadiusScale])
    Get or set node radius scale. By default network graph uses ```d3.scale.linear().domain([0, 100])``` as it's r scale .

    **/
    _chart.linkScale = function (_) {
        if (!arguments.length) {return _linkScale;}
        _linkScale = _;
        return _chart;
    };
    /**
    #### .r([nodeRadiusScale])
    Get or set node radius scale. By default network graph uses ```d3.scale.linear().domain([0, 100])``` as it's r scale .

    **/
    _chart.linkDomain = function (_) {
        if (!arguments.length) {
            return _linkDomain;
        }
        _linkDomain = _;
        return _chart;
    };

    _chart.link = function (_) {
        if (!arguments.length) {return _link;}
        _link = _;
        return _chart;
    };

    _chart.linkValueAccessor = function (_) {
        if (!arguments.length) { return _linkValueAccessor; }
        _linkValueAccessor = _;
        return _chart;
    };

    _chart.linkMin = function (domainData) {
        var min = d3.min(domainData, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return min;
    };

    _chart.linkMax = function (domainData) {
        var max = d3.max(domainData, function (e) {
            return _chart.linkValueAccessor()(e);
        });
        return max;
    };

    _chart.linkWidth = function (d) {
        var value = _chart.linkValueAccessor()(d);
        var link = _chart.link()(value);
        if (isNaN(link)) {
            link = 0;
        }
        // maintain node size against zoom scale
        return link / d3.behavior.zoom().scale();    // need to get this from parent
    };

    _chart.initLinkColor = function (d, i) {
        this[dc.constants.NODE_INDEX_NAME] = i;
        return _linkColor.getColor(d, i);
    };

    _chart.updateLinkColor = function (d, i) {
        this[dc.constants.NODE_INDEX_NAME] = i;
        return _linkColor.getColor(d, i);
    };

    return _chart;
};




/**
## <a name="network-graph" href="#network-graph">#</a> Network Graph [Concrete] < [Abstract Network Graph](#abstract-network-graph) < [CoordinateGrid Chart](#coordinate-grid-chart)
A concrete implementation of a general purpose network graph that allows data visualization using the following dimensions:

* x axis position
* y axis position
* node radius
* color

Examples:
* [Nasdaq 100 Index](http://nickqizhu.github.com/dc.js/)
* [US Venture Capital Landscape 2011](http://nickqizhu.github.com/dc.js/vc/index.html)

#### dc.networkGraph(parent[, chartGroup])
Create a network graph instance and attach it to the given parent element.

Parameters:
* parent : string - any valid d3 single selector representing typically a dom block element such as a div.
* chartGroup : string (optional) - name of the chart group this chart instance should be placed in. Once a chart is placed
     in a certain chart group then any interaction with such instance will only trigger events and redraw within the same
     chart group.

Return:
A newly created network graph instance

```js
// create a network graph under #chart-container1 element using the default global chart group
var networkGraph1 = dc.networkGraph("#chart-container1");
// create a network graph under #chart-container2 element using chart group A
var networkGraph2 = dc.networkGraph("#chart-container2", "chartGroupA");
```

**/
dc.networkGraph = function(parent, chartGroup) {
    var _chartBodyG; // chart svg
    var _nodeGroup, _linkGroup, _labelGroup, _nodes, _links, _labels; // d3 selectors
    var _layout = 'force';
    var _chart = dc.abstractNetworkGraph(dc.zoomableChart({}));
    var _nodeData, _linkData;
    //var _dispatch = d3.dispatch('click', 'select', 'forceStop', 'forceStart', 'zoom', 'drag');
    var _force = d3.layout.force();

    _chart.createChart = function() {
        if (!_chart._svg) {
            if (_chart.width()===100){
                console.error('Error width: ' + _chart.width() + 'happens when loading window not in focus');
            }
            _chart._svg = _chart.root().append('svg')
                .attr('width', _chart.width())
                .attr('height', _chart.height());

            _chartBodyG = _chart._svg.append('g').attr('class', 'chart-body')
                .attr('transform', 'translate(' + _chart.margins().left + ', ' + _chart.margins().top + ')');

            // place links first, under nodes
            _linkGroup = _chartBodyG.append('g').attr('class', 'chart-links');
            _nodeGroup = _chartBodyG.append('g').attr('class', 'chart-nodes');
            _labelGroup = _chartBodyG.append('g').attr('class', 'chart-texts');
        }
        return _chart;
    };

    _chart.doRender = function () {
        this.createChart();
        drawChart(_chart);

        return _chart;
    };

    function drawChart(_chart) {
        var data = !_data ? exampleData : _data;
        _chart.checkData(data); // creates _nodeData and _linkData
        _chart.plotData();
        layout();
    }

    function layout() {
        _chart.start(); // default layout is force directed. Calcs degree as 'weight' property
        if (_layout === 'rank') {
            _chart.stop();
            layoutRank();
        } else if (_layout === 'hierarchy') {
            _chart.stop();
            layoutHierarchy(); // tree based on direction of links (heads to tails)
        } else if (_layout === 'radial') {
            _chart.stop();
            layoutRadial();
        } else if (_layout === 'force') {
            _force.on('tick', _chart.tick);
            //test changing layout
            _force.on('end', function() { _layout = 'radial'; layout();});
        }
    }

    _chart.tick= function() {
        _chart.updatePositions();
    };

    _chart.updateData = function(data) {
        _chart.data(data);
        _chart.plotData();
    };

    var _data;
    _chart.data = function(data) {
        _data = data;
        _chart.checkData(data); // creates _nodeData and _linkData
    };

    var exampleData = {nodes:[{'id':1, 'label':'Revenue', 'degree': 2}, {'id':2, 'label': 'Profit', 'degree': 1}, {'id':3, 'label': 'Income', 'degree': 1}, {'id':4, 'label': 'Outgoings', 'degree': 1}, {'id':5, 'label': 'Assets', 'degree': 3}],
                       links:[{'id':0, 'source':1, 'target':2, 'weight': 3}, {'id':1, 'source':1, 'target':4, 'weight': 2}, {'id':2, 'source':3, 'target':5, 'weight': 5}]
                      };
    _chart.plotData = function() {

        //DATA BINDING
        _nodes = _nodeGroup.selectAll('g.' + _chart.NETWORK_NODE_CLASS).data(_nodeData, function(d){return d.id;});
        _links = _linkGroup.selectAll('.' + _chart.NETWORK_LINK_CLASS).data(_linkData, function(d){return d.id;});
        _labels = _labelGroup.selectAll('.' + _chart.NETWORK_NODE_CLASS).data(_nodeData, function(d){return d.id;});

        renderNodes(_nodes, _labels);    // including labels
        updateNodes(_nodes);
        removeNodes(_nodes);

        renderLinks(_links);
        updateLinks(_links);
        removeLinks(_links);

        _chart.fadeDeselectedArea();
        return _chart;
    };

    _chart.start = function() {
        startForce(_nodeData, _linkData);
        return _chart;
    };

    _chart.stop = function() {
        stopForce();
        return _chart;
    };

    // get the data and initialise positions and link data
    _chart.checkData = function(data) {
        _nodeData = data.nodes;
        _linkData = data.links ? data.links : data.edges;
        //console.table(_linkData);
        var toDelete = [];

        // for each link add source/target references
        for (var k=0; k < _linkData.length; k++) {
            var node, l = _linkData[k];
            // assume l.source is the id of the node, if not a reference
            if (typeof l.source !== 'object') {
                node = findWhere(_nodeData, {id:l.source});
                if (node !== undefined) {
                    l.source = node;
                } else {
                    console.error('link ' + l.id + ' source not found');
                    toDelete.push(l);
                    continue;
                }
            }
            if (typeof l.target !== 'object') {
                node = findWhere(_nodeData, {id:l.target});
                if (node !== undefined) {
                    l.target = node;
                } else {
                    console.error('link ' + l.id + ' target not found');
                    toDelete.push(l);
                    continue;
                }
            }
        }
        // find and remove erroneous elements
        for (var i=0; i < toDelete.length; i++){
            _linkData.splice( _linkData.indexOf(toDelete[i]), 1);
        }

        updateNodeData(_nodeGroup, _nodeData);
        _chart.calculateScales(_nodeData, _linkData);
        return _chart;
    };

    function findWhere(array, expression) {
        var getKeys = function(obj){
            var keys = [];
            for(var key in obj){
                keys.push(key);
            }
            return keys;
        };
        for (var i = 0, length = array.length; i < length; i++) {
            var element = array[i];
            var key = getKeys(expression)[0];
            // assume expression is an object with only one key
            if (element.hasOwnProperty(key) && element[key] === expression[key]) {
                return element;
            }
        }
        return undefined;
    }

    // copy attributes setup by d3 in force layout
    // see https://github.com/mbostock/d3/wiki/Force-Layout#nodes
    function updateNodeData(nodeGroup, nodes) {
        nodeGroup.selectAll(_chart.NETWORK_NODE_CLASS).each( function(d){
            var node = _.findWhere(nodes, {id:d.id});
            if (node) {
                node.index = d.index;
                node.x = d.x;
                node.y = d.y;
                node.px = d.px;
                node.py = d.py;
                node.fixed = d.fixed;
                node.weight = d.weight;
            }
        });
    }

    function dragstart() {
        _force.stop(); // stops the force auto positioning before you start dragging
    }

    function dragmove(d) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;  // TODO: limit moving nodes to within the bounds of the widget
        d.y += d3.event.dy;  // see one method http://bl.ocks.org/mbostock/1557377
        _chart.tick(); // this is the key to make it work together with updating both px,py,x,y on d !
    }

    function dragend(d) {
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        _chart.tick();
        //_force.resume();
    }

    var nodeDrag = d3.behavior.drag()
        .origin(function(d) { return d; })
        .on('dragstart', dragstart)
        .on('drag', dragmove)
        .on('dragend', dragend);

    function renderNodes(nodes, labels) {
        var networkGEnter = nodes.enter().append('g');

        networkGEnter
            .attr('class', _chart.NETWORK_NODE_CLASS)
            .call(nodeDrag) // this shoud be on the circle, but the drag event doesn't work because we translate
            .append('circle').attr('class', function(d, i) {
                return _chart.NETWORK_CLASS + ' _' + i;
            })
            .on('click', _chart.onClick)
            .on('mouseenter', mouseenter)
            .on('mouseleave', mouseleave)
            .attr('fill', _chart.initNodeColor)
            .attr('r', 0)
            .attr('opacity', 0);

        _chart.doRenderLabel(labels);
        _chart.doRenderTitles(networkGEnter);
    }

    function updateNodes(networkG, animate) {
        (animate ? dc.transition(networkG, _chart.transitionDuration()) : networkG)
            .selectAll('circle.' + _chart.NETWORK_CLASS)
            .attr('fill', _chart.updateNodeColor)
            .attr('r', function(d) {
                return _chart.nodeR(d);
            })
            .attr('opacity', function(d) {
                return (_chart.nodeR(d) > 0) ? 1 : 0;
            });

        _chart.doUpdateLabels(_labels, animate);
        _chart.doUpdateTitles(networkG);

        (animate ? dc.transition(networkG, _chart.transitionDuration()) : networkG)
            .attr('transform', function(d) { return d.x ? 'translate(' + d.x + ',' + d.y + ')' : null; });
    }

    function removeNodes(networkG) {
        networkG.exit().remove();
        _labels.exit().remove();
    }

    function renderLinks(links) {
        var enter = links.enter().append('line');
        enter
            .attr('class', _chart.NETWORK_LINK_CLASS)
            .attr('stroke', _chart.initLinkColor)
            .attr('stroke-width','0.5')
            .attr('x1', 0)
            .attr('y1', 0)
            .attr('x2', 0)
            .attr('y2', 0);
    }

    function updateLinks(links, animate) {
        (animate ? dc.transition(links, _chart.transitionDuration()) : links)
            .attr('stroke', _chart.updateLinkColor)
            .attr('stroke-width', _chart.linkWidth)
            .attr('x1', function(d) { return d.source.x ? d.source.x : 0; })
            .attr('y1', function(d) { return d.source.y ? d.source.y : 0; })
            .attr('x2', function(d) { return d.target.x ? d.target.x : 0; })
            .attr('y2', function(d) { return d.target.y ? d.target.y : 0; });
    }

    function removeLinks(links) {
        links.exit().remove();
    }


    function startForce(nodes, links) {
        _force = d3.layout.force()
            //.on('end', function(){ _dispatch.forceStop();})
            //.on('start', function() { _dispatch.forceStart();})
            .size([_chart.width(), _chart.height()])
            .nodes(nodes)
            .links(links)
            .linkDistance(80)
            .gravity(0.8)
            .charge(-1000);
        _force.start();
    }

    function stopForce() {
        _force.stop();
    }

    _chart.updatePositions = function(animate) {
        updateNodes(_nodes, animate);
        updateLinks(_links, animate);
    };

    _chart.renderBrush = function(g) {
        // override default x axis brush from parent chart
    };

    _chart.redrawBrush = function(g) {
        // override default x axis brush from parent chart
        _chart.fadeDeselectedArea();
    };

    // handle events d3 mouseenter, mouseleave

    // mouse over, focus on this node, connected links, and dim others
    function mouseenter( node ) {
        var id = node.id;
        console.debug('mouseenter ' + id);
    }

    function mouseleave( node ) {
        var id = node.id;
        console.debug('mouseleave ' + id);
    }

    function layoutRank() {
        var rankedData = rankNodes(_nodeData, _linkData, 'degree');
        _nodeData = rankedData.visible.nodes;
        _linkData = rankedData.visible.links;
        _chart.plotData(); // redraw based on filtered data
        // position as ranked tree, each row sharing same rank value
    }

    function layoutHierarchy() {
        var rankedData = hierarchyNodes(_nodeData, _linkData);
        _nodeData = rankedData.visible.nodes;
        _linkData = rankedData.visible.links;
        // position as head to tail tree
        _chart.updatePositions(true);
    }

    function layoutRadial() {
        var rankedData = rankNodes(_nodeData, _linkData, 'degree');
        _nodeData = rankedData.visible.nodes;
        _linkData = rankedData.visible.links;
        var circularRadius = 100;
        var c = {x: _chart.width() / 2, y: _chart.height() / 2}; //center
        var r = circularRadius; //radius
        var n = _nodeData.length;

        //computing node position
        for (var i = 0; i < n; i++) {
            var currentNode = _nodeData[i]; //current node
            var angle = i * 2 * Math.PI / n;
            currentNode.x = c.x + Math.cos(angle) * r;
            currentNode.y = c.y + Math.sin(angle) * r;
        }

        _chart.updatePositions(true);
    }

    function planarArray(object) {
        var array = [];
        for (var k in object) {
            array.push(object[k]);
        }
        return array;
    }

    // create the hierarchical tree based on 'rank' in the data
    // define num_nodes as the maximum number of nodes to show, from top hierarchy down.
    // if num_nodes === undefined then all nodes will be shown
    function rankNodes(nodeData, linkData, rank, numNodes) {
        if (!rank) {
            throw new Error('Specify rank using the name of a node attribute');
        }
        var nodes = planarArray(nodeData);  //function uses non associative arrays
        var links = planarArray(linkData);
        var i;

        var nodesVisible = [];
        var edgesVisible = [];
        var nodesHidden = [];
        var edgesHidden = [];

        //adding visible attribute (false on default)
        for (i = 0; i < nodes.length; i++) {
            nodes[i].visible = false;
        }
        for (i = 0; i < links.length; i++) {
            links[i].visible = false;
        }

        nodes.sort(function(a, b) {
            return b[rank] - a[rank];
        }); //sorting vertices by weight (descending).

        if (!numNodes) {
            numNodes = nodes.length;
        }
        for (i = 0; i < nodes.length; i++) {  //setting visible nodes
            var n = nodes[i];  //current node
            if (i < numNodes) {
                n.visible = true;
                nodesVisible.push(n);
            }
            else {
                nodesHidden.push(n);
            }
        }

        for (i = 0; i < links.length; i++) {
            var e = links[i];  //current edge
            if (e.source.visible && e.target.visible) {
                e.visible = true;
                edgesVisible.push(e);
            }
            else {
                edgesHidden.push(e);
            }
        }

        return {//returning 2 objects of planar arrays
            visible: {
                nodes: nodesVisible,
                links: edgesVisible
            },
            hidden: {
                nodes: nodesHidden,
                links: edgesHidden
            }
        };
    }

    return _chart.anchor(parent, chartGroup);
};