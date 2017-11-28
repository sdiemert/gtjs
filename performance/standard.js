/**
 * A performance test for gauging the efficiency of the code
 */

const now = require("performance-now");

const Graph = require("../src/Graph").Graph;
const Node = require("../src/Graph").Node;
const Edge = require("../src/Graph").Edge;
const NumberData = require("../src/Graph").NumberData;
const Rule = require("../src/Rule.js").Rule;

const G = new Graph();

const n1 = new Node("type", new NumberData(1));
const n2 = new Node("type", new NumberData(1));
const n3 = new Node("type", new NumberData(1));
const e1 = new Edge("type", n1.id, n2.id);
const e2 = new Edge("type", n2.id, n3.id);
const e3 = new Edge("type", n3.id, n1.id);

G.addNode(n1);
G.addNode(n2);
G.addNode(n3);
G.addEdge(e1);
G.addEdge(e2);
G.addEdge(e3);

const rG1 = new Graph();

const rG1_n1 = new Node("type", new NumberData(1));
const rG1_n2 = new Node("type", new NumberData(1));
const rG1_n3 = new Node("type", new NumberData(1));
const rG1_n4 = new Node("type", new NumberData(1));
const rG1_n5 = new Node("type", new NumberData(1));

const rG1_e1 = new Edge("type", rG1_n1.id, rG1_n2.id);
const rG1_e2 = new Edge("type", rG1_n2.id, rG1_n3.id);
const rG1_e3 = new Edge("type", rG1_n3.id, rG1_n1.id);
const rG1_e4 = new Edge("type", rG1_n3.id, rG1_n4.id);
const rG1_e5 = new Edge("type", rG1_n4.id, rG1_n5.id);
const rG1_e6 = new Edge("type", rG1_n5.id, rG1_n3.id);

rG1.addNode(rG1_n1);
rG1.addNode(rG1_n2);
rG1.addNode(rG1_n3);
rG1.addNode(rG1_n4);
rG1.addNode(rG1_n5);
rG1.addEdge(rG1_e1);
rG1.addEdge(rG1_e2);
rG1.addEdge(rG1_e3);
rG1.addEdge(rG1_e4);
rG1.addEdge(rG1_e5);
rG1.addEdge(rG1_e6);

const r1 = new Rule(rG1, [rG1_n4.id, rG1_n5.id], [rG1_e4.id, rG1_e5.id, rG1_e6.id], [], [], [], [], [], []);

const rG2 = new Graph();
const rG2_n1 = new Node("type", new NumberData(1));
const rG2_n2 = new Node("type", new NumberData(1));
const rG2_n3 = new Node("type", new NumberData(1));
const rG2_e1 = new Edge("type", rG2_n1.id, rG2_n2.id);
const rG2_e2 = new Edge("type", rG2_n2.id, rG2_n3.id);
const rG2_e3 = new Edge("type", rG2_n3.id, rG2_n1.id);

rG2.addNode(rG2_n1);
rG2.addNode(rG2_n3);
rG2.addNode(rG2_n2);
rG2.addEdge(rG2_e1);
rG2.addEdge(rG2_e2);
rG2.addEdge(rG2_e3);

const r2 = new Rule(rG2, [], [rG2_e3.id], [], [], [], [], [], []);

const rules = [r1, r2];

function runTest(iters) {

    let count  = 0;
    let x      = 0;
    let result = false;
    let t0 = null;
    let t1 = null;

    while (count < iters) {

        x = Math.random() > 0.5 ? 1 : 0;

        result = false;

        t0 = now();
        result = rules[x].apply(G);
        t1 = now();

        //console.log("x:", x, "result:", result);

        if (!result) {
            t0 = now();
            result = rules[1 - x].apply(G);
            t1 = now();
            if (!result) {
                return count;
            } else {
                //console.log("Failed first attempt, applied rule:", 1 - x);
            }
        } else {
            //console.log("Applied rule:", x);
        }

        count++;
        console.log(count,G.nodes.length, G.edges.length, t1 - t0);
    }

    return count;
}


const iters = 50;
const t0 = now();
const itersRun = runTest(iters);
const t1 = now();

console.log("Ran", itersRun, "of", iters, "iterations; time:", t1 - t0, "milliseconds");

console.log("nodes:", G.nodes.length, "edges:", G.edges.length);

