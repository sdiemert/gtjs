/**
 * Created by sdiemert on 2015-10-31.
 */

export class Node {

    private _value:Object;
    private _adjacent:Array<Node>;
    private _id:number;

    public constructor(public id:number, public value:Object, public adj:Array<Node>) {

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

    public getId():number {

        return this._id;

    }


    public set adjacent(value:Array<Node>) {
        this._adjacent = value;
    }


    public getAdjacent():Array<Node> {
        return this._adjacent;
    }

}


