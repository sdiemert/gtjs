"use strict";

const Graph  = require("./Graph.js").Graph;

class Rule{

    /**
     *
     * @param G {Graph}
     * @param addNodes {string[]} an array of node ids in G that should be added.
     * @param addEdges {string[]} an array of edge ids in G that should be added.
     * @param deleteNodes {string[]} an array of node ids that should be deleted.
     * @param deleteEdges {string[]} an array of edge ids that should deleted.
     * @param exprs {object} an object indexed by node ids containing functions to call on each node's data field.
     */
    constructor(G, addNodes, addEdges, deleteNodes, deleteEdges, exprs){
        this._graph = G;
        this._addNodes = addNodes;
        this._addEdges = addEdges;
        this._deleteNodes = deleteNodes;
        this._deleteEdges = deleteEdges;
        this._exprs = exprs;
    }

    /**
     * @param G {Graph} the graph to apply this rule too.
     */
    apply(G){

        // call getLHS and find morphism for LHS in G.

        // delete matched nodes (and dangling edges) and matched edges in G.

        // apply exprs functions to remaining nodes.

        // add in new nodes and edges

    }

    /**
     * Returns a subgraph of this._graph which is the LHS of the rule, this contains:
     *  - Nodes not changed by the rule
     *  - Edges not changed by the rule that are not linked to nodes being added by the rule.
     *  - Nodes being deleted by the rule
     *  - Edges being deleted by the rule
     *
     *  @return {Graph}
     */
    getLHS(){

    }

    /**
     * Returns a subgraph of this._graph which is the RHS of the rule, this contains:
     *  - Nodes not changed by this rule.
     *  - Edges not changed by this rule that are not linked to nodes being deleted by the rule.
     *  - Nodes added by the rule.
     *  - Edges added by the rule.
     *
     *  @return {Graph}
     */
    getRHS(){

    }

}