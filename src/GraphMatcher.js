"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 */

var GraphMorphism = require("./GraphMorphism.js").GraphMorphism;

class GraphMatcher {

    constructor() {

    }

    /**
     * Finds a morphism between two graphs. Look for an occurrence of
     * Graph H in Graph G
     *
     * @param G {Graph}
     * @param H {Graph}
     * @param M {GraphMorphism} a current morphism between the graphs.
     * @return {GraphMorphism|null}
     */
    findIsoMorphism(G, H, M) {


        /*
         console.log("findMatch(G,H,M);");
         console.log("G:");
         console.log(G.toMatrixString());
         console.log("H:");
         console.log(H.toMatrixString());
         */

        // Link: http://adriann.github.io/Ullman%20subgraph%20isomorphism.html
        //  Not used here...but provides a discussion of subgraph isomorphism problem.

        // create a new morphism if it is not passed in.
        M = M || new GraphMorphism();

        //console.log(M.Fv.toString());


        // 1) If H and G are the same size, then there might be a morphism.
        //  1.1) propose a morphism, M
        //  1.2) check if it is valid
        // 2) If not the same size, then remove elements from G and recurse.

        var Vh = H.getVertices(), Vg = G.getVertices();
        var Eh = H.getEdges(), Eg = G.getEdges();

        var tempG, tempH, r;

        if (Vh.length == 0 && Vg.length == 0) return M;

        for (var i = 0; i < Vg.length; i++) {

            for (var j = 0; j < Vh.length; j++) {

                if (
                    G.degree(Vg[i]) === H.degree(Vh[j]) &&
                    G.coDegree(Vg[i]) === H.coDegree(Vh[j]) &&
                    G.getVertexLabel(Vg[i]) === H.getVertexLabel(Vh[j]) &&
                    this.edgeEquivalence(G, Vg[i], H, Vh[j])
                ) {

                    //console.log("yes: ("+i+","+j+")");

                    tempG = G.clone();
                    tempH = H.clone();

                    if (tempG.removeVertex(Vg[i]) && tempH.removeVertex(Vh[j])) {

                        // store the vertex pairing the morphism.
                        M.Fv.put(Vg[i], Vh[j]);

                        // store the edge pairing in the morphism.
                        //  we already know that the degrees are the same, but we need to
                        //  check the edges are the same.


                        r = this.findIsoMorphism(tempG, tempH, M);

                        if (r !== null) return M;

                    }

                } else {

                    //console.log("no: ("+i+","+j+")");

                }

            }

        }

        return null;

    }

    edgeEquivalence(G, x, H, y) {

        var Gsrc = G.findEdgesBySourceVertex(x);
        var Gtar = G.findEdgesByTargetVertex(x);

        var Hsrc = H.findEdgesBySourceVertex(y);
        var Htar = H.findEdgesByTargetVertex(y);

        var GsrcLabels = [];
        var GtarLabels = [];
        var HsrcLabels = [];
        var HtarLabels = [];

        for (var i = 0; i < Gsrc.length; i++) GsrcLabels.push(G.getEdgeLabel(Gsrc[i]));

        for (var i = 0; i < Gtar.length; i++) GtarLabels.push(G.getEdgeLabel(Gtar[i]));

        for (var i = 0; i < Hsrc.length; i++) HsrcLabels.push(H.getEdgeLabel(Hsrc[i]));

        for (var i = 0; i < Htar.length; i++) HtarLabels.push(H.getEdgeLabel(Htar[i]));

        return this.compObj(this.arr2Obj(GsrcLabels), this.arr2Obj(HsrcLabels)) &&
            this.compObj(this.arr2Obj(GtarLabels), this.arr2Obj(HtarLabels));


    }

   compObj(x, y) {
        if (x === y) return true;
        // if both x and y are null or undefined and exactly the same

        if (!( x instanceof Object ) || !( y instanceof Object )) return false;
        // if they are not strictly equal, they both need to be Objects

        if (x.constructor !== y.constructor) return false;
        // they must have the exact same prototype chain, the closest we can do is
        // test there constructor.

        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            // other properties were tested using x.constructor === y.constructor

            if (!y.hasOwnProperty(p)) return false;
            // allows to compare x[ p ] and y[ p ] when set to undefined

            if (x[p] === y[p]) continue;
            // if they have the same strict value or identity then they are equal

            if (typeof( x[p] ) !== "object") return false;
            // Numbers, Strings, Functions, Booleans must be strictly equal

            if (!Object.equals(x[p], y[p])) return false;
            // Objects and Arrays must be tested recursively
        }

        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
            // allows x[ p ] to be set to undefined
        }
        return true;
    }

    arr2Obj(X) {

        var O = {};

        for (var i = 0; i < X.length; i++) {

            var z = X[i];

            if (O[z]) O[z] += 1;
            else O[z] = 0;

        }

        return O;
    }

}

module.exports = {GraphMatcher: GraphMatcher};
