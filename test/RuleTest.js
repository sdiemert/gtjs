"use strict";
/**
 * Create by sdiemert on 2017-11-05
 *
 * Unit tests for: FILE TO TEST.
 */

const assert               = require('assert');
const Rule                 = require('../src/Rule.js').Rule;
const RuleInvalidException = require('../src/Rule.js').RuleInvalidException;
const Graph                = require("../src/Graph.js").Graph;
const Node                 = require("../src/Graph.js").Node;
const Edge                 = require("../src/Graph.js").Edge;
const NumberData           = require("../src/Graph.js").NumberData;


describe("Rule", function () {

    let G  = null;
    let n1 = null, n2 = null, n3 = null, n4 = null, n5 = null;
    let e1 = null, e2 = null, e3 = null, e4 = null, e5 = null, e6 = null;
    let R  = null;

    beforeEach(function () {

        G = new Graph();

        n1 = new Node("type", new NumberData(1));
        n2 = new Node("type", new NumberData(2));
        n3 = new Node("type", new NumberData(3));
        n4 = new Node("type", new NumberData(4));
        n5 = new Node("type", new NumberData(5));

        e1 = new Edge("type", n1.id, n2.id);
        e2 = new Edge("type", n2.id, n3.id);
        e3 = new Edge("type", n3.id, n1.id);
        e4 = new Edge("type", n3.id, n4.id);
        e5 = new Edge("type", n4.id, n5.id);
        e6 = new Edge("type", n1.id, n5.id);

        G.addNode(n1);
        G.addNode(n2);
        G.addNode(n3);
        G.addNode(n4);
        G.addNode(n5);

        G.addEdge(e1);
        G.addEdge(e2);
        G.addEdge(e3);
        G.addEdge(e4);
        G.addEdge(e5);
        G.addEdge(e6);

        R = new Rule(G, [n3.id], [e2.id, e3.id], [n5.id], [e6.id], {}, [], []);

    });

    describe("#_computeLHS()", function () {

        it("should delete add nodes and edges", function () {
            const lhs = R._computeLHS();
            assert.notEqual(lhs, null);
            assert.notEqual(lhs, undefined);
            assert.equal(lhs.nodes.length, 4);
            assert.equal(lhs.edges.length, 3);
            assert.notEqual(lhs.isAdjacent(n1, n2), null); // returns null if not adjacent.
            assert.equal(lhs.isAdjacent(n3, n3), null);
            assert.equal(lhs.isAdjacent(n2, n3), null);
        });

        it("should delete edges on nodes adjacent to add nodes", () => {

            const lhs = R._computeLHS();

            assert.notEqual(lhs, null);

            // only one edge should be left.
            assert.equal(lhs.edges.length, 3);
            assert.deepEqual(lhs.edges[0], e1);
        });

    });

    describe("#_computeRHS()", function () {

        it('should compute the correct RHS', function () {

            const rhs = R._computeRHS();

            assert.equal(rhs.nodes.length, 4);
            assert.equal(rhs.nodes.length, 4);

        });

    });

    describe("#apply()", function () {

        it("should work on a simple graph", function () {

            const G  = new Graph();
            const n1 = new Node("node 1", new NumberData(1));
            const n2 = new Node("node 2", new NumberData(2));
            const e1 = new Edge("edge 1", n1.id, n2.id);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(e1);

            const ruleGraph = new Graph();
            const nr1       = new Node("node 1", new NumberData(1));
            const nr2       = new Node("node 2", new NumberData(2));
            const nr3       = new Node("node 3", new NumberData(3));
            const er1       = new Edge("edge 1", nr1.id, nr2.id);
            const er2       = new Edge("edge 2", nr2.id, nr3.id);
            const er3       = new Edge("edge 3", nr3.id, nr1.id);
            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);
            ruleGraph.addEdge(er3);

            const R = new Rule(ruleGraph, [nr3.id], [er2.id, er3.id], [], [], {});

            const result = R.apply(G);

            assert.equal(result, true);

            assert.equal(G.nodes.length, 3);
            assert.equal(G.edges.length, 3);
            assert.notEqual(G.edges[0].src, undefined);
            assert.notEqual(G.edges[0].tar, undefined);
            assert.notEqual(G.edges[1].src, undefined);
            assert.notEqual(G.edges[1].tar, undefined);
            assert.notEqual(G.edges[2].tar, undefined);
            assert.notEqual(G.edges[2].src, undefined);

            assert.equal(G.edges[0].type, "edge 1");
            assert.equal(G.edges[1].type, "edge 2");
            assert.equal(G.edges[2].type, "edge 3");

            //should not change existing nodes.
            assert.deepEqual(G.nodes[0], n1);
            assert.deepEqual(G.nodes[1], n2);

            assert.deepEqual(G.nodes[2].data, nr3.data);
        });

        it("should not apply to a graph without a match", function () {

            const G  = new Graph();
            const n1 = new Node("not node 1", new NumberData(1));
            const n2 = new Node("node 2", new NumberData(2));
            const e1 = new Edge("edge 1", n1.id, n2.id);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(e1);

            const ruleGraph = new Graph();
            const nr1       = new Node("node 1", new NumberData(1));
            const nr2       = new Node("node 2", new NumberData(2));
            const nr3       = new Node("node 3", new NumberData(3));
            const er1       = new Edge("edge 1", nr1.id, nr2.id);
            const er2       = new Edge("edge 2", nr2.id, nr3.id);
            const er3       = new Edge("edge 3", nr3.id, nr1.id);
            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);
            ruleGraph.addEdge(er3);

            const R = new Rule(ruleGraph, [nr3.id], [er2.id, er3.id], [], [], {});

            const result = R.apply(G);

            assert.equal(result, false);

            assert.equal(G.nodes.length, 2);
            assert.equal(G.edges.length, 1);
            assert.deepEqual(G.nodes[0], n1);
            assert.deepEqual(G.nodes[1], n2);
        });

        it("should be able to delete nodes", function () {

            const G  = new Graph();
            const n1 = new Node("node 1", new NumberData(1));
            const n2 = new Node("node 2", new NumberData(2));
            const n3 = new Node("node 3", new NumberData(3));
            const e1 = new Edge("edge 1", n1.id, n2.id);
            G.addNode(n1);
            G.addNode(n2);
            G.addNode(n3);
            G.addEdge(e1);

            const ruleGraph = new Graph();
            const nr1       = new Node("node 1", new NumberData(1));
            const nr2       = new Node("node 2", new NumberData(2));
            const nr3       = new Node("node 3", new NumberData(3));
            const er1       = new Edge("edge 1", nr1.id, nr2.id);

            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addEdge(er1);

            const R = new Rule(ruleGraph, [], [], [nr3.id], [], {});

            const result = R.apply(G);

            assert.equal(result, true);

            assert.equal(G.nodes.length, 2);
            assert.equal(G.edges.length, 1);
        });

        it("should be able to delete edges", function () {

            const G  = new Graph();
            const n1 = new Node("node 1", new NumberData(1));
            const n2 = new Node("node 2", new NumberData(2));
            const e1 = new Edge("edge 1", n1.id, n2.id);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(e1);

            const ruleGraph = new Graph();
            const nr1       = new Node("node 1", new NumberData(1));
            const nr2       = new Node("node 2", new NumberData(2));
            const er1       = new Edge("edge 1", nr1.id, nr2.id);

            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addEdge(er1);

            const R = new Rule(ruleGraph, [], [], [], [er1.id], {});

            const result = R.apply(G);

            assert.equal(result, true);

            assert.equal(G.nodes.length, 2);
            assert.equal(G.edges.length, 0);
        });


        it("should not apply if a NAC is matched", function () {

            const G  = new Graph();
            const n1 = new Node("A", new NumberData(1));
            const n2 = new Node("B", new NumberData(2));
            const n3 = new Node("C", new NumberData(3));
            const e1 = new Edge("edge", n1.id, n2.id);
            const e2 = new Edge("edge", n2.id, n3.id);

            G.addNode(n1);
            G.addNode(n2);
            G.addNode(n3);
            G.addEdge(e1);
            G.addEdge(e2);

            const ruleGraph = new Graph();
            const nr1       = new Node("A", new NumberData(1));
            const nr2       = new Node("B", new NumberData(2));
            const nr3       = new Node("C", new NumberData(3));
            const er1       = new Edge("edge", nr1.id, nr2.id);
            const er2       = new Edge("edge", nr2.id, nr3.id);
            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);

            const R = new Rule(ruleGraph, [], [], [], [], {}, [nr3.id], [er2.id]);

            const result = R.apply(G);

            assert.equal(result, false);

        });

        it("should not apply if a NAC edge is matched", function () {

            const G  = new Graph();
            const n1 = new Node("A", new NumberData(1));
            const n2 = new Node("B", new NumberData(2));
            const n3 = new Node("C", new NumberData(3));
            const e1 = new Edge("edge", n1.id, n2.id);
            const e2 = new Edge("edge", n2.id, n3.id);

            G.addNode(n1);
            G.addNode(n2);
            G.addNode(n3);
            G.addEdge(e1);
            G.addEdge(e2);

            const ruleGraph = new Graph();
            const nr1       = new Node("A", new NumberData(1));
            const nr2       = new Node("B", new NumberData(2));
            const nr3       = new Node("C", new NumberData(3));
            const er1       = new Edge("edge", nr1.id, nr2.id);
            const er2       = new Edge("edge", nr2.id, nr3.id);
            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);

            const R = new Rule(ruleGraph, [], [], [], [], {}, [], [er2.id]);

            const result = R.apply(G);

            assert.equal(result, false);

        });
        it("should apply if a NAC is not matched", function () {

            const G  = new Graph();
            const n1 = new Node("A", new NumberData(1));
            const n2 = new Node("B", new NumberData(2));
            const n3 = new Node("C", new NumberData(3));
            const e1 = new Edge("edge", n1.id, n2.id);
            const e2 = new Edge("edge", n2.id, n3.id);

            G.addNode(n1);
            G.addNode(n2);
            G.addNode(n3);
            G.addEdge(e1);
            G.addEdge(e2);

            const ruleGraph = new Graph();
            const nr1       = new Node("A", new NumberData(1));
            const nr2       = new Node("B", new NumberData(2));
            const nr3       = new Node("C", new NumberData(3));
            const nr4       = new Node("D", new NumberData(4));
            const er1       = new Edge("edge", nr1.id, nr2.id);
            const er2       = new Edge("edge different", nr2.id, nr3.id);

            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addNode(nr4);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);

            const R = new Rule(ruleGraph, [nr4.id], [], [], [], {}, [], [er2.id]);

            const result = R.apply(G);

            assert.equal(result, true);
            assert.equal(G.nodes.length, 4);
            assert.equal(G.edges.length, 2);

        });

        it("should apply in a graph with both a NAC match and non-NAC match", function () {

            const G  = new Graph();
            const n1 = new Node("A", new NumberData(1));
            const n2 = new Node("B", new NumberData(2));
            const n3 = new Node("C", new NumberData(3));
            const n4 = new Node("A", new NumberData(1));
            const n5 = new Node("B", new NumberData(2));
            const e1 = new Edge("edge", n1.id, n2.id);
            const e2 = new Edge("edge", n2.id, n3.id);
            const e3 = new Edge("edge", n4.id, n2.id);
            const e4 = new Edge("edge", n4.id, n5.id);

            G.addNode(n1);
            G.addNode(n2);
            G.addNode(n3);
            G.addNode(n4);
            G.addNode(n5);
            G.addEdge(e1);
            G.addEdge(e2);
            G.addEdge(e3);
            G.addEdge(e4);

            const ruleGraph = new Graph();
            const nr1       = new Node("A", new NumberData(1));
            const nr2       = new Node("B", new NumberData(2));
            const nr3       = new Node("C", new NumberData(3));
            const nr4       = new Node("D", new NumberData(4));
            const er1       = new Edge("edge", nr1.id, nr2.id);
            const er2       = new Edge("edge", nr2.id, nr3.id);
            const er3       = new Edge("edge", nr1.id, nr4.id);
            ruleGraph.addNode(nr1);
            ruleGraph.addNode(nr2);
            ruleGraph.addNode(nr3);
            ruleGraph.addNode(nr4);
            ruleGraph.addEdge(er1);
            ruleGraph.addEdge(er2);
            ruleGraph.addEdge(er3);

            const R = new Rule(ruleGraph, [nr4.id], [er3.id], [], [], {}, [nr3.id], [er2.id]);

            const result = R.apply(G);

            assert.equal(result, true);
            assert.equal(G.nodes.length, 6);
            assert.equal(G.edges.length, 5);

        });

    });

    describe("#_checkValidIds()", function () {

        let ruleGraph = null;
        let nr1       = null, nr2 = null, nr3 = null, nr4 = null;
        let er1       = null, er2 = null, er3 = null;
        let rule      = null;

        beforeEach(function () {
            ruleGraph = new Graph();

            nr1 = new Node("type", new NumberData(1));
            nr2 = new Node("type", new NumberData(1));
            nr3 = new Node("type", new NumberData(1));
            nr4 = new Node("type", new NumberData(1));
            er1 = new Edge("type", nr1.id, nr2.id);
            er2 = new Edge("type", nr2.id, nr3.id);
            er3 = new Edge("type", nr1.id, nr4.id);

        });

        afterEach(function () {
            ruleGraph = null;
            nr1       = null;
            nr2       = null;
            nr3       = null;
            nr4       = null;
            er1       = null;
            er2       = null;
            er3       = null;
            rule      = null;
        });

        it("should detect an invalid string add node id", function () {
            rule = new Rule(G, [nr1.id, "invalid-node-id"], [], [], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string add node id", function () {
            // pass not a string.
            rule = new Rule(G, [nr1], [], [], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string delete node id", function () {
            rule = new Rule(G, [], [], [nr1.id, "invalid-node-id"], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string delete node id", function () {
            // pass not a string.
            rule = new Rule(G, [], [], [nr1], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });
         it("should detect an invalid string nac node id", function () {
            rule = new Rule(G, [], [], [], [], {}, [nr1.id, "invalid-nac-id"], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string nac node id", function () {
            // pass not a string.
            rule = new Rule(G, [], [], [], [], {}, [nr1], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string add edge id", function () {
            rule = new Rule(G, [], [er1.id, "invalid-edge-id"], [], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string add edge id", function () {
            // pass not a string.
            rule = new Rule(G, [], [er1], [], [], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string delete edge id", function () {
            rule = new Rule(G, [], [], [], [er1.id, "invalid-edge-id"], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string delete edge id", function () {
            // pass not a string.
            rule = new Rule(G, [], [], [], [er1], {}, [], []);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });
         it("should detect an invalid string nac node id", function () {
            rule = new Rule(G, [], [], [], [], {}, [], [er1.id, "invalid-nac-id"]);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should detect an invalid string nac node id", function () {
            // pass not a string.
            rule = new Rule(G, [], [], [], [], {}, [], [er1]);
            assert.throws(() => {
                rule._checkValidIds();
            }, RuleInvalidException);
        });

        it("should not throw error for a set of valid nodes", function(){
            rule = new Rule(G, [nr1.id], [er1.id], [nr2.id], [er3.id], {}, [nr3.id], [er2.id]);
            assert.doesNotThrow(()=>{
                rule._checkValidIds();
            }, RuleInvalidException);
        });

    });

    describe("#_checkNodeTypesDistinct", function(){

        let ruleGraph = null;
        let nr1       = null, nr2 = null, nr3 = null, nr4 = null;
        let er1       = null, er2 = null, er3 = null;
        let rule      = null;

        beforeEach(function () {
            ruleGraph = new Graph();

            nr1 = new Node("type", new NumberData(1));
            nr2 = new Node("type", new NumberData(1));
            nr3 = new Node("type", new NumberData(1));
            nr4 = new Node("type", new NumberData(1));
            er1 = new Edge("type", nr1.id, nr2.id);
            er2 = new Edge("type", nr2.id, nr3.id);
            er3 = new Edge("type", nr1.id, nr4.id);

        });

        afterEach(function () {
            ruleGraph = null;
            nr1       = null;
            nr2       = null;
            nr3       = null;
            nr4       = null;
            er1       = null;
            er2       = null;
            er3       = null;
            rule      = null;
        });

        it("should detect overlap between add and delete nodes", function(){
            const rule = new Rule(G, [nr1.id], [], [nr1.id, nr2.id], [], {}, [], []);
            assert.throws(()=>{rule._checkNodeTypesDistinct()}, RuleInvalidException);
        });

        it("should detect overlap between add and delete edges", function(){
            const rule = new Rule(G, [], [er1.id], [], [er1.id, er2.id], {}, [], []);
            assert.throws(()=>{rule._checkNodeTypesDistinct()}, RuleInvalidException);
        });

        it("should detect overlap between nac and delete nodes", function(){
            const rule = new Rule(G, [], [], [nr1.id, nr2.id], [], {}, [nr3.id, nr1.id], []);
            assert.throws(()=>{rule._checkNodeTypesDistinct()}, RuleInvalidException);
        });

        it("should detect overlap between nac and delete edges", function(){
            const rule = new Rule(G, [], [], [], [er1.id], {}, [], [er1.id]);
            assert.throws(()=>{rule._checkNodeTypesDistinct()}, RuleInvalidException);
        });

        it("should not throw if there is no invalid overlaps", function(){
            const rule = new Rule(G, [nr1.id], [er1.id], [nr2.id], [er2.id], {}, [nr3.id], [er3.id]);
            assert.doesNotThrow(()=>{rule._checkNodeTypesDistinct()}, RuleInvalidException);
        });

    });

});
