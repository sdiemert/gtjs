/**
 * Created by sdiemert on 2016-03-06.
 */

var Graph = require("./Graph.js").Graph;

var G = new Graph();

var v1 = G.addVertex();
var v2 = G.addVertex();
var v3 = G.addVertex();

var e1 = G.addEdge(v1, v2);
var e2 = G.addEdge(v1, v3);
var e3 = G.addEdge(v2, v3);

console.log(G.toString());
