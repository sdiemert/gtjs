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

        it("should throw an error if invalid source vertex id is passed", function(){

            assert.throws(function(){

                var e1 = G.addEdge(10, 1);

            }, Error);

        });

        it("should throw an error if invalid target vertex id is passed", function(){

            assert.throws(function(){

                var e1 = G.addEdge(1, 10);

            }, Error);

        });

        it("should throw an error if no source vertex is passed", function(){

            assert.throws(function(){

                var e1 = G.addEdge(null, 1);

            }, Error);

        });

        it("should throw an error if no target vertex is passed", function(){

            assert.throws(function(){

                var e1 = G.addEdge(1);

            }, Error);

        });

        it("should throw an error if no source or target vertices are passed", function(){

            assert.throws(function(){

                var e1 = G.addEdge();

            }, Error);

        });

    });

    describe("#adjacent", function(){

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

        it("should return true if the vertices are adjacent", function(){
            assert.equal(G.adjacent(v1, v2), true);
        });

        it("should return false if the vertices are not adjacent", function(){
            assert.equal(G.adjacent(v1, v3), false);
        });

        it("should return false if an invalid vertex is passed for param u", function(){
            assert.equal(G.adjacent(10, v3), false);
        });

        it("should return false if an invalid vertex is passed for param v", function(){
            assert.equal(G.adjacent(v1, 10), false);
        });

    });

    describe("#getEdge", function() {

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

        it("should return correct edge id", function(){
            assert.equal(G.getEdge(v1, v2), e1);
            assert.equal(G.getEdge(v2, v3), e2);
        });

        it("should return null if vertices are invalid", function(){
            assert.equal(G.getEdge(10, 11), null);
        });

    });

});