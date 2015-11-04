/**
 * Created by sdiemert on 2015-10-31.
 */

import util = require('util');

/*
var adj = {

    0: [1,4],
    1: [0,2],
    2: [1,3],
    3: [2,4],
    4: [3,0],

};
*/
var adj = {

    0: [1],
    1: [0,2],
    2: [1],

};

var adj2 = {

    0: [2,3],
    1: [3,4],
    2: [0,4],
    3: [3,1],
    4: [1,2]

};

import entities = require("./Entities");
import graph = require("./Graph");
import graphFactory = require("./GraphFactory");

var gf = new graphFactory.GraphFactory();

var g = gf.newGraphFromAdjList(adj, "G");
var g2 = gf.newGraphFromAdjList(adj2, "G2");


var x = g2.hasSubGraph(g);

console.log(g2.repAsMatrix());
console.log(g.repAsMatrix());

console.log();
console.log(x);

console.log(g2.inducedGraph(x).repAsMatrix());


