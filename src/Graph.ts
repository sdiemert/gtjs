/**
 * Created by sdiemert on 2015-10-31.
 */

import node = require("./Node");

export class Graph {

    private _name:string;
    private _nodes:Array<node.Node>;

    public constructor(public name:string, public nodes:Array<node.Node>) {

        this._name = name;
        this._nodes = nodes;

    }

    public addNode(n:node.Node):void {

        if(this._nodes[n.getId()]){
            throw new Error("A node with id: "+n.getId()+" already exists in this graph!");
        }

        this._nodes[n.getId()] = n;

    }

    public get getNodes():Array<node.Node> {
        return this._nodes;
    }

    /**
     * Adds an adjacency from n1->n2.
     *
     * @precondition n1Exists: n1 must exist in the graph's nodes array.
     *
     * @postcondition n1Andn2Exists : n1 and n2 both exist in the graph's nodes array.
     * @postcondition adjcent: an adjaceny exists between n1 and n2.
     *
     * @param n1 {Node}
     * @param n2 {Node}
     */
    public addAdj(n1:node.Node, n2:node.Node) {

        n1.addAdj(n2);

    }

    public addBiAdj(n1:node.Node, n2:node.Node){

        n1.addAdj(n2);
        n2.addAdj(n1);

    }

    public repAdjList():string {

        var tmp:Array<node.Node> = null;
        var s:string = "Graph:\t"+this._name+ "\n";

        for (var n in this._nodes) {


            s += this._nodes[n].getId() + "\t->\t";

            tmp = this._nodes[n].getAdjacent();

            for (var x = 0; x <tmp.length; x++) {

                s += tmp[x].getId() + ", ";

            }

            s += "\n";

        }

        return s;

    }

}
