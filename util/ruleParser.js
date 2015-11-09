/**
 * Created by sdiemert on 2015-11-05.
 */

var xml2js = require('xml2js');
var fs     = require('fs');
var util   = require('util');

//var f = fs.readFileSync("/Users/sdiemert/workspace/gtjs/sandbox/groove/testGrammar.gps/addBox1.gpr", 'utf-8');
var f = fs.readFileSync("/Users/sdiemert/workspace/gtjs/sandbox/groove/testGrammar.gps/addEdge.gpr", 'utf-8');

var ruleGraph = {name: 'M', nodes: [], edges: []};

function lookUpValueIndex(rule, val){

    for(var v = 0; v < rule.nodes.length; v++){

        if(rule.nodes[v].name === val){

            return v;

        }

    }

}


xml2js.parseString(f, function (err, result) {
    console.log(err);
    console.log(util.inspect(result, false, null));

    // loop through all nodes and find properties (type) for each one.

    var tmpNode = {type: null, newEntity: false};

    var nodes = result.gxl.graph[0].node;
    var edges = result.gxl.graph[0].edge;

    var nId = null, val = null;

    for (var n = 0; n < nodes.length; n++) {

        tmpNode = {type: null, newEntity: false};

        nId = nodes[n]['$']['id'];

        for (var e = 0; e < edges.length; e++) {

            if (edges[e]['$'].from === nId && edges[e]['$'].to === nId) {

                val = edges[e].attr[0].string[0].split(":");

                if (val[0] === 'type') {
                    tmpNode.type = val[1];
                } else if (val[0] === 'new') {
                    tmpNode.newEntity = true;
                }

                tmpNode.name = parseInt(nId.slice(1));

            }

        }

        ruleGraph.nodes.push(tmpNode)

    }

    var from = null, to = null, tmpVal = null;

    for (var e = 0; e < edges.length; e++) {

        tmpVal = {type : null, newEntity : false};

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
                tmpVal.newEntity = true;
            }

            ruleGraph.edges.push({
                end1 : lookUpValueIndex(ruleGraph, parseInt(from)),
                end2 : lookUpValueIndex(ruleGraph, parseInt(to)),
                direction: 1,
                value : tmpVal
            });

        }

    }

    console.log(util.inspect(ruleGraph,false,null));
    console.log(JSON.stringify(ruleGraph));

    //fs.writeFileSync('sandbox/testInterface/rules/addBox1.json', JSON.stringify(ruleGraph), 'utf-8');
    fs.writeFileSync('sandbox/testInterface/rules/addEdge.json', JSON.stringify(ruleGraph), 'utf-8');

});


