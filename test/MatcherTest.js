"use strict";
/**
 * Create by sdiemert on 2017-10-15
 *
 * Unit tests for: Matcher.js.
 */

const assert = require('assert');
const match  = require('../src/Matcher.js');
const model  = require("../src/Graph.js");


describe("Matcher", function () {

    describe("#asAdjMatrix()", function () {

        it("should work for singleton graph", function () {

            const G = new model.Graph();
            const n = new model.Node("n1", "type", new model.Data());
            G.addNode(n);

            const A = match.asAdjMatrix(G);

            assert.deepEqual(A.matrix, [[0]]);

        });

        it("should work for p2 graph", function () {

            const G  = new model.Graph();
            const n0 = new model.Node("n0", "type", new model.Data());
            const n1 = new model.Node("n1", "type", new model.Data());
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new model.Edge("e1", "type", "n0", "n1"));

            const A = match.asAdjMatrix(G);

            assert.deepEqual(A.matrix, [[0, 0, 1],
                    [0, 0, 0],
                    [0, 1, 0]
                ]
            );
        });

        it("should work for triangle graph", function () {

            const G  = new model.Graph();
            const n0 = new model.Node("n0", "type", null);
            const n1 = new model.Node("n1", "type", null);
            const n2 = new model.Node("n2", "type", null);
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(new model.Edge("e0", "type", "n0", "n1"));
            G.addEdge(new model.Edge("e1", "type", "n1", "n2"));
            G.addEdge(new model.Edge("e2", "type", "n2", "n0"));

            const A = match.asAdjMatrix(G);

            assert.deepEqual(A.matrix, [
                [0, 0, 0, 1, 0, 0],
                [0, 0, 0, 0, 1, 0],
                [0, 0, 0, 0, 0, 1],
                [0, 1, 0, 0, 0, 0],
                [0, 0, 1, 0, 0, 0],
                [1, 0, 0, 0, 0, 0]
            ]);
        });
    });

    describe("#findMorphism", function(){

        it("should find 3 matches in a triangle", function () {

            const G  = new model.Graph();

            const n0 = new model.Node("n0", "type", new model.StringData('foo'));
            const n1 = new model.Node("n1", "type", new model.StringData('foo'));
            const n2 = new model.Node("n2", "type", new model.StringData('foo'));
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(new model.Edge("e0", "type", "n0", "n1"));
            G.addEdge(new model.Edge("e1", "type", "n1", "n2"));
            G.addEdge(new model.Edge("e2", "type", "n2", "n0"));

            const H = new model.Graph();

            const n3 = new model.Node("n3", "type", new model.StringData('foo'));
            const n4 = new model.Node("n4", "type", new model.StringData('foo'));
            H.addNode(n3);
            H.addNode(n4);
            H.addEdge(new model.Edge("e3", "type", "n3", "n4"));

            const morphs = match.findMorphism(G, H);

            assert.equal(morphs.length, 3);

            assert.deepEqual(morphs[0].nodeMap, {n3 : "n0", n4 : "n1"});
            assert.deepEqual(morphs[0].edgeMap, {e3 : "e0"});

            assert.deepEqual(morphs[1].nodeMap, {n3 : "n1", n4 : "n2"});
            assert.deepEqual(morphs[1].edgeMap, {e3 : "e1"});

            assert.deepEqual(morphs[2].nodeMap, {n3 : "n2", n4 : "n0"});
            assert.deepEqual(morphs[2].edgeMap, {e3 : "e2"});
        });
        it("should find 3 matches in a triangle with null data", function () {

            const G  = new model.Graph();

            const n0 = new model.Node("n0", "type", null);
            const n1 = new model.Node("n1", "type", null);
            const n2 = new model.Node("n2", "type", null);
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(new model.Edge("e0", "type", "n0", "n1"));
            G.addEdge(new model.Edge("e1", "type", "n1", "n2"));
            G.addEdge(new model.Edge("e2", "type", "n2", "n0"));

            const H = new model.Graph();

            const n3 = new model.Node("n3", "type", null);
            const n4 = new model.Node("n4", "type", null);
            H.addNode(n3);
            H.addNode(n4);
            H.addEdge(new model.Edge("e3", "type", "n3", "n4"));

            const morphs = match.findMorphism(G, H);

            assert.equal(morphs.length, 3);

            assert.deepEqual(morphs[0].nodeMap, {n3 : "n0", n4 : "n1"});
            assert.deepEqual(morphs[0].edgeMap, {e3 : "e0"});

            assert.deepEqual(morphs[1].nodeMap, {n3 : "n1", n4 : "n2"});
            assert.deepEqual(morphs[1].edgeMap, {e3 : "e1"});

            assert.deepEqual(morphs[2].nodeMap, {n3 : "n2", n4 : "n0"});
            assert.deepEqual(morphs[2].edgeMap, {e3 : "e2"});
        });

    });
});