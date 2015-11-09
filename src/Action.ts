/**
 * Created by sdiemert on 2015-11-05.
 */

import g = require('./Graph');
import en= require('./Entities');
import {GraphFactory, EdgeStruct} from './GraphFactory';
import {Value} from "./Entities";
import {Edge} from "./Entities";

export interface Action {

    doAction(host:g.Graph, apply:Array<number>) : g.Graph;
}

export class GraphAction implements Action {

    private _name:string;

    constructor(name:string) {
        this._name = name;
    };

    public doAction(host:g.Graph, apply:Array<number>):g.Graph {
        return null;
    }


    get name():string {
        return this._name;
    }

    set name(value:string) {
        this._name = value;
    }

}

export class AddNodeAction extends GraphAction {

    private newNodeValue:en.Value;

    constructor(name:string, newNodeValue:en.Value) {
        super(name);
        this.newNodeValue = newNodeValue;
    }

    /**
     * Creates a new graph node in the host graph with value described by newValue
     *
     * @param host
     * @param adj
     *
     * @return the host graph that has been modified.
     */
    public doAction(host:g.Graph, adj:Array<number>):g.Graph {

        var n = host.addNode(new en.Node(JSON.parse(JSON.stringify(this.newNodeValue))));

        return host;

    }

}

export class AddAction extends GraphAction {

    private newNodeValue:en.Value;
    private newEdgeValue:en.Value;

    constructor(name:string, newNodeValue:en.Value, newEdgeValue:en.Value) {
        super(name);
        this.newEdgeValue = newEdgeValue;
        this.newNodeValue = newNodeValue;
    }

    /**
     * Creates a new graph node in the host graph with value described by newValue that
     *  is adjacent to all nodes indicated in the adj array parameter.
     *
     * @param host
     * @param adj
     *
     * @return the host graph that has been modified.
     */
    public doAction(host:g.Graph, adj:Array<number>):g.Graph {

        var n = host.addNode(new en.Node(JSON.parse(JSON.stringify(this.newNodeValue))));

        for (var x = 0; x < adj.length; x++) {

            host.addEdgeByNumber(adj[x], n, JSON.parse(JSON.stringify(this.newEdgeValue)), 1);

        }

        return host;

    }

}

export class AddEdgesToExistingGraph extends GraphAction{

    private edges : Array<EdgeStruct>;

    constructor(name:string, edges : Array<EdgeStruct>) {
        super(name);
        this.edges = edges;
    }

    public doAction(host:g.Graph, match:Array<number>):g.Graph {

        console.log(match);

        for(var e = 0; e < this.edges.length; e++){

            host.addEdgeByNumber(
                match[this.edges[e].end1],
                match[this.edges[e].end2],
                this.edges[e].value,
                this.edges[e].direction
            );

        }

        return host;
    }


}

export class AddSubGraph extends GraphAction {

    private newGraph:g.Graph;
    private edges:Array<EdgeStruct>;

    constructor(name:string, newGraph:g.Graph, edges:Array<EdgeStruct>) {
        super(name);
        this.newGraph = newGraph;
        this.edges = edges;

    }

    /**
     * Adds the newGraph to the host graph with edges betweens between them.
     *
     * @param host
     * @param match
     * @returns {null}
     */
    public doAction(host:g.Graph, match:Array<number>):g.Graph {

        var gf = new GraphFactory();

        //this.edges contains the edges to add between the new graph and the host's matches.

        // 1) Add the nodes from the newGraph object to this graph.
        // 2) Add edges between the newGraph nodes and the host graph nodes as designated by the this.edges and match arrays.

        // Indices are the node # in the original graph, values are indices are the node number in the host.

        var newGraphNodeMap:Array<number> = [];

        for (var v = 0; v < this.newGraph.getVertices().length; v++) {

            newGraphNodeMap[v] = host.addNode(gf.copyNode(this.newGraph.getVertices()[v]));

        }

        // 1.5) Add edges between nodes that were given in the newGraph

        var e1, e2;
        for (var e = 0; e < this.newGraph.getEdges().length; e++) {

            e1 = this.newGraph.nodeIdFromObject(this.newGraph.getEdges()[e].getEnd1());
            e2 = this.newGraph.nodeIdFromObject(this.newGraph.getEdges()[e].getEnd2());

            host.addEdgeByNumber(
                newGraphNodeMap[e1],
                newGraphNodeMap[e2],
                this.newGraph.getEdges()[e].getValue(),
                this.newGraph.getEdges()[e].getDirection()
            );
        }


        // 2) Add edges between the matched values in the host graph and the new nodes.

        for(var e = 0; e < this.edges.length; e++){

            host.addEdgeByNumber(
                match[this.edges[e].end1],
                newGraphNodeMap[this.edges[e].end2 - match.length],
                this.edges[e].value,
                this.edges[e].direction
            );

        }

        return host;
    }

}
