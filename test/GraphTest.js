/**
 * Create by sdiemert on 2017-10-15
 *
 * Unit tests for: FILE TO TEST.
 */

var assert        = require('assert');
var model = require('../src/Graph.js');

describe("Model", function () {

    describe("#Graph()", function () {

        it("should identify adjacent", function () {

            const G = new model.Graph();
            const n0 = new model.Node("n0", "type", new model.Data());
            const n1 = new model.Node("n1", "type", new model.Data());
            G.addNode(n0);
            G.addNode(n1);
            G.addEdge(new model.Edge("e1", "type", "n0", "n1"));

            assert.notEqual(G.isAdjacent(n0, n1), null);


        });


    });

});