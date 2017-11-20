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
            const n0 = new Node("type", new Data());
            const n1 = new Node("type", new Data());
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new Edge("type", n0.id, n1.id));

            assert.notEqual(G.isAdjacent(n0, n1), null);
        });

    });

    describe("#clone", function () {

        it("should clone and not have references", function () {

            const G  = new Graph();
            const n0 = new Node("type", new NumberData(0));
            const n1 = new Node("type", new StringData("foo"));
            G.addNode(n0);
            G.addNode(n1);
            const e0 = new Edge("type", n0.id, n1.id);
            G.addEdge(e0);

            const H = G.clone();

            assert.equal(H === null, false);
            assert.equal(H === undefined, false);

            assert.deepEqual(H.nodes[0].data, n0.data);
            assert.deepEqual(H.nodes[1].data, n1.data);
            assert.deepEqual(H.edges[0].data, e0.data);

            // now mutate values in H:

            H.nodes[0]._type      = "somethingElse";
            H.edges[0]._type      = "someEdgeType";
            H.nodes[0].data.value = 5;

            // check that values are different (i.e. we are operating on different memory).

            assert.notEqual(H.nodes[0].data.value, n0.data.value);
            assert.notEqual(H.nodes[0].type, n0.type);
            assert.notEqual(H.edges[0].type, e0.type);

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
            n0 = new Node("type", new NumberData(0));
            n1 = new Node("type", new StringData("foo"));
            G.addNode(n0);
            G.addNode(n1);
            e1 = new Edge("type", n0.id, n1.id);
            G.addEdge(e1);
        });

        afterEach(function () {
            G  = null;
            n0 = null;
            n1 = null;
            e1 = null;
        });

        it("should delete the edge", function () {
            G.deleteEdge(e1.id);
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
            n0 = new Node("type", new NumberData(0));
            n1 = new Node("type", new StringData("foo"));
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
            G.deleteNode(n1.id);
            assert.equal(Object.keys(G.nodes).length, 1);
        });

        it("should delete edges if they are adjacent", function(){
            e1 = new Edge("type", n0.id, n1.id);
            G.addEdge(e1);

            G.deleteNode(n1.id);

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