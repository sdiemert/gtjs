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
    3: [0,1],
    4: [1,2]

};

import entities = require("./Entities");
import graph = require("./Graph");
import graphFactory = require("./GraphFactory");
import r = require("./Rule");

var gf = new graphFactory.GraphFactory();


var g = gf.newGraphFromAdjList(adj, "G");
var g2 = gf.newGraphFromAdjList(adj2, "G2");

var r1 = new r.Rule(g, function(h : graph.Graph, m : Array<number>){

    h.removeNode(m[m.length - 1]);

    return h;

});

console.log(g2.repAsMatrix());

var x = r1.tryRule(g2);

while(x){

    console.log(g2.repAsMatrix());

    x = r1.tryRule(g2);

}
console.log();


