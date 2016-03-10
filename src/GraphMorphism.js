"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 */

/**
 * A morphism between two Graph objects, G and H. Has the following
 * sub-morphisms:
 *  - Fv : G.V -> H.V
 *  - Fe : G.E -> H.E
 *
 * Such that the following properties hold:
 *  - Fv(G.T(x)) = H.T(Fe(x))
 *  - Fv(G.S(x)) = H.S(Fe(x))
 *  - H.Lv(Fv(x)) = G.Lv(x)
 *  - H.Le(Fv(x)) = G.Le(x)
 */

var Function = require("./Function.js").Function;

class GraphMorphism {

    constructor(src, target) {

        this.Fv = new Function();
        this.Fe = new Function();

        this.G = src;
        this.H = target;

    }

}

module.exports = {GraphMorphism : GraphMorphism};
