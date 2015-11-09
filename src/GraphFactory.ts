/**
 * Created by sdiemert on 2015-10-31.
 */


import g = require("./Graph");
import en = require("./Entities");

export interface GraphObject{

    name : string;
    nodes : [ en.Value ];
    edges : [ { end1 : number, end2: number, direction : number, value : en.Value } ];

}

export interface EdgeStruct {end1:number, end2:number, direction:number, value:en.Value};

export class GraphFactory {

    public constructor() {}

    /**
     * {name : XXXX, nodes: [{type: XXX, ... }], edges: [{end1 : Y, end2: Z, direction: W, value : {type : XXX}, ... }]
     *  - Where the id of the nodes used in edges are indices in the of nodes.
     */
    public graphFromObject(obj : GraphObject):g.Graph{

        var G = new g.Graph(null);

        for(var n = 0; n < obj.nodes.length; n++ ){

            G.addNode(new en.Node(obj.nodes[n]));

        }

        for(var e = 0; e < obj.edges.length; e++){

            G.addEdgeByNumber(obj.edges[e].end1, obj.edges[e].end2, obj.edges[e].value, obj.edges[e].direction);

        }

        return G;
    }

    public newGraphFromAdjList(list:Object, name:string):g.Graph {

        //list is an object, the keys are nodes, elements are arrays of adjacent nodes.

        var tmpNode:en.Node = null;
        var tmpEdge:en.Edge = null;

        var newGraph:g.Graph = new g.Graph(null);

        //create nodes.
        for (var x in list) {
            tmpNode = new en.Node(null);
            newGraph.addNode(tmpNode);
        }

        //create edges
        for (var x in list) {
            for (var e in list[x]) {
                tmpEdge = new en.Edge(null, newGraph.getVertices()[x], newGraph.getVertices()[list[x][e]], 1);
                newGraph.addEdge(tmpEdge);
            }
        }


        return newGraph;
    }

    public newGraphFromMatrix(M:Array<Array<number>>, name:String):g.Graph {

        var newGraph:g.Graph = new g.Graph(null);

        var tmpNode:en.Node = null;
        var tmpEdge:en.Node = null;

        //TODO: Finish Me.

        return newGraph;
    }

    public makeCopy(G:g.Graph):g.Graph {

        var newGraph :g.Graph = new g.Graph(G.getValue());

        var vertices = G.getVertices();
        var edges = G.getEdges();

        var tmpEdge : en.Edge;

        for (var v = 0; v < vertices.length; v++) {
            newGraph.addNode(this.copyNode(vertices[v]));
        }

        for(var e = 0; e < edges.length; e++){

            tmpEdge = new en.Edge(
                edges[e].getValue(),
                newGraph.getVertices()[vertices.indexOf(edges[e].getEnd1())],
                newGraph.getVertices()[vertices.indexOf(edges[e].getEnd2())],
                edges[e].getDirection()
            );

            newGraph.addEdge(tmpEdge);
        }

        return newGraph;

    }

    public copyNode(n:en.Node):en.Node {
        var newNode:en.Node = new en.Node(n.getValue());
        return newNode;
    }

}
