/**
 * Created by sdiemert on 2016-03-06.
 */

var Graph = require("./Graph.js").Graph;
var GraphMatcher = require("./GraphMatcher.js").GraphMatcher;

var G = new Graph();
var H = new Graph();

var a = G.addVertex();
var b = G.addVertex();
var c = G.addVertex();
var d = G.addVertex();
var g = G.addVertex();
var h = G.addVertex();
var i = G.addVertex();
var j = G.addVertex();

G.addEdge(a,g, 'a');
G.addEdge(a,h, 'a');
G.addEdge(a,i, 'a');

G.addEdge(b,g, 'a');
G.addEdge(b,h, 'a');
G.addEdge(b,j, 'a');

G.addEdge(c,g, 'a');
G.addEdge(c,i, 'a');
G.addEdge(c,j, 'a');

G.addEdge(d,h, 'a');
G.addEdge(d,i, 'a');
G.addEdge(d,j, 'a');

G.addEdge(g,b, 'a');
G.addEdge(g,c, 'a');
G.addEdge(g,a, 'a');

G.addEdge(h,a, 'a');
G.addEdge(h,b, 'a');
G.addEdge(h,d, 'a');

G.addEdge(i,d, 'a');
G.addEdge(i,c, 'a');
G.addEdge(i,a, 'a');

G.addEdge(j,b, 'a');
G.addEdge(j,c, 'a');
G.addEdge(j,d, 'a');


var v1 = H.addVertex();
var v2 = H.addVertex();
var v3 = H.addVertex();
var v4 = H.addVertex();
var v5 = H.addVertex();
var v6 = H.addVertex();
var v7 = H.addVertex();
var v8 = H.addVertex();

H.addEdge(v1, v2, 'a');
H.addEdge(v1, v5, 'a');
H.addEdge(v1, v4, 'a');

H.addEdge(v2, v3, 'a');
H.addEdge(v2, v1, 'a');
H.addEdge(v2, v6, 'a');

H.addEdge(v3, v2, 'a');
H.addEdge(v3, v4, 'a');
H.addEdge(v3, v7, 'a');

H.addEdge(v4, v8, 'a');
H.addEdge(v4, v1, 'a');
H.addEdge(v4, v3, 'a');

H.addEdge(v5, v1, 'a');
H.addEdge(v5, v6, 'a');
H.addEdge(v5, v8, 'a');

H.addEdge(v6, v2, 'a');
H.addEdge(v6, v5, 'a');
H.addEdge(v6, v7, 'a');

H.addEdge(v7, v6, 'a');
H.addEdge(v7, v8, 'a');
H.addEdge(v7, v3, 'a');

H.addEdge(v8, v4, 'a');
H.addEdge(v8, v7, 'a');
H.addEdge(v8, v5, 'a');

var matcher = new GraphMatcher();
var m = matcher.findIsoMorphism(G, H);

console.log(m);

