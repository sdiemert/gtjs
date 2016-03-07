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

});