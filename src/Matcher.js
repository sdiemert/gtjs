"use strict";

const Graph = require("./Graph.js").Graph;
const Morphism = require("./Graph.js").Morphism;

const iso = require("subgraph-isomorphism");

/**
 *
 * @param G {Graph} the host/parent graph
 * @param H {Graph} the graph to search for match in parent, G.
 * @param numMatches {number} a natural number of matches to find.
 *
 * @return {Morphism[]} an array of possible morphisms.
 */
function findMorphism(G, H, numMatches){

    numMatches = numMatches || null;

    const adjG = asAdjMatrix(G);
    const adjH = asAdjMatrix(H);

    const result = iso.getIsomorphicSubgraphs(adjG.matrix, adjH.matrix, numMatches,
        function(P, Q, p, q){ // P == H, Q == G

            const gNode = G.getNodeById(adjG.indexToId[q]);
            const hNode = H.getNodeById(adjH.indexToId[p]);

            if(gNode && hNode){
                // both nodes - make sure they have the same degree.
                return (
                    (iso.priv.arraySum(P[p]) <= iso.priv.arraySum(Q[q])) &&
                    (gNode.type === hNode.type) &&
                    ((gNode.data === null && hNode.data === null)
                        || gNode.data.compare(hNode.data))
                );
            }else if(!gNode && !hNode){
                // both edges
                return G.getEdgeById(adjG.indexToId[q]).type === H.getEdgeById(adjH.indexToId[p]).type;
            }else{
                return false;
            }

        }
    );

    const morphs = [];

    for(let r = 0; r < result.length; r++){
        const M = new Morphism();

        for(let i = 0; i < adjG.matrix.length; i++){
            for(let j = 0; j < adjH.matrix.length; j++){
                if(result[r][j][i] === 1){

                    const gNode = G.getNodeById(adjG.indexToId[i]);
                    const hNode = H.getNodeById(adjH.indexToId[j]);

                    if(gNode && hNode){

                        // both nodes - make node mapping
                        M.addNodePair(hNode.id, gNode.id);

                    }else if(!gNode && !hNode){
                        // both edges - make edge mapping
                        M.addEdgePair(adjH.indexToId[j], adjG.indexToId[i]);
                    }else{
                        // some error in morphism...
                        throw new Error("Cannot have node <--> edge mapping in morphism");
                    }

                }

            }
        }
        morphs.push(M);
    }

    return morphs;
}

/**
 * @param G {Graph} the graph to express as an adjacency matrix.
 * @return {Object} an adjacency matrix for the graph.
 */
function asAdjMatrix(G){

    const A = [];
    const indexToIdMapping = {}; // keys are array indices, values are node/edge ids.
    const idToIndexMapping = {}; // keys are node/edge ids, values are indices.

    for(let n = 0; n < G.nodes.length; n++){
        const tmp = [];
        for(let x = 0; x < G.nodes.length; x++){
            tmp.push(0);
        }
        for(let x = 0; x < G.edges.length; x++){
            tmp.push(0);
        }
        A.push(tmp);
        indexToIdMapping[n] = G.nodes[n].id;
        idToIndexMapping[G.nodes[n].id] = n;
    }

    for(let e = 0; e < G.edges.length; e++){
        const tmp = [];
        for(let x = 0; x < G.nodes.length; x++){
            tmp.push(0);
        }
        for(let x = 0; x < G.edges.length; x++){
            tmp.push(0);
        }
        A.push(tmp);
        indexToIdMapping[e+G.nodes.length] = G.edges[e].id;
        idToIndexMapping[G.edges[e].id] = e+G.nodes.length;
    }
    //console.log(indexToIdMapping);
    for(let i = 0; i < A.length; i++){
        for(let j = 0; j < A.length; j++){

            // only interested if they are both nodes.
            if(G.getNodeById(indexToIdMapping[i]) && G.getNodeById(indexToIdMapping[j])){
                const e = G.isAdjacent(
                                G.getNodeById(indexToIdMapping[i]),
                                G.getNodeById(indexToIdMapping[j]));
                if(e){
                    const ei = idToIndexMapping[e.id];
                    A[i][ei] = 1;
                    A[ei][j] = 1;
                }
            }
        }
    }
    return {matrix : A, idToIndex : idToIndexMapping, indexToId : indexToIdMapping};
}

module.exports = {
    findMorphism : findMorphism,
    asAdjMatrix : asAdjMatrix,
};
