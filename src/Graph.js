"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 */

var Function = require("./Function.js").Function;

class Graph {

    constructor() {

        this.E = [];
        this.V = [];

        this.S  = new Function();
        this.T  = new Function();
        this.Le = new Function();
        this.Lv = new Function();

        this.vid_counter = 0;
        this.eid_counter = 0;

    }

    /**
     * Adds a vertex to the graph with an optional label.
     *
     * @param label {Object}
     * @returns {number}
     */
    addVertex(label) {

        this.V.push(this.vid_counter);

        if (label) {
            this.Lv.put(this.vid_counter, label);
        }

        return this.vid_counter++;

    }

    getVertices() {
        return this.V;
    }

    getVertexLabel(x){
        return this.Lv.get(x);
    }

}

module.exports = {Graph: Graph};
