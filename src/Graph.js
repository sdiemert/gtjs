"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 */

var Function          = require("./Function.js").Function;
var GraphInvalidError = require("./Error.js").GraphInvalidError;
var util              = require("util");

class Graph {

    constructor(id) {

        this.id = id || "Unnamed";

        this.E = [];
        this.V = [];

        this.S  = new Function();
        this.T  = new Function();
        this.Le = new Function();
        this.Lv = new Function();

        this.vid_counter = 1;
        this.eid_counter = 1;

    }

    /**
     * @throws {GraphInvalidError} if the graph is in an invalid state.
     */
    consistencyCheck() {

        if (!this.S.structureOk())throw new GraphInvalidError("Graph source function (S) is in an invalid state!");

        if (!this.T.structureOk()) throw new GraphInvalidError("Graph target function (T) is in an invalid state");

        if (!this.Le.structureOk()) throw new GraphInvalidError("Graph edge label function (Le) is in an invalid state");

        if (!this.Lv.structureOk()) throw new GraphInvalidError("Graph edge label function (Lv) is in an invalid state");

    }

    /**
     * Adds a vertex to the graph with an optional label.
     *
     * @param label {Object} optional label to add to the vertex.
     * @returns {number}
     */
    addVertex(label) {

        this.V.push(this.vid_counter);

        if (label) {
            this.Lv.put(this.vid_counter, label);
        }

        this.consistencyCheck();

        this.consistencyCheck();

        return this.vid_counter++;

    }

    getVertices() {
        return this.V;
    }

    getVertexLabel(x) {
        return this.Lv.get(x);
    }


    /**
     * Adds a new edge between two nodes (source -> target). The edge is
     * optionally labelled.
     *
     * @param src {number} the identifier for the source node.
     * @param target {number}  the identifier for the target node.
     * @param label {Object|undefined} a label for the edge.
     * @throws {Error} if invalid vertices are passed.
     * @returns {number} the identifier for the new edge.
     */
    addEdge(src, target, label) {

        if (!src || !target) {
            throw new Error("Cannot create edge without source and target vertices.");
        }

        if (this.V.indexOf(src) === -1) throw new Error("Invalid source vertex passed, cannot create edge.");
        if (this.V.indexOf(target) === -1) throw new Error("Invalid target vertex passed, cannot create edge.");


        this.E.push(this.eid_counter);

        this.S.put(this.eid_counter, src);
        this.T.put(this.eid_counter, target);

        if (label) {
            this.Le.put(this.eid_counter, label);
        }

        this.consistencyCheck();

        return this.eid_counter++;
    }

    getEdges() {
        return this.E;
    }

    getEdgeLabel(x) {
        return this.Le.get(x);
    }

    getEdgeLabels(){
        return this.Le;
    }

    getVertexLabels(){
        return this.Lv;
    }

    getSourceMorphism(){
        return this.S;
    }

    getTargetMorphism(){
        return this.T;
    }

    /**
     * Determines if there is an edge: u -> v.
     * @param u {number}
     * @param v {number}
     * @return {boolean} true a u->v edge exists, false otherwise.
     */
    adjacent(u, v) {

        if (this.T.get(this.S.get(u)) === v) return true;
        else return false;

    }

    /**
     * Gets the edge id that connects two vertices, if the edge exists.
     * @param u {number} source vertex id.
     * @param v {number} target vertex id.
     * @returns {number|null} the edge id that connects u -> v.
     */
    getEdge(u, v) {

        if (this.adjacent(u, v)) {
            return this.S.get(u);
        } else {
            return null;
        }

    }

    /**
     * @return {string} A string representation of the graph.
     */
    toString() {

        var s = "";

        s += "Graph\t: " + this.id + "\n";
        s += "V\t: " + util.inspect(this.V) + "\n";
        s += "E\t: " + util.inspect(this.E) + "\n";

        s += "S : E -> V\t: " + this.S.toString() + "\n";
        s += "T : E -> V\t: " + this.T.toString() + "\n";
        s += "Lv : V -> A\t: " + this.Lv.toString() + "\n";
        s += "Le : E -> A\t: " + this.Le.toString() + "\n";

        return s;

    }

}

module.exports = {Graph: Graph};
