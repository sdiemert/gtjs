/**
 * Created by sdiemert on 2015-10-31.
 */

import Node = require('./Node');
import Graph = require('./Graph');
import GraphFactory = require('./GraphFactory');

var graphObj = {
    1 : [2,3],
    2 : [1,3],
    3 : [2,1]
};

var gf = new GraphFactory.GraphFactory();

var g :Graph.Graph = gf.graphFromAdjList("G", graphObj);

console.log(g.repAdjList());

console.log("Done");