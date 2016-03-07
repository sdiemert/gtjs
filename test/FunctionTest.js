/**
 * Create by sdiemert on 2016-03-06
 *
 * Unit tests for: ../src/Function.js.
 */
"use strict";

var assert               = require('assert');
var Function             = require('../src/Function.js').Function;
var InvalidMorphismError = require("../src/Error.js").InvalidMorphismError;

describe("Function", function () {

    var F = null;

    beforeEach(function(){

        F = new Function();

    });

    afterEach(function(){

        F = null;

    });



    describe("#constructor", function () {

        it("should use the object passed in", function () {

            var o = {'a': [1], 'b': [2]};

            var M = new Function(o);

            assert.deepEqual(M.getDomain(), ['a', 'b']);
            assert.deepEqual(M.getCoDomain(), [1, 2]);

        });

        it("should make a new object", function(){

            var M = new Function();

            assert.deepEqual(M.getCoDomain(), []);
            assert.deepEqual(M.getDomain(), []);

        });

        it("should throw exception if object passed is bad structure", function () {

            var o = {'a': 2, 'b': 3}; //invalid object structure for morphism.

            assert.throws(function () {
                var M = new Function(o);
            }, InvalidMorphismError);

        });

        it("should throw error if object passed is not a function", function(){

            var o = {'a' : [2, 3]}; //invalid object structure for morphism.

            assert.throws(function () {
                var M = new Function(o);
            }, InvalidMorphismError);
        });

    });

    describe("#clone", function(){

        beforeEach(function(){
            F.put(1, 10);
            F.put(2, 20);
            F.put(3, 30);
        });


        it("should clone the Function", function(){

            var X = F.clone();

            assert.deepEqual(X.getDomain(), [1,2,3]);
            assert.deepEqual(X.getCoDomain(), [10,20,30]);

        });

        it("should make a copy of the Function", function(){

            var X = F.clone();

            X.remove(1);

            // X should have changed.
            assert.deepEqual(X.getDomain(), [2,3]);
            assert.deepEqual(X.getCoDomain(), [20,30]);

            // F should not have changed.
            assert.deepEqual(F.getDomain(), [1,2,3]);
            assert.deepEqual(F.getCoDomain(), [10,20,30]);

        });

    });

});
