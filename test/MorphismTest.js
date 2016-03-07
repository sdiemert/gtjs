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

    describe("#remove", function(){

        var M = null;

        beforeEach( function(){

            M = new Morphism();
            M.put(1, 10);
            M.put(1, 11);
            M.put(2, 20);
            M.put(2, 21);
            M.put(3, 30);

        });

        afterEach(function(){

            M = null;

        });

        it("should remove an existing mapping", function(){
            var r = M.remove(1, 10);
            assert.equal(r, true);

            assert.deepEqual(M.getDomain(), [1, 2, 3]);
            assert.deepEqual(M.getCoDomain(), [11, 20, 21, 30]);

            assert.deepEqual(M.get(1), [11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);
        });

        it("should remove the element from the domain if it has nothing to map to", function(){
            var r = M.remove(3, 30);
            assert.equal(r, true);

            assert.deepEqual(M.getDomain(), [1, 2]);
            assert.deepEqual(M.getCoDomain(), [10, 11, 20, 21]);

            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);

            assert.equal(M.get(3), null);

        });

        it("should return false if element is not in the domain", function(){
            var r = M.remove(100, 10); //not in the domain
            assert.equal(r, false);

            // make sure object is unchanged.
            assert.deepEqual(M.getDomain(), [1, 2, 3]);
            assert.deepEqual(M.getCoDomain(), [10, 11, 20, 21, 30]);

            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);

        });

        it("should return false if element is not in the co domain", function(){
            var r = M.remove(100, 10); //not in the domain
            assert.equal(r, false);

            // make sure object is unchanged.
            assert.deepEqual(M.getDomain(), [1, 2, 3]);
            assert.deepEqual(M.getCoDomain(), [10, 11, 20, 21, 30]);

            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);
        });

        it("should return false if the arguments are in neither domain or co domain", function(){
            var r = M.remove(100, 100); //not in the domain
            assert.equal(r, false);

            // make sure object is unchanged.
            assert.deepEqual(M.getDomain(), [1, 2, 3]);
            assert.deepEqual(M.getCoDomain(), [10, 11, 20, 21, 30]);

            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);
        });

        it("should remove the element from the domain", function(){

            var r = M.remove(1); //not in the domain
            assert.equal(r, true);

            // make sure object is unchanged.
            assert.deepEqual(M.getDomain(), [2, 3]);
            assert.deepEqual(M.getCoDomain(), [20, 21, 30]);

            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);

        });

        it("should return false if trying to remove element not in domain", function(){

            var r = M.remove(10); //not in the domain
            assert.equal(r, false);

            // make sure object is unchanged.
            assert.deepEqual(M.getDomain(), [1, 2, 3]);
            assert.deepEqual(M.getCoDomain(), [10, 11, 20, 21, 30]);

            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);

        });

    });

    describe("#clone", function(){

        var M = null;

        beforeEach( function(){

            M = new Morphism();
            M.put(1, 10);
            M.put(1, 11);
            M.put(2, 20);
            M.put(2, 21);
            M.put(3, 30);

        });

        afterEach(function(){

            M = null;

        });

        it("should clone the entire morphism", function(){

            var X = M.clone();

            assert.deepEqual(X.get(1), [10, 11]);
            assert.deepEqual(X.get(2), [20, 21]);
            assert.deepEqual(X.get(3), [30]);

        });

        it("should make a copy", function(){

            var X = M.clone();

            X.remove(1, 10);

            // X should have changed.
            assert.deepEqual(X.get(1), [11]);
            assert.deepEqual(X.get(2), [20, 21]);
            assert.deepEqual(X.get(3), [30]);

            // M should not have changed.
            assert.deepEqual(M.get(1), [10, 11]);
            assert.deepEqual(M.get(2), [20, 21]);
            assert.deepEqual(M.get(3), [30]);

        });

    });

});