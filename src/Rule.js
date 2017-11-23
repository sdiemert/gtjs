"use strict";

const Graph   = require("./Graph.js").Graph;
const Node    = require("./Graph.js").Node;
const Edge    = require("./Graph.js").Edge;
const Matcher = require("./Matcher");

class Rule {

    /**
     *
     * @param G {Graph} the graph describing the rule.
     * @param addNodes {string[]} an array of node ids in G that should be added.
     * @param addEdges {string[]} an array of edge ids in G that should be added.
     * @param deleteNodes {string[]} an array of node ids that should be deleted.
     * @param deleteEdges {string[]} an array of edge ids that should deleted.
     * @param exprs {object} [{}] an object indexed by node ids containing functions to call on each node's data field.
     * @param nacNodes {string[]} [[]]
     * @param nacEdges {string[]} [[]]
     */
    constructor(G, addNodes, addEdges, deleteNodes, deleteEdges, exprs, nacNodes, nacEdges) {
        this._graph       = G;
        this._addNodes    = addNodes;
        this._addEdges    = addEdges;
        this._deleteNodes = deleteNodes;
        this._deleteEdges = deleteEdges;
        this._exprs       = exprs || {};
        this._nacNodes    = nacNodes || [];
        this._nacEdges    = nacEdges || [];

        // compute this once so that it can be used
        // multiple times later with no overhead.
        this._LHS = this._computeLHS();
        this._RHS = this._computeRHS();
    }

    /**
     * @param G {Graph} the graph to apply this rule too.
     *
     * @return {Boolean}
     *  true if the rule was applied (applied to G);
     *  false if the rule was not applied (G unchanged).
     */
    apply(G) {

        let lhsMorphisms = [];

        if (this._nacNodes.length + this._nacEdges.length <= 0) {
            // find morphism for LHS in G.
            lhsMorphisms = Matcher.findMorphism(G, this.LHS, null);
        } else {
            // we have a negative application condition.
            lhsMorphisms = this._getMorphismWithNACs(G);
        }

        if (lhsMorphisms.length < 1) {
            // we could not find any morphism.
            return false;
        }
        // pick the first Morphism found, this is the only one by default.
        // TODO: implement strategy for morphism choice (e.g. random).
        const lhsMorphism = lhsMorphisms[0];

        // delete matched nodes (and dangling edges) and matched edges in G.
        for (let e = 0; e < this._deleteEdges.length; e++) {
            const ruleEdgeId = this._deleteEdges[e];
            const hostEdgeId = lhsMorphism.edgeMap[ruleEdgeId];
            G.deleteEdge(hostEdgeId);
        }

        for (let n = 0; n < this._deleteNodes.length; n++) {
            const ruleNodeId = this._deleteNodes[n];
            const hostNodeId = lhsMorphism.nodeMap[ruleNodeId];
            G.deleteNode(hostNodeId);
        }

        // apply exprs functions to remaining nodes.
        // TODO: call exprs on each node...

        // add in new nodes and edges
        for (let n = 0; n < this._addNodes.length; n++) {
            const newNode                          = this._graph.getNodeById(this._addNodes[n]).clone();
            lhsMorphism.nodeMap[this._addNodes[n]] = newNode.id;
            G.addNode(newNode);
        }

        for (let e = 0; e < this._addEdges.length; e++) {
            const newEdge = this._graph.getEdgeById(this._addEdges[e]).clone();

            const ruleSrc = this._graph.getEdgeById(this._addEdges[e]).src;
            const ruleTar = this._graph.getEdgeById(this._addEdges[e]).tar;

            const hostSrc = lhsMorphism.nodeMap[ruleSrc];
            const hostTar = lhsMorphism.nodeMap[ruleTar];

            newEdge.src = hostSrc;
            newEdge.tar = hostTar;

            G.addEdge(newEdge);
        }

        return true;
    }

    /**
     * @param G {Graph}
     *
     * @return {Morphism[]}
     *
     * @private
     */
    _getMorphismWithNACs(G) {

        const morphismNoNACs   = Matcher.findMorphism(G, this.LHS, null);
        const morphismWithNACs = Matcher.findMorphism(G, this._computeLHS(false), null);

        const result = [];

        if (morphismNoNACs.length <= 0) {
            return result;
        }

        if (morphismWithNACs.length <= 0) {
            // there were no NAC rule matches found,
            // thus the NAC does not apply.
            return morphismNoNACs;
        }

        for (let i = 0; i < morphismNoNACs.length; i++) {

            for (let j = 0; j < morphismWithNACs.length; j++) {

                // figure out if the graph elements mapped from
                // the host graph are identical to the graph elements
                // mapped by the NAC graph. If they are then the NAC
                // must apply.

                let nacAppliesNodes = 0;
                let nacAppliesEdges = 0;

                // 1) Check for node correspondence
                for (let n in morphismNoNACs[i].nodeMap) {
                    // n is a node in the rule graph without NACs applied
                    if (!morphismNoNACs[i].nodeMap.hasOwnProperty(n)) continue;

                    const hostNodeId = morphismNoNACs[i].nodeMap[n];

                    for (let m in morphismWithNACs[j].nodeMap) {
                        if (!morphismWithNACs[j].nodeMap.hasOwnProperty(m)) continue;
                        if (morphismWithNACs[j].nodeMap[m] === hostNodeId) {
                            // found a node that is matched by both the
                            // NAC rule and non-NAC rule.
                            nacAppliesNodes += 1;
                        }
                    }
                }

                // 2) Check for edge correspondence
                for (let n in morphismNoNACs[i].edgeMap) {
                    // n is a edge in the rule graph without NACs applied
                    if (!morphismNoNACs[i].edgeMap.hasOwnProperty(n)) continue;

                    const hostEdgeId = morphismNoNACs[i].edgeMap[n];

                    for (let m in morphismWithNACs[j].edgeMap) {
                        if (!morphismWithNACs[j].edgeMap.hasOwnProperty(m)) continue;
                        if (morphismWithNACs[j].edgeMap[m] === hostEdgeId) {
                            // found a edge that is matched by both the
                            // NAC rule and non-NAC rule.
                            nacAppliesEdges += 1;
                        }
                    }
                }


                // at this point, nacApplies will contain the number of
                // host nodes that were matched by both the NAC and non-NAC
                // rule.

                if (nacAppliesNodes !== Object.keys(morphismNoNACs[i].nodeMap).length
                    && nacAppliesEdges !== Object.keys(morphismNoNACs[i].edgeMap).length
                ) {
                    // we have found a non-NAC rule match that
                    // does not have the same NAC matches.
                    // therefore this particular morphism is not negated
                    // by a negative application condition.
                    result.push(morphismNoNACs[i]);
                }

            }

        }

        return result;

    }

    /**
     * Returns a subgraph of this._graph which is the LHS of the rule, this contains:
     *  - Nodes not changed by the rule
     *  - Edges not changed by the rule that are not linked to nodes being added by the rule.
     *  - Nodes being deleted by the rule
     *  - Edges being deleted by the rule
     *
     *  @param removeNacs {boolean} [true] remove negative application nodes and edges
     *
     *  @return {Graph} a new Graph object representing the LHS.
     */
    _computeLHS(removeNacs) {

        // copy the original graph object.
        /** @property {Graph} H **/
        const H = this._graph.clone();

        if (removeNacs === undefined || removeNacs === null) {
            removeNacs = true;
        }

        // remove added edges
        let toDelete = [];
        for (let e = 0; e < H.edges.length; e++) {
            if (this._addEdges.includes(H.edges[e].id)) {
                toDelete.push(H.edges[e].id);
            }

            if (removeNacs && this._nacEdges.includes(H.edges[e].id)) {
                toDelete.push(H.edges[e].id);
            }
        }

        for (let e = 0; e < toDelete.length; e++) {
            H.deleteEdge(toDelete[e]);
        }


        toDelete = [];
        // remove added nodes (also deletes adjacent edges).
        for (let n = 0; n < H.nodes.length; n++) {
            if (this._addNodes.includes(H.nodes[n].id)) {
                toDelete.push(H.nodes[n].id)
            }

            if (removeNacs && this._nacNodes.includes(H.nodes[n].id)) {
                toDelete.push(H.nodes[n].id);
            }
        }

        for (let n = 0; n < toDelete.length; n++) {
            H.deleteNode(toDelete[n]);
        }


        return H;
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
    _computeRHS() {

        // copy the original graph object.
        /** @property {Graph} H **/
        const H = this._graph.clone();

        // remove deleted edges
        for (let e = 0; e < H.edges.length; e++) {
            if (this._deleteEdges.includes(H.edges[e].id)
                || this._deleteEdges.includes(H.edges[e].id)
            ) {
                H.deleteEdge(H.edges[e].id);
            }
        }

        // remove deleted nodes (also deletes adjacent edges).
        for (let n = 0; n < H.nodes.length; n++) {
            if (this._deleteNodes.includes(H.nodes[n].id)
                || this._nacNodes.includes(H.nodes[n].id)
            ) {
                H.deleteNode(H.nodes[n].id);
            }
        }

        return H;
    }

    /**
     * Checks the semantics of the rule:
     *  - Cannot delete an edge/node that is adjacent to an added node/edge.
     *  - Cannot add a node/edge adjacent to a node/edge being deleted.
     *  - TODO: look up formal semantics of GT rule application
     *
     * @return {boolean} true if all tests pass, false otherwise.
     */
    checkSemantics() {
        return true;
    }

    get LHS() {
        return this._LHS;
    }

    get RHS() {
        return this._RHS;
    }


}

module.exports = {Rule: Rule};