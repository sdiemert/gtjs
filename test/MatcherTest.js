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
            const n0 = new model.Node("type", new model.Data());
            const n1 = new model.Node("type", new model.Data());
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new model.Edge("type", n0.id, n1.id));

            const A = match.asAdjMatrix(G);

            assert.deepEqual(A.matrix, [[0, 0, 1],
                    [0, 0, 0],
                    [0, 1, 0]
                ]
            );
        });

        it("should work for triangle graph", function () {

            const G  = new model.Graph();
            const n0 = new model.Node("type", null);
            const n1 = new model.Node("type", null);
            const n2 = new model.Node("type", null);
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(new model.Edge("type", n0.id, n1.id));
            G.addEdge(new model.Edge("type", n1.id, n2.id));
            G.addEdge(new model.Edge("type", n2.id, n0.id));

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

            const n0 = new model.Node("type", new model.StringData('foo'));
            const n1 = new model.Node("type", new model.StringData('foo'));
            const n2 = new model.Node("type", new model.StringData('foo'));
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            const e0 = new model.Edge("type", n0.id, n1.id);
            const e1 = new model.Edge("type", n1.id, n2.id);
            const e2 = new model.Edge("type", n2.id, n0.id);
            G.addEdge(e0);
            G.addEdge(e1);
            G.addEdge(e2);

            const H = new model.Graph();

            const n3 = new model.Node("type", new model.StringData('foo'));
            const n4 = new model.Node("type", new model.StringData('foo'));
            H.addNode(n3);
            H.addNode(n4);
            const e3 = new model.Edge("type", n3.id, n4.id);
            H.addEdge(e3);

            const morphs = match.findMorphism(G, H);

            assert.equal(morphs.length, 3);

            assert.deepEqual(morphs[0].nodeMap[n3.id], n0.id);
            assert.deepEqual(morphs[0].nodeMap[n4.id], n1.id);
            assert.deepEqual(morphs[0].edgeMap[e3.id], e0.id);

            assert.deepEqual(morphs[1].nodeMap[n3.id], n1.id);
            assert.deepEqual(morphs[1].nodeMap[n4.id], n2.id);
            assert.deepEqual(morphs[1].edgeMap[e3.id], e1.id);

            assert.deepEqual(morphs[2].nodeMap[n3.id], n2.id);
            assert.deepEqual(morphs[2].nodeMap[n4.id], n0.id);
            assert.deepEqual(morphs[2].edgeMap[e3.id], e2.id);
        });
        it("should find 3 matches in a triangle with null data", function () {

            const G  = new model.Graph();
            const n0 = new model.Node("type", null);
            const n1 = new model.Node("type", null);
            const n2 = new model.Node("type", null);
            const e0 = new model.Edge("type", n0.id, n1.id);
            const e1 = new model.Edge("type", n1.id, n2.id);
            const e2 = new model.Edge("type", n2.id, n0.id);
            G.addNode(n0);
            G.addNode(n1);
            G.addNode(n2);
            G.addEdge(e0);
            G.addEdge(e1);
            G.addEdge(e2);

            const H = new model.Graph();
            const n3 = new model.Node("type", null);
            const n4 = new model.Node("type", null);
            const e3 = new model.Edge("type", n3.id, n4.id);
            H.addNode(n3);
            H.addNode(n4);
            H.addEdge(e3);

            const morphs = match.findMorphism(G, H);

            assert.equal(morphs.length, 3);

            assert.deepEqual(morphs[0].nodeMap[n3.id], n0.id);
            assert.deepEqual(morphs[0].nodeMap[n4.id], n1.id);
            assert.deepEqual(morphs[0].edgeMap[e3.id], e0.id);

            assert.deepEqual(morphs[1].nodeMap[n3.id], n1.id);
            assert.deepEqual(morphs[1].nodeMap[n4.id], n2.id);
            assert.deepEqual(morphs[1].edgeMap[e3.id], e1.id);

            assert.deepEqual(morphs[2].nodeMap[n3.id], n2.id);
            assert.deepEqual(morphs[2].nodeMap[n4.id], n0.id);
            assert.deepEqual(morphs[2].edgeMap[e3.id], e2.id);
        });

    });
});