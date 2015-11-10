/**
 * Created by sdiemert on 2015-11-05.
 */

var xml2js = require('xml2js');
var fs     = require('fs');
var util   = require('util');

var inPath  = "/Users/sdiemert/workspace/gtjs/sandbox/groove/testGrammar.gps/";
var outPath = "sandbox/testInterface/rules/";

var ruleRegex = new RegExp("^([a-zA-Z0-9]+)\.gpr$", 'g');

var ruleGraph = {name: 'M', nodes: [], edges: []};

function lookUpValueIndex(rule, val) {

    for (var v = 0; v < rule.nodes.length; v++) {

        if (rule.nodes[v].name === val) {

            return v;

        }

    }

}

function parseRule(data, outFilePath) {

    xml2js.parseString(data, function (err, result) {
        console.log(util.inspect(result, false, null));

        ruleGraph = {name: 'M', nodes: [], edges: []};

        // loop through all nodes and find properties (type) for each one.

        var tmpNode = {type: null, newEntity: false};

        var nodes = result.gxl.graph[0].node;
        var edges = result.gxl.graph[0].edge;

        var nId = null, val = null;

        for (var n = 0; n < nodes.length; n++) {

            console.log(n);
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

            tmpVal = {type: null, newEntity: false};

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
                    end1     : lookUpValueIndex(ruleGraph, parseInt(from)),
                    end2     : lookUpValueIndex(ruleGraph, parseInt(to)),
                    direction: 1,
                    value    : tmpVal
                });

            }

        }

        console.log(util.inspect(ruleGraph, false, null));

        //fs.writeFileSync('sandbox/testInterface/rules/addBox1.json', JSON.stringify(ruleGraph), 'utf-8');
        fs.writeFileSync(outFilePath, JSON.stringify(ruleGraph), 'utf-8');

    });

}

var files = fs.readdirSync(inPath);


var match = null;

for(var i = 0; i < files.length; i++){

    match = ruleRegex.exec(files[i]);

    if(match){
        console.log(match);
        parseRule(fs.readFileSync(inPath+match[0], 'utf-8'), outPath+match[1]+".json");
    }

    ruleRegex.lastIndex = 0;
}
