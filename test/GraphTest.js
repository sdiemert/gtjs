"use strict";
/**
 * Create by sdiemert on 2016-03-06
 *
 * Unit tests for: ../src/Graph.js.
 */

var assert            = require('assert');
var Graph             = require('../src/Graph.js').Graph;
var GraphInvalidError = require("../src/Error.js").GraphInvalidError;

describe("Graph", function () {

    var G = null;

    beforeEach(function (done) {

        G = new Graph();

        done();

    });

    afterEach(function (done) {

        G = null;

        done();

    });

    describe("#addVertex()", function () {

        it("should add a single vertex without label", function (done) {

            var i = G.addVertex();

            assert.equal(i, 1);
            assert.deepEqual(G.getVertices(), [1]);

            done();

        });

        it("should add multiple vertices without labels", function (done) {

            var i = G.addVertex();
            var j = G.addVertex();

            assert.equal(i, 1);
            assert.equal(j, 2);
            assert.deepEqual(G.getVertices(), [1, 2]);

            done();

        });

        it("should add a vertex with a label", function (done) {

            var i = G.addVertex("foobar");

            assert.equal(i, 1);
            assert.equal(G.getVertexLabel(i), "foobar");

            done();

        });

    });

    describe("#addEdge", function () {

        var v1, v2, v3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            done();

        });

        it("should add a new edge without label", function () {

            var e1 = G.addEdge(v1, v2);
            assert.equal(e1, 1);
            assert.deepEqual(G.getEdges(), [1]);

        });

        it("should add a new edge with a label", function () {

            var e1 = G.addEdge(v1, v2, "foobar");
            assert.equal(e1, 1);
            assert.deepEqual(G.getEdges(), [1]);
            assert.equal(G.getEdgeLabel(e1), "foobar");

        });

        it("should add multiple edges", function () {

            var e1 = G.addEdge(v1, v2, "foobar");
            var e2 = G.addEdge(v2, v3, "binbar");
            var e3 = G.addEdge(v3, v1, "binbar");

            assert.equal(e1, 1);
            assert.equal(e2, 2);
            assert.equal(e3, 3);

            assert.deepEqual(G.getEdges(), [1, 2, 3]);

        });

        it("should throw an error if invalid source vertex id is passed", function () {

            assert.throws(function () {

                var e1 = G.addEdge(10, 1);

            }, Error);

        });

        it("should throw an error if invalid target vertex id is passed", function () {

            assert.throws(function () {

                var e1 = G.addEdge(1, 10);

            }, Error);

        });

        it("should throw an error if no source vertex is passed", function () {

            assert.throws(function () {

                var e1 = G.addEdge(null, 1);

            }, Error);

        });

        it("should throw an error if no target vertex is passed", function () {

            assert.throws(function () {

                var e1 = G.addEdge(1);

            }, Error);

        });

        it("should throw an error if no source or target vertices are passed", function () {

            assert.throws(function () {

                var e1 = G.addEdge();

            }, Error);

        });

    });

    describe("#adjacent", function () {

        var v1, v2, v3, e1, e2;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2);
            e2 = G.addEdge(v2, v3);

            done();

        });

        it("should return true if the vertices are adjacent", function () {
            assert.equal(G.adjacent(v1, v2), true);
        });

        it("should return false if the vertices are not adjacent", function () {
            assert.equal(G.adjacent(v1, v3), false);
        });

        it("should return false if an invalid vertex is passed for param u", function () {
            assert.equal(G.adjacent(10, v3), false);
        });

        it("should return false if an invalid vertex is passed for param v", function () {
            assert.equal(G.adjacent(v1, 10), false);
        });

    });

    describe("#getEdge", function () {

        var v1, v2, v3, e1, e2;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2);
            e2 = G.addEdge(v2, v3);

            done();

        });

        it("should return correct edge id", function () {
            assert.equal(G.getEdge(v1, v2), e1);
            assert.equal(G.getEdge(v2, v3), e2);
        });

        it("should return null if vertices are invalid", function () {
            assert.equal(G.getEdge(10, 11), null);
        });

    });

    describe("#findEdgesBySourceVertex", function () {

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2);
            e2 = G.addEdge(v2, v3);
            e3 = G.addEdge(v1, v3);

            done();

        });

        it("should return two edges", function () {
            var A = G.findEdgesBySourceVertex(v1);
            assert.deepEqual(A, [1, 3]);
        });

        it("should return no edges if it is empty", function () {
            var A = G.findEdgesBySourceVertex(v3);
            assert.deepEqual(A, []);
        });

        it("should return null if the argument is not a valid vertex", function () {
            var A = G.findEdgesBySourceVertex(10);
            assert.equal(A, null);
        });

    });

    describe("#findEdgesByTargetVertex", function () {

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2);
            e2 = G.addEdge(v2, v3);
            e3 = G.addEdge(v1, v3);

            done();

        });

        it("should return two edges", function () {
            var A = G.findEdgesByTargetVertex(v3);
            assert.deepEqual(A, [2, 3]);
        });

        it("should return no edges if it is empty", function () {
            var A = G.findEdgesByTargetVertex(v1);
            assert.deepEqual(A, []);
        });

        it("should return null if the argument is not a valid vertex", function () {
            var A = G.findEdgesBySourceVertex(10);
            assert.equal(A, null);
        });

    });

    describe("#removeEdge", function () {


        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex();
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2, "foo");
            e2 = G.addEdge(v2, v3, "bar");
            e3 = G.addEdge(v1, v3, "bin");

            done();

        });

        it("should remove the designated edge", function () {

            var r = G.removeEdge(e1);

            assert.equal(r, true);
            assert.deepEqual(G.getEdges(), [2, 3]);
            assert.equal(G.getEdgeLabel(e1), null);
            assert.equal(G.getEdgeLabel(e2), "bar");
            assert.equal(G.getEdgeLabel(e3), "bin");
            assert.equal(G.adjacent(v2, v3), true);
            assert.equal(G.adjacent(v1, v3), true);

        });

        it("should fail to remove an invalid edge", function () {

            var r = G.removeEdge(100);

            assert.equal(r, false);

            // Ensure that the edge set remains un-changed.
            assert.deepEqual(G.getEdges(), [1, 2, 3]);
            assert.equal(G.adjacent(v2, v3), true);
            assert.equal(G.adjacent(v1, v3), true);
            assert.equal(G.adjacent(v1, v2), true);

        });

        it("should be able to remove multiple edges", function () {

            var r1 = G.removeEdge(e1);
            var r2 = G.removeEdge(e2);

            assert.equal(r1, true);
            assert.equal(r2, true);

            assert.deepEqual(G.getEdges(), [3]);
            assert.equal(G.adjacent(v1, v3), true);

        });

    });

    describe("#removeVertex", function () {

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex("v1");
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2, "foo");
            e2 = G.addEdge(v2, v3, "bar");
            e3 = G.addEdge(v1, v3, "bin");

            done();

        });

        it("should remove the vertex and all associated edges", function () {

            var r = false;

            assert.doesNotThrow(function () {
                r = G.removeVertex(v1);
            }, GraphInvalidError);

            assert.equal(r, true);
            assert.deepEqual(G.getVertices(), [v2, v3]);
            assert.deepEqual(G.getEdges(), [e2]);

        });

        it("should fail to remove a vertex if it does not exist", function () {

            var r = false;

            assert.doesNotThrow(function () {
                r = G.removeVertex(10);
            }, GraphInvalidError);

            assert.equal(r, false);
            assert.deepEqual(G.getVertices(), [v1, v2, v3]);
            assert.deepEqual(G.getEdges(), [e1, e2, e3]);

        });

    });

    describe("#removeVertex", function () {

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex("v1");
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2, "foo");
            e2 = G.addEdge(v2, v3, "bar");
            e3 = G.addEdge(v1, v3, "bin");

            done();

        });

        it("should clone the graph", function () {

            var H = G.clone();

            // ensure the two graphs are the same...
            assert.deepEqual(H.getVertices(), [v1, v2, v3]);
            assert.deepEqual(H.getEdges(), [e1, e2, e3]);
            assert.deepEqual(H.getSourceMorphism().getDomain(), [e1, e2, e3]);
            assert.deepEqual(H.getSourceMorphism().getCoDomain(), [v1, v2]);
            assert.deepEqual(H.getTargetMorphism().getDomain(), [e1, e2, e3]);
            assert.deepEqual(H.getTargetMorphism().getCoDomain(), [v2, v3]);
            assert.deepEqual(H.getVertexLabel(v1), "v1");
            assert.deepEqual(H.getEdgeLabelFunction().getCoDomain(), ["foo", "bar", "bin"]);

            assert.equal(G.vid_counter, H.vid_counter);
            assert.equal(G.eid_counter, H.eid_counter);

        });

        it("should make a new copy of the graph", function () {

            var H = G.clone();

            H.removeVertex(v1);

            var v4 = H.addVertex('v4');

            var e4 = H.addEdge(v2, v4, 'e4');

            assert.deepEqual(H.getVertices(), [v2, v3, v4]);
            assert.deepEqual(H.getEdges(), [e2, e4]);

            assert.deepEqual(G.getVertices(), [v1, v2, v3]);
            assert.deepEqual(G.getEdges(), [e1, e2, e3]);

        });

    });

    describe("#toMatrix", function () {

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex("v1");
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2, "foo");
            e2 = G.addEdge(v2, v3, "bar");
            e3 = G.addEdge(v1, v3, "bin");

            done();

        });

        it("should produce a valid matrix", function () {

            var M = G.toMatrix();

            var E = [
                [0, 1, 1],
                [0, 0, 1],
                [0, 0, 0]
            ];

            assert.equal(M.length, 3);
            assert.deepEqual(E, M);

        });

        it("should produce an array of zeros for unconnected graph", function () {

            G.removeEdge(e1);
            G.removeEdge(e2);
            G.removeEdge(e3);

            var M = G.toMatrix();

            var E = [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            assert.equal(M.length, 3);
            assert.deepEqual(E, M);

        });

        it("should produce an empty array", function () {

            var r1 = G.removeVertex(v1);
            var r2 = G.removeVertex(v2);
            var r3 = G.removeVertex(v3);

            var M = G.toMatrix();

            var E = [];

            assert.equal(r1, true);
            assert.equal(r2, true);
            assert.equal(r3, true);
            assert.deepEqual(E, M);



        });

    });

    describe("#degree", function(){

        var v1, v2, v3, e1, e2, e3;

        beforeEach(function (done) {

            //add vertices to work with...

            v1 = G.addVertex("v1");
            v2 = G.addVertex();
            v3 = G.addVertex();

            // add edges...

            e1 = G.addEdge(v1, v2, "foo");
            e2 = G.addEdge(v2, v3, "bar");
            e3 = G.addEdge(v1, v3, "bin");

            done();

        });

        it("should return the correct degree", function(){

            assert.equal(G.degree(v1), 2);
            assert.equal(G.degree(v2), 1);
            assert.equal(G.degree(v3), 0);

        });


    });

});