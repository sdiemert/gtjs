/**
 * Created by sdiemert on 2015-10-31.
 */

import Entities = require('./Entities');


var n1 = new Entities.Node(1, {name : "foobar"}, []);
var n2 = new Entities.Node(2, {name : "binbar"}, []);

var g = new Entities.Graph("G", [n1, n2]);

g.addBiAdj(n1,n2);

console.log("\nAdj List:");
console.log(g.repAdjList());

console.log("Done");