"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 * The basic Graph class
 */

var Function          = require("./Function.js").Function;
var GraphInvalidError = require("./Error.js").GraphInvalidError;
var util              = require("util");

class Graph {

    constructor(id) {

        this.id = id || "Unnamed";

        this.E = [];
        this.V = [];

        this.S = new Function(); // S : E -> V
        this.T = new Function(); // T : E -> V
        this.Le = new Function(); // Le : E -> Alphabet
        this.Lv = new Function(); // Lv : V -> Alphabet

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
     * @param label {Object|undefined} optional label to add to the vertex.
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

        label = label || "" + this.eid_counter;

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

    getEdgeLabelFunction() {
        return this.Le;
    }

    getVertexLabelFunction() {
        return this.Lv;
    }

    getSourceMorphism() {
        return this.S;
    }

    getTargetMorphism() {
        return this.T;
    }

    /**
     * Determines if there is an edge: u -> v.
     *
     * @param u {number} the source vertex.
     * @param v {number} the target vertex.
     * @return {boolean} true a u->v edge exists, false otherwise.
     */
    adjacent(u, v) {

        // S : E -> V
        // T : E -> V

        var srcEdges = this.findEdgesBySourceVertex(u);

        if (!srcEdges) return false;

        for (var i = 0; i < srcEdges.length; i++) {

            if (this.T.get(srcEdges[i]) === v) return true;

        }

        return false;

    }

    /**
     * Finds edges that have their source identified by x.
     *
     * @param x {number} id of the vertex to look for.
     * @return {Array | null} the ids of edges that have x as their source, null if x is invalid vertex.
     */
    findEdgesBySourceVertex(x) {

        if (this.V.indexOf(x) === -1) return null;

        var toReturn = [];

        for (var i = 0; i < this.E.length; i++) {
            if (this.S.get(this.E[i]) === x) toReturn.push(this.E[i]);
        }

        return toReturn;
    }

    /**
     * Find edges that have their target identified by x.
     *
     * @param x {number} id of the vertex to look for.
     * @return {Array | null} the ids of edges that have x as their target, null if x is invalid vertex.
     */
    findEdgesByTargetVertex(x) {

        if (this.V.indexOf(x) === -1) return null;

        var toReturn = [];

        for (var i = 0; i < this.E.length; i++) {
            if (this.T.get(this.E[i]) === x) toReturn.push(this.E[i]);
        }

        return toReturn;
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

    /**
     * Produces an adjacency matrix for this graph.
     *
     * @returns {Array} A 2D array, cells that are 1 represent an adjacent x,y pair
     */
    toMatrix() {

        var MAT = [];

        var T = [];

        for (var i = 0; i < this.V.length; i++) {

            T = [];
            for (var j = 0; j < this.V.length; j++) {

                T.push(0);

            }

            MAT.push(T);
        }

        for (var i = 0; i < this.V.length; i++) {

            for (var j = 0; j < this.V.length; j++) {

                if (this.adjacent(this.V[i], this.V[j])) MAT[i][j] = 1;

            }

        }

        return MAT;

    }

    toMatrixString() {

        var MAT = this.toMatrix();

        var s = "";

        for (var i = 0; i < MAT.length; i++) {

            for (var j = 0; j < MAT.length; j++) {

                s += MAT[i][j] + " "

            }

            s += "\n"

        }

        return s;

    }

    /**
     * Attempts to remove a vertex from the Graph.
     *
     * @param x {number} the id of the vertex to remove
     * @return {boolean} true if removed successfully, false otherwise.
     */
    removeVertex(x) {

        // TODO: this function may leave the graph in a partially
        //  valid state.... We would like that if this fails it will
        //  revert to the previous state.

        if (this.V.indexOf(x) === -1) return false;

        // remove relations in S
        //      must remove all edges that use x as a source.

        var edgesToRemove = this.findEdgesBySourceVertex(x);

        var r = true;

        for (var e = 0; e < edgesToRemove.length; e++) {

            r = this.removeEdge(edgesToRemove[e]);

            // if removing edge fails
            if (!r) return false;

        }

        // remove relations in T
        //      must remove all edges that use x as a target.

        edgesToRemove = this.findEdgesByTargetVertex(x);

        for (var e = 0; e < edgesToRemove.length; e++) {

            r = this.removeEdge(edgesToRemove[e]);

            // if removing edge fails
            if (!r) return false;

        }

        // remove relations in Lv
        r = this.Lv.remove(x);

        // remove the vertex.
        this.V.splice(this.V.indexOf(x), 1);

        // check that the graph is consistent
        this.consistencyCheck();

        return true;
    }

    /**
     * Removes an edge from the graph.
     *
     * @param x {number} id of the edge to remove.
     * @returns {boolean} true if edge was successfully removed, false otherwise.
     */
    removeEdge(x) {

        if (this.E.indexOf(x) === -1) return false;

        this.E.splice(this.E.indexOf(x), 1);

        var result = true;

        //remove edge from source and target relations

        result = result && this.S.remove(x);
        result = result && this.T.remove(x);

        // remove all labels for the edge

        result = result && this.Le.remove(x);

        return result;

    }

    /**
     * Creates a clone of the entire graph.
     *
     * @return {Graph}
     */
    clone() {

        var H = new Graph(this.id);

        H.V = this.V.slice(0);
        H.E = this.E.slice(0);

        H.vid_counter = this.vid_counter;
        H.eid_counter = this.eid_counter;

        H.S = this.S.clone();
        H.T = this.T.clone();

        H.Le = this.Le.clone();
        H.Lv = this.Lv.clone();

        return H;

    }

    /**
     * Find the degree (number of out-going edges) from the vertex
     * identified by v.
     *
     * @param v {number} the id of the vertex to get the degree for.
     *
     * @return {number|null} the degree of the vertex identified by v, null if v is invalid.
     */
    degree(v) {

        if (this.V.indexOf(v) === -1) return null;

        else return this.findEdgesBySourceVertex(v).length;

    }

    /**
     * Find the co-degree (number of incident edges) for the vertex idenitfied
     * by v.
     *
     * @param v {number}
     * @returns {number | null}
     */
    coDegree(v){

        if (this.V.indexOf(v) === -1) return null;

        else return this.findEdgesByTargetVertex(v).length;

    }


}

module.exports = {Graph: Graph};
