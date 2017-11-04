"use strict";
/**
 * Create by sdiemert on 2017-10-15
 *
 * Unit tests for: FILE TO TEST.
 */

var assert     = require('assert');
var Graph      = require('../src/Graph.js').Graph;
var Data       = require('../src/Graph.js').Data;
var NumberData = require('../src/Graph.js').NumberData;
var StringData = require('../src/Graph.js').StringData;
var Node       = require('../src/Graph.js').Node;
var Edge       = require('../src/Graph.js').Edge;

describe("Graph", function () {

    describe("#getAdjacent()", function () {

        it("should identify adjacent", function () {

            const G  = new Graph();
            const n0 = new Node("n0", "type", new Data());
            const n1 = new Node("n1", "type", new Data());
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new Edge("e1", "type", "n0", "n1"));

            assert.notEqual(G.isAdjacent(n0, n1), null);
        });

    });

    describe("#clone", function () {

        it("should clone and not have references", function () {

            const G  = new Graph();
            const n0 = new Node("n0", "type", new NumberData(0));
            const n1 = new Node("n1", "type", new StringData("foo"));
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new Edge("e1", "type", "n0", "n1"));

            const H = G.clone();

            assert.equal(H === null, false);
            assert.equal(H === undefined, false);
            assert.deepEqual(H, G); // they are the same values.

            assert.equal(H.getNodeById("n1").type, "type");
            assert.equal(H.getNodeById("n0").type, "type");

            assert.equal(H.getEdgeById("e1").type, "type");


            // now mutate values in H:

            H.getNodeById("n1")._type      = "somethingElse";
            H.getEdgeById("e1")._type      = "someEdgeType";
            H.getNodeById("n0").data.value = 5;

            // check that values are different (i.e. we are operating on different memory).

            assert.notEqual(H.getNodeById("n0").data.value, G.getNodeById("n0").data.value);
            assert.notEqual(H.getNodeById("n1").type, G.getNodeById("n1").type);
            assert.notEqual(H.getEdgeById("e1").type, G.getEdgeById("e1").type);
            assert.notDeepEqual(H, G);

        });

    });

    describe("#deleteEdge", function () {
        /** @property G {Graph} **/
        let G  = null;
        /** @property n0 {Node} **/
        let n0 = null;
        /** @property n1 {Node} **/
        let n1 = null;
        /** @property e1 {Edge} **/
        let e1 = null;

        beforeEach(function () {
            G  = new Graph();
            n0 = new Node("n0", "type", new NumberData(0));
            n1 = new Node("n1", "type", new StringData("foo"));
            G.addNode(n0);
            G.addNode(n1);
            e1 = new Edge("e1", "type", "n0", "n1");
            G.addEdge(e1);
        });

        afterEach(function () {
            G  = null;
            n0 = null;
            n1 = null;
            e1 = null;
        });

        it("should delete the edge", function () {
            G.deleteEdge("e1");
            assert.equal(G.isAdjacent(n0, n1), null);
            assert.equal(Object.keys(G.edges).length, 0);
        });

    });

    describe("#deleteNode", function () {
        /** @property G {Graph} **/
        let G  = null;
        /** @property n0 {Node} **/
        let n0 = null;
        /** @property n1 {Node} **/
        let n1 = null;
        /** @property e1 {Edge} **/
        let e1 = null;

        beforeEach(function () {
            G  = new Graph();
            n0 = new Node("n0", "type", new NumberData(0));
            n1 = new Node("n1", "type", new StringData("foo"));
            G.addNode(n0);
            G.addNode(n1);

        });

        afterEach(function () {
            G  = null;
            n0 = null;
            n1 = null;
            e1 = null;
        });

        it("should delete the node", function () {
            G.deleteNode("n1");
            assert.equal(Object.keys(G.nodes).length, 1);
        });

        it("should delete edges if they are adjacent", function(){
            e1 = new Edge("e1", "type", "n0", "n1");
            G.addEdge(e1);

            G.deleteNode("n1");

            assert.equal(Object.keys(G.nodes).length, 1);
            assert.equal(Object.keys(G.edges).length, 0);

        });

    });

});

describe("Data", function () {

    describe("#compare()", function () {

        it("should throw if try to compare on Data abstract object", function () {

            const d1 = new Data();
            const d2 = new Data();

            assert.throws(() => {
                d1.compare(d2);
            }, Error, "ERROR");

        });

        it("should return false for different data types", function () {

            const d1 = new StringData("foo");
            const d2 = new NumberData(1);
            assert.equal(d1.compare(d2), false);

        });

        it("should return true for equal number data", function () {
            const d1 = new NumberData(1);
            const d2 = new NumberData(1);
            assert.equal(d1.compare(d2), true);
        });

        it("should return true for equal string data", function () {
            const d1 = new NumberData("foo");
            const d2 = new NumberData("foo");
            assert.equal(d1.compare(d2), true);
        });
    });

});