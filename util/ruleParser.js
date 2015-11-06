/**
 * Created by sdiemert on 2015-11-05.
 */

var xml2js = require('xml2js');
var fs     = require('fs');
var util   = require('util');

var f = fs.readFileSync("/Users/sdiemert/workspace/gtjs/sandbox/groove/testGrammar.gps/addBox.gpr", 'utf-8');

var ruleGraph = {name: 'M', nodes: [], edges: []};


xml2js.parseString(f, function (err, result) {
    console.log(err);
    console.log(util.inspect(result, false, null));

    // loop through all nodes and find properties (type) for each one.

    var tmpNode = {type: null, new: false};

    var nodes = result.gxl.graph[0].node;
    var edges = result.gxl.graph[0].edge;

    var nId = null, val = null;

    for (var n = 0; n < nodes.length; n++) {

        tmpNode = {type: null, new: false};

        nId = nodes[n]['$']['id'];

        for (var e = 0; e < edges.length; e++) {

            if (edges[e]['$'].from === nId && edges[e]['$'].to === nId) {

                val = edges[e].attr[0].string[0].split(":");

                if (val[0] === 'type') {
                    tmpNode.type = val[1];
                } else if (val[0] === 'new') {
                    tmpNode.new = true;
                }

            }

        }

        ruleGraph.nodes.push(tmpNode)

    }

    var from = null, to = null, tmpVal = null;

    for (var e = 0; e < edges.length; e++) {

        tmpVal = {type : null, new : false};

        to   = edges[e]['$'].to;
        from = edges[e]['$'].from;

        //check for edges connecting nodes.

        if (from !== to) {

            //get the indices
            to   = to.slice(1);
            from = from.slice(1);

            val = edges[e].attr[0].string[0].split(":");

            if (val[0] === 'type') {
                tmpVal.type = val[1];
            } else if (val[0] === 'new') {
                tmpVal.new = true;
            }

            ruleGraph.edges.push({
                end1 : parseInt(from),
                end2 : parseInt(to),
                direction: 1,
                value : tmpVal
            });

        }

    }

    console.log(util.inspect(ruleGraph,false,null));
    console.log(JSON.stringify(ruleGraph));

});


