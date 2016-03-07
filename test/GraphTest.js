"use strict";
/**
 * Create by sdiemert on 2016-03-06
 *
 * Unit tests for: ../src/Graph.js.
 */

var assert = require('assert');
var Graph  = require('../src/Graph.js').Graph;

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

            assert.equal(i, 0);
            assert.deepEqual(G.getVertices(), [0]);

            done();

        });

        it("should add multiple vertices without labels", function(done){

            var i = G.addVertex();
            var j = G.addVertex();

            assert.equal(i, 0);
            assert.equal(j, 1);
            assert.deepEqual(G.getVertices(), [0, 1]);

           done();

        });

        it("should add a vertex with a label", function(done){

            var i = G.addVertex("foobar");

            assert.equal(G.getVertexLabel(i), "foobar");

            done();

        });


    });

});