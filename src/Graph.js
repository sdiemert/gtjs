"use strict";
/**
 * Contains classes/objects for describing the
 * graph data structure:
 *
 * - Graph
 * - Node
 * - Edge
 * - Data (abstract)
 */

// this package is used to generate random node and edge id's
const uuid = require("uuid/v4");

class Graph{

    constructor(){
        this._nodes = {};
        this._edges = {};
    }

    /**
     * @param n {Node}
     * @return {boolean} true if added, false otherwise.
     */
    addNode(n){

        // check to ensure that the node id is not
        // already in use; reject if it is.
        for(let i = 0; i < this.nodes.length; i++){
            if(n.id === this.nodes[i].id){
                return false;
            }
        }

        this._nodes[n.id] = n;

        return true;
    }

    /**
     * @param e {Edge}
     * @return {boolean} true if added, false otherwise.
     */
    addEdge(e){

        // check to make sure the id is not already in use

        for(let i = 0; i < this.edges.length; i++){
            if(e.id === this.edges[i].id){
                return false;
            }
        }

        this._edges[e.id] = e;

        return true;
    }

    /**
     *
     * @param id {string}
     * @returns {Node|null} null if the id does match a known node.
     */
    getNodeById(id){
        if(this._nodes.hasOwnProperty(id)){
            return this._nodes[id];
        }else{
            return null;
        }
    }

    /**
     * @param id {string}
     * @returns {Edge}
     */
    getEdgeById(id){
        if(this._edges.hasOwnProperty(id)){
            return this._edges[id];
        }else{
            return null;
        }
    }

    /**
     * @returns {Node[]}
     */
    get nodes(){
        const A = [];
        for(let k in this._nodes){
            if(this._nodes.hasOwnProperty(k)){
                A.push(this._nodes[k]);
            }
        }
        return A;
    }

    /**
     * @returns {Edge[]}
     */
    get edges(){
        const A = [];
        for(let k in this._edges){
            if(this._edges.hasOwnProperty(k)){
                A.push(this._edges[k]);
            }
        }
        return A;
    }

    /**
     * Determines if two nodes are adjacent.
     *
     * Unless there is an explicit edge, nodes are not self-adjacent.
     *
     * @param srcNode {Node}
     * @param tarNode {Node}
     *
     * @return {Edge | null}
     */
    isAdjacent(srcNode, tarNode){
        for(let e = 0; e < this.edges.length; e++){
            if(this.edges[e].src === srcNode.id && this.edges[e].tar === tarNode.id){
                return this.edges[e];
            }
        }
        return null;
    }

    /**
     * Makes a complete copy of this graph including all data values
     * stored in the nodes.
     *
     * Calls the clone on child Node, Edge, and Data objects.
     *
     * @returns {Graph}
     */
    clone(){

        const G = new Graph();

        for(let n in this._nodes){
            if(!this._nodes.hasOwnProperty(n)) continue;
            G.addNode(this._nodes[n].clone())
        }

        for(let e in this._edges){
            if(!this._edges.hasOwnProperty(e)) continue;
            G.addEdge(this._edges[e].clone())
        }

        return G;
    }

    /**
     * Deletes the specified node, also deletes any dangling edges resulting from
     * the nodes deletion.
     *
     * @param nId {string} the id of the node to delete.
     */
    deleteNode(nId){

        // first delete any edges adjacent (src or tar) that are
        // adjacent to the node.

        for(let e in this._edges){
            if(!this._edges.hasOwnProperty(e)) continue;
            if(this._edges[e]._src === nId || this._edges[e]._tar === nId){
                this.deleteEdge(e);
            }
        }

        // next delete the node itself
        delete this._nodes[nId];

    }

    /**
     * Deletes the specified edge.
     *
     * @param eId {string}
     */
    deleteEdge(eId){
        delete this._edges[eId];
    }

}

class Node{

    /**
     * @param type {string}
     * @param data {Data}
     */
    constructor(type, data){
        /** @property {string} */
        this._id = 'n-' + uuid();
        /** @property {string} */
        this._type = type;
        /** @property {Data} */
        this._data = data;
    }

    /**
     * Makes a copy of this node;
     * creates a copy of Data by calling Data.clone() method.
     *
     * This clone operation does not generate a new node id.
     * i.e., it copies the existing node's id.
     *
     * @return {Node}
     */
    clone(){
        const n = new Node(this.type, this.data.clone());
        n._id = this._id;
        return n;
    }

    /**
     * @return {string}
     */
    get id(){
       return this._id;
    }

    /**
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     * @returns {Data}
     */
    get data() {
        return this._data;
    }

}

class Edge{

    /**
     * @param type {string} - this field is currently unused.
     * @param src {string}
     * @param tar {string}
     */
    constructor(type, src, tar){
        this._id = 'e-' + uuid();
        this._type = type;
        this._src = src;
        this._tar = tar;
    }

    /**
     * Makes a copy of the edge and returns it.
     *
     * This clone operates also copies the id of the
     * edge, i.e., a new edge id is not generated.
     *
     * @return {Edge}
     */
    clone(){
        const e = new Edge(this.type, this.src, this.tar);
        e._id = this._id;
        return e;
    }

    /**
     * @returns {string}
     */
    get id() {
        return this._id;
    }

    /**
     *
     * @returns {string}
     */
    get type() {
        return this._type;
    }

    /**
     *
     * @returns {string}
     */
    get src() {
        return this._src;
    }

    /**
     *
     * @returns {string}
     */
    get tar() {
        return this._tar;
    }
}

/**
 * This is an abstract class and must be overridden.
 */
class Data{

    /**
     * @param v {object}
     */
    constructor(v){
        this._value = v;
    }

    /**
     * Compares two data structures and determines if they are equivalent.
     *
     * Must be implemented by a sub-class.
     *
     * @param d {Data}
     *
     * @return {boolean} true if data structures are equivalent, false otherwise.
     */
    compare(d){
        throw new Error("Cannot call Data.compare() - it is abstract and must be implemented by a subclass");
    }

    /**
     * Makes a copy of the data object and returns it.
     *
     * Must be implemented by sub-classes.
     *
     * @return {Data}
     */
    clone(){
        throw new Error("Cannot call Data.clone() - it is abstract and must be implemented by a subclass");
    }

    /**
     * @returns {object}
     */
    get value(){
        return this._value;
    }

    /**
     *
     * @param v {object}
     */
    set value(v){
        this._value = v;
    }
}

class StringData extends Data{

    /**
     * @param s {string}
     */
    constructor(s){
        super(s);
    }

    /**
     * @param d {Data}
     */
    compare(d){
        if(d instanceof StringData){
            return d.value === this.value;
        }else{
            return false;
        }
    }

    /**
     * @return {StringData}
     */
    clone(){
        return new StringData(this.value);
    }
}

class NumberData extends Data{

    /**
     * @param n {number}
     */
    constructor(n){
        super(n);
    }

    compare(d){
        if(d instanceof NumberData){
            return d.value === this.value;
        }else{
            return false;
        }
    }

    /**
     * @returns {NumberData}
     */
    clone(){
        return new NumberData(this.value);
    }
}

/**
 * Maps from a matching graph (H) into
 * a parent graph (G)
 */
class Morphism{

    constructor(){
        this._edgeMap = {};
        this._nodeMap = {};
    }

    /**
     * @param h {string} id of edge in h
     * @param g {string} id of edge in g
     */
    addEdgePair(h, g){
        this._edgeMap[h]= g;
    }
    /**
     * @param h {string} id of node in h
     * @param g {string} id of node in g
     */
    addNodePair(h, g){
        this._nodeMap[h]= g;
    }

    get edgeMap(){
        return this._edgeMap;
    }

    get nodeMap(){
        return this._nodeMap;
    }
}

module.exports = {
    Graph : Graph,
    Node : Node,
    Edge : Edge,
    Data : Data,
    Morphism : Morphism,
    NumberData : NumberData,
    StringData : StringData
};