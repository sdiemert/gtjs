/**
 * Created by sdiemert on 2015-10-31.
 */

import Entities = require("./Entities");
import util = require('util');
import gf = require('./GraphFactory');

function choose(n, k) {
    if (k === 0) {
        return 1;
    }
    return (n * choose(n - 1, k - 1)) / k
}

export class Graph extends Entities.Entity {

    private vertexSet:Array<Entities.Node> = [];
    private edgeSet:Array<Entities.Edge> = [];

    public constructor(value:Object) {

        super(value);

        this.vertexSet = [];
        this.edgeSet = [];

    }

    /**
     * Returns index of appended Node.
     *
     * @param n {Node}
     */
    public addNode(n:Entities.Node):number {

        this.vertexSet.push(n);
        return this.vertexSet.length - 1;
    }

    public removeNode(i:number):boolean {


        if (!this.vertexSet[i]) {
            return false;
        }

        var tmpNode:Entities.Node = this.vertexSet[i];

        var working:Array<Entities.Edge> = [];

        //remove any edges that were incident to this node.
        for (var e in this.edgeSet) {

            if (this.edgeSet[e].getEnd1() !== tmpNode && this.edgeSet[e].getEnd2() !== tmpNode) {
                working.push(this.edgeSet[e]);
            }

        }
        this.edgeSet = working;

        //delete this node.
        this.vertexSet.splice(i, 1);

        return true;
    }

    public addEdge(e:Entities.Edge):number {
        this.edgeSet.push(e);
        return this.edgeSet.length - 1;
    }

    public removeEdge(i:number):boolean {

        if (!this.edgeSet[i]) {
            return false;
        }

        delete this.edgeSet[i];
        return true;

    }

    public getVertices():Array<Entities.Node> {

        return this.vertexSet;

    }

    public getEdges():Array<Entities.Edge>{
       return this.edgeSet;
    }

    public asMatrix():Array<Array<number>> {

        var M = [];

        //init to all zeros.

        for (var i = 0; i < this.vertexSet.length; i++) {
            M.push([]);
            for (var j = 0; j < this.vertexSet.length; j++) {
                M[i].push(0);
            }
        }

        var end1Index:number = null;
        var end2Index:number = null;
        var dir:number = 0;

        for (var e = 0; e < this.edgeSet.length; e++) {

            dir = this.edgeSet[e].getDirection();
            end1Index = this.vertexSet.indexOf(this.edgeSet[e].getEnd1());
            end2Index = this.vertexSet.indexOf(this.edgeSet[e].getEnd2());

            if (dir === 1) {

                M[end1Index][end2Index] = 1;

            } else if (dir === -1) {

                M[end2Index][end1Index] = 1;

            } else {

                M[end1Index][end2Index] = 1;
                M[end2Index][end1Index] = 1;

            }

        }

        return M;

    }

    public repAsMatrix():string {

        var s:string = "";

        var M:Array<Array<number>> = this.asMatrix();

        for (var i = 0; i < M.length; i++) {
            for (var j = 0; j < M[i].length; j++) {
                s += M[i][j] + "\t";
            }
            s += "\n";
        }

        return s;
    }

    public getDegree(i:number):number{

        //degrees are defined as the number of outgoing edges.

        var count = 0;

        var v : Entities.Node = this.getVertices()[i];

        for(var e = 0; e < this.getEdges().length; e++){

            if(this.edgeSet[e].getDirection() !== -1 && this.edgeSet[e].getEnd1() === v){
                count++;
            }

        }

        return count;

    }


    /**
     * Makes an induced sub-graph based on the vertices that are passed in.
     * Returns the induced graph.
     * @param vertices
     */
    public inducedGraph(vertices: Array<number>) : Graph{

        vertices;

        var f : gf.GraphFactory = new gf.GraphFactory();
        var g = f.makeCopy(this);

        var toRemove = [];

        var num = g.getVertices().length;

        for(var v = 0; v < num; v++){

            if(vertices.indexOf(v) === -1){

                toRemove.push(v);
            }

        }

        console.log(toRemove);

        toRemove.sort();

        for(var r = toRemove.length - 1; r >= 0; r--){

            g.removeNode(r);

        }

        return g;

    }

    public isoMorphic(g:Graph):boolean {

        //console.log(this.repAsMatrix());
        //console.log(g.repAsMatrix());

        if(
            g.getVertices().length !== this.getVertices().length ||
            g.getEdges().length !== this.getEdges().length
        ){
            return false;
        }

        if(g.getVertices().length === 1 && g.getEdges().length === 0){
            return true;
        }

        var factory = new gf.GraphFactory();
        var graphA = null;
        var graphB = null;

        for(var i = 0; i < this.getVertices().length; i++){

            for(var j = 0; j < g.getVertices().length; j++){

                graphA = factory.makeCopy(g);
                graphB = factory.makeCopy(this);

                //check that the degrees of nodes being removed are equivalent

                //TODO: other comparisons here....

                if(graphA.getDegree(i) !== graphB.getDegree(j)){
                    delete graphA;
                    delete graphB;
                    continue;
                }

                graphA.removeNode(i);
                graphB.removeNode(j);

                if(graphB.isoMorphic(graphA)){
                    delete graphA;
                    delete graphB;
                    return true;
                }
            }
        }

        return false;
    }



    public hasSubGraph(H : Graph):boolean{



        return false;
    }

}