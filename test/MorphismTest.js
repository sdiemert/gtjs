/**
 * Create by sdiemert on 2016-03-06
 *
 * Unit tests for: ../src/Morphism.js.
 */
"use strict";

var assert               = require('assert');
var Morphism             = require('../src/Morphism.js').Morphism;
var InvalidMorphismError = require("../src/Error.js").InvalidMorphismError;

describe("Morphism", function () {

    describe("#constructor", function () {

        it("should use the object passed in", function () {

            var o = {'a': [1], 'b': [2]};

            var M = new Morphism(o);

            assert.deepEqual(M.getDomain(), ['a', 'b']);
            assert.deepEqual(M.getCoDomain(), [1, 2]);

        });

        it("should make a new object", function(){

            var M = new Morphism();

            assert.deepEqual(M.getCoDomain(), []);
            assert.deepEqual(M.getDomain(), []);

        });

        it("should throw exception if object passed is bad structure", function () {

            var o = {'a': 2, 'b': 3}; //invalid object structure for morphism.

            assert.throws(function () {
                var M = new Morphism(o);
            }, InvalidMorphismError);

        });

    });


    describe("#put()", function () {

        it("should add a single mapping", function (done) {

            var o = {};

            var M = new Morphism(o);

            M.put(1, 2);

            assert.deepEqual(o[1], [2]);
            assert.deepEqual(M.getDomain(), [1]);
            assert.deepEqual(M.getCoDomain(), [2]);

            done();

        });

        it("should be able to add multiple items", function (done) {

            var o = {};
            var M = new Morphism(o);

            M.put(1, 2);
            M.put(2, 3);
            M.put(4, 5);

            var D = M.getDomain();
            var C = M.getCoDomain();

            assert.deepEqual(o[1], [2]);
            assert.deepEqual(o[2], [3]);
            assert.deepEqual(o[4], [5]);
            assert.deepEqual(D, [1, 2, 4]);
            assert.deepEqual(C, [2, 3, 5]);

            done();

        });

        it("should be able to add duplicate mappings", function (done) {

            var o = {};
            var M = new Morphism(o);

            M.put(1, 2);
            M.put(1, 3);
            M.put(4, 5);

            var D = M.getDomain();
            var C = M.getCoDomain();

            assert.deepEqual(o[1], [2, 3]);
            assert.deepEqual(o[4], [5]);
            assert.deepEqual(D, [1, 4]);
            assert.deepEqual(C, [2, 3, 5]);

            done();

        });


        it("should not have duplicates in codomain", function(){

            var o = {};
            var M = new Morphism(o);

            M.put(1, 2);
            M.put(1, 3);
            M.put(1, 5);
            M.put(4, 5); //5 is now in codomain twice.

            var D = M.getDomain();
            var C = M.getCoDomain();

            assert.deepEqual(o[1], [2, 3, 5]);
            assert.deepEqual(o[4], [5]);
            assert.deepEqual(D, [1, 4]);
            assert.deepEqual(C, [2, 3, 5]);

        });

    });

    describe("#getOne", function(){

        it("should return an element that is mapped", function(){

            var M = new Morphism();
            M.put(1, 2);
            assert.equal(M.getOne(1), 2);

        });


        it("should return null if the key in invalid", function(){

            var M = new Morphism();
            M.put(1, 2);
            assert.equal(M.getOne(10), null);

        });

    });

    describe("#get", function(){

        it("should return an array of values", function(){

            var M = new Morphism();
            M.put(1, 2);
            M.put(1, 3);
            assert.deepEqual(M.get(1), [2,3]);

        });

        it("should return null for an invalid key", function(){

            var M = new Morphism();
            M.put(1, 2);
            assert.deepEqual(M.get(2), null);

        });

    });

});