/**
 * Created by sdiemert on 2015-10-31.
 */

export class Node {

    private _value:Object;
    private _adjacent:Array<Node>;
    private _id:Number;

    public constructor(public id:Number, public value:Object, public adj:Array<Node>) {

        this._id = id;
        this._value = value;
        this._adjacent = adj;

    }

    /**
     * Adds a new node to the adjacency list of this node.
     * Since edges in the graphs are directional the adjacency only goes one way.
     *
     * @param n {Node} - The node to add to the adjacney list.
     */
    public addAdj(n:Node):void {
        this._adjacent.push(n);
    }

    public represent():string {

        var s:string = "< Node " + this._id + " : { value : " + JSON.stringify(this._value) + ", adjacent: [";

        for (var i = 0; i < this._adjacent.length; i++) {

            s += this._adjacent[i].getId();

            if (i != this._adjacent.length - 1) {

                s += ", ";

            }

        }

        s += "]}>";

        return s;
    }

    public getId():Number {

        return this._id;

    }


    public set adjacent(value:Array<Node>) {
        this._adjacent = value;
    }


    public getAdjacent():Array<Node> {
        return this._adjacent;
    }

}

export class Graph {

    private _name:string;
    private _nodes:Array<Node>;

    public constructor(public name:string, public nodes:Array<Node>) {

        this._name = name;
        this._nodes = nodes;

    }

    public addNode(n:Node):void {

        this._nodes.push(n);

    }

    public get getNodes():Array<Node> {
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
    public addAdj(n1:Node, n2:Node) {

        n1.addAdj(n2);

    }

    public addBiAdj(n1:Node, n2:Node){

        n1.addAdj(n2);
        n2.addAdj(n1);

    }

    public repAdjList():string {

        var tmp:Array<Node> = null;
        var s:string = "";

        for (var n = 0; n < this._nodes.length; n++) {


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
