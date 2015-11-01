/**
 * Created by sdiemert on 2015-10-31.
 */


import g = require("./Graph");
import en = require("./Entities");

export class GraphFactory {

    public constructor() {
    }

    public newGraphFromAdjList(list:Object, name:string):g.Graph {

        //list is an object, the keys are nodes, elements are arrays of adjacent nodes.

        var tmpNode:en.Node = null;
        var tmpEdge:en.Edge = null;

        var newGraph:g.Graph = new g.Graph({name: name});

        //create nodes.
        for (var x in list) {
            tmpNode = new en.Node({name: "N" + x});
            newGraph.addNode(tmpNode);
        }

        //create edges
        for (var x in list) {
            for (var e in list[x]) {
                tmpEdge = new en.Edge({}, newGraph.getVertices()[x], newGraph.getVertices()[list[x][e]], 1);
                newGraph.addEdge(tmpEdge);
            }
        }


        return newGraph;
    }

    public newGraphFromMatrix(M:Array<Array<number>>, name:String):g.Graph {

        var newGraph:g.Graph = new g.Graph({name: name});


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

    private copyNode(n:en.Node):en.Node {
        var newNode:en.Node = new en.Node(n.getValue());
        return newNode;
    }

    private copyEdge(e:en.Edge):en.Edge {
        var newEdge:en.Edge = new en.Edge(e.getValue(), e.getEnd1(), e.getEnd2(), e.getDirection());
        return newEdge;
    }

}
