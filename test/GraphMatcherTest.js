/**
 * Create by sdiemert on 2016-03-09
 *
 * Unit tests for: ../src/GraphMatcherTest.js.
 */
"use strict";

var assert       = require('assert');
var GraphMatcher = require('../src/GraphMatcher.js').GraphMatcher;
var Graph        = require('../src/Graph.js').Graph;
var Morphism     = require('../src/Morphism.js').Morphism;

describe("GraphMatcher", function () {


    var GM = null;
    var G  = null;
    var H  = null;
    var M  = null;

    beforeEach(function () {

        GM = new GraphMatcher();
        G  = new Graph();
        H  = new Graph();

    });

    afterEach(function () {

        GM = null;
        G  = null;
        H  = null;

    });


    describe("#findMatch", function () {

        beforeEach(function () {

        });

        afterEach(function () {

        });


        it("should find a basic morphism for perfectly equal graphs", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();

            G.addEdge(vg1, vg2);
            G.addEdge(vg2, vg3);
            G.addEdge(vg3, vg4);
            G.addEdge(vg4, vg1);

            H.addEdge(vh1, vh2);
            H.addEdge(vh2, vh3);
            H.addEdge(vh3, vh4);
            H.addEdge(vh4, vh1);

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

            assert.deepEqual(m.Fv.get(vg1), vh1);
            assert.deepEqual(m.Fv.get(vg2), vh2);
            assert.deepEqual(m.Fv.get(vg3), vh3);
            assert.deepEqual(m.Fv.get(vg4), vh4);

        });

        it("should find a basic morphism for differing but isomorphic graphs", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();

            G.addEdge(vg1, vg2);
            G.addEdge(vg2, vg3);
            G.addEdge(vg3, vg4);
            G.addEdge(vg4, vg1);

            H.addEdge(vh1, vh3);
            H.addEdge(vh3, vh2);
            H.addEdge(vh2, vh4);
            H.addEdge(vh4, vh1);

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

            assert.deepEqual(m.Fv.get(vg1), vh1);
            assert.deepEqual(m.Fv.get(vg2), vh3);
            assert.deepEqual(m.Fv.get(vg3), vh2);
            assert.deepEqual(m.Fv.get(vg4), vh4);

        });

        it("should match on equivalent vertex labels", function () {

            var vg1 = G.addVertex('a');
            var vg2 = G.addVertex('b');
            var vg3 = G.addVertex('c');
            var vg4 = G.addVertex('d');

            var vh1 = H.addVertex('a');
            var vh2 = H.addVertex('c');
            var vh3 = H.addVertex('b');
            var vh4 = H.addVertex('d');

            G.addEdge(vg1, vg2);
            G.addEdge(vg2, vg3);
            G.addEdge(vg3, vg4);
            G.addEdge(vg4, vg1);

            H.addEdge(vh1, vh3);
            H.addEdge(vh3, vh2);
            H.addEdge(vh2, vh4);
            H.addEdge(vh4, vh1);

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

            assert.deepEqual(m.Fv.get(vg1), vh1);
            assert.deepEqual(m.Fv.get(vg2), vh3);
            assert.deepEqual(m.Fv.get(vg3), vh2);
            assert.deepEqual(m.Fv.get(vg4), vh4);

        });

        it("should fail to match if the labels do not align", function () {

            var vg1 = G.addVertex('a');
            var vg2 = G.addVertex('b');
            var vg3 = G.addVertex('c');
            var vg4 = G.addVertex('d');

            var vh1 = H.addVertex('w');
            var vh2 = H.addVertex('x');
            var vh3 = H.addVertex('y');
            var vh4 = H.addVertex('z');

            G.addEdge(vg1, vg2);
            G.addEdge(vg2, vg3);
            G.addEdge(vg3, vg4);
            G.addEdge(vg4, vg1);

            H.addEdge(vh1, vh3);
            H.addEdge(vh3, vh2);
            H.addEdge(vh2, vh4);
            H.addEdge(vh4, vh1);

            var m = GM.findIsoMorphism(G, H);

            assert.deepEqual(m, null);

        });

        it("should match equivalent edge labels", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();

            G.addEdge(vg1, vg2, 'a');
            G.addEdge(vg2, vg3, 'b');
            G.addEdge(vg3, vg4, 'c');
            G.addEdge(vg4, vg1, 'd');

            H.addEdge(vh1, vh3, 'a');
            H.addEdge(vh3, vh2, 'b');
            H.addEdge(vh2, vh4, 'c');
            H.addEdge(vh4, vh1, 'd');

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

            assert.deepEqual(m.Fv.get(vg1), vh1);
            assert.deepEqual(m.Fv.get(vg2), vh3);
            assert.deepEqual(m.Fv.get(vg3), vh2);
            assert.deepEqual(m.Fv.get(vg4), vh4);

        });

        it("should return null for non matching edge labels", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();

            G.addEdge(vg1, vg2, 'a');
            G.addEdge(vg2, vg3, 'b');
            G.addEdge(vg3, vg4, 'c');
            G.addEdge(vg4, vg1, 'd');

            H.addEdge(vh1, vh3, 'w');
            H.addEdge(vh3, vh2, 'x');
            H.addEdge(vh2, vh4, 'y');
            H.addEdge(vh4, vh1, 'z');

            var m = GM.findIsoMorphism(G, H);

            assert.deepEqual(m, null);

        });

        it("should match on edges with labels", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();

            G.addEdge(vg1, vg2);
            G.addEdge(vg2, vg3);
            G.addEdge(vg3, vg4);
            G.addEdge(vg4, vg1);

            H.addEdge(vh1, vh3);
            H.addEdge(vh3, vh2);
            H.addEdge(vh2, vh4);
            H.addEdge(vh4, vh1);
            H.addEdge(vh2, vh3);

            var m = GM.findIsoMorphism(G, H);

            assert.deepEqual(m, null);

        });

        it("should return null for graphs with different sizes", function () {

            var vg1 = G.addVertex();
            var vg2 = G.addVertex();
            var vg3 = G.addVertex();
            var vg4 = G.addVertex();

            var vh1 = H.addVertex();
            var vh2 = H.addVertex();
            var vh3 = H.addVertex();
            var vh4 = H.addVertex();
            var vh5 = H.addVertex();

            var m = GM.findIsoMorphism(G, H);

            assert.deepEqual(m, null);

        });

        it("should return valid morphism for graphs of size zero", function () {

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

        });

        it("should return true on another test graph", function(){

            var a = G.addVertex();
            var b = G.addVertex();
            var c = G.addVertex();
            var d = G.addVertex();
            var g = G.addVertex();
            var h = G.addVertex();
            var i = G.addVertex();
            var j = G.addVertex();

            G.addEdge(a,g, 'a');
            G.addEdge(a,h, 'a');
            G.addEdge(a,i, 'a');

            G.addEdge(b,g, 'a');
            G.addEdge(b,h, 'a');
            G.addEdge(b,j, 'a');

            G.addEdge(c,g, 'a');
            G.addEdge(c,i, 'a');
            G.addEdge(c,j, 'a');

            G.addEdge(d,h, 'a');
            G.addEdge(d,i, 'a');
            G.addEdge(d,j, 'a');

            G.addEdge(g,b, 'a');
            G.addEdge(g,c, 'a');
            G.addEdge(g,a, 'a');

            G.addEdge(h,a, 'a');
            G.addEdge(h,b, 'a');
            G.addEdge(h,d, 'a');

            G.addEdge(i,d, 'a');
            G.addEdge(i,c, 'a');
            G.addEdge(i,a, 'a');

            G.addEdge(j,b, 'a');
            G.addEdge(j,c, 'a');
            G.addEdge(j,d, 'a');


            var v1 = H.addVertex();
            var v2 = H.addVertex();
            var v3 = H.addVertex();
            var v4 = H.addVertex();
            var v5 = H.addVertex();
            var v6 = H.addVertex();
            var v7 = H.addVertex();
            var v8 = H.addVertex();

            H.addEdge(v1, v2, 'a');
            H.addEdge(v1, v5, 'a');
            H.addEdge(v1, v4, 'a');

            H.addEdge(v2, v3, 'a');
            H.addEdge(v2, v1, 'a');
            H.addEdge(v2, v6, 'a');

            H.addEdge(v3, v2, 'a');
            H.addEdge(v3, v4, 'a');
            H.addEdge(v3, v7, 'a');

            H.addEdge(v4, v8, 'a');
            H.addEdge(v4, v1, 'a');
            H.addEdge(v4, v3, 'a');

            H.addEdge(v5, v1, 'a');
            H.addEdge(v5, v6, 'a');
            H.addEdge(v5, v8, 'a');

            H.addEdge(v6, v2, 'a');
            H.addEdge(v6, v5, 'a');
            H.addEdge(v6, v7, 'a');

            H.addEdge(v7, v6, 'a');
            H.addEdge(v7, v8, 'a');
            H.addEdge(v7, v3, 'a');

            H.addEdge(v8, v4, 'a');
            H.addEdge(v8, v7, 'a');
            H.addEdge(v8, v5, 'a');

            for(var x = 0; x < 8; x++){
                assert.equal(G.degree(G.V[x]), 3);
                assert.equal(H.degree(H.V[x]), 3);
            }

            var m = GM.findIsoMorphism(G, H);

            assert.notDeepEqual(m, null);

        });


    });
});
