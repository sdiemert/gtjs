"use strict";
/**
 * Create by sdiemert on 2017-11-05
 *
 * Unit tests for: FILE TO TEST.
 */

const assert     = require('assert');
const Rule       = require('../src/Rule.js').Rule;
const Graph      = require("../src/Graph.js").Graph;
const Node       = require("../src/Graph.js").Node;
const Edge       = require("../src/Graph.js").Edge;
const NumberData = require("../src/Graph.js").NumberData;


describe("Rule", function () {

    let G  = null;
    let n1 = null, n2 = null, n3 = null, n4 = null, n5 = null;
    let e1 = null, e2 = null, e3 = null, e4 = null, e5 = null, e6 = null;
    let R  = null;

    beforeEach(function () {

        G  = new Graph();

        n1 = new Node("n1", "type", new NumberData(1));
        n2 = new Node("n2", "type", new NumberData(2));
        n3 = new Node("n3", "type", new NumberData(3));
        n4 = new Node("n4", "type", new NumberData(4));
        n5 = new Node("n5", "type", new NumberData(5));

        e1 = new Edge("e1", "type", "n1", "n2");
        e2 = new Edge("e2", "type", "n2", "n3");
        e3 = new Edge("e3", "type", "n3", "n1");
        e4 = new Edge("e4", "type", "n3", "n4");
        e5 = new Edge("e5", "type", "n4", "n5");
        e6 = new Edge("e6", "type", "n1", "n5");

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

        R = new Rule(G, ["n3"], ["e2", "e3"], ["n5"], ["e6"], {});

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

        it("should delete edges on nodes adjacent to add nodes", ()=>{

            const lhs = R._computeLHS();

            assert.notEqual(lhs, null);

            // only one edge should be left.
            assert.equal(lhs.edges.length, 3);
            assert.deepEqual(lhs.edges[0], e1);
        });

    });

    describe("#_computeRHS()", function(){

        it('should compute the correct RHS', function(){

            const rhs = R._computeRHS();

            assert.equal(rhs.nodes.length, 4);
            assert.equal(rhs.nodes.length, 4);

        });

    });

});
