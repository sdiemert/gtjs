/**
 * Created by sdiemert on 2015-10-31.
 */

import Graph = require("./Graph");
import Node = require("./Node");

export class GraphFactory{

    public constructor(){

    }

    /**
     *
     * @param list
     */
    public graphFromAdjList(name : string, list:Object):Graph.Graph{

        name = name || "G";

        var g = new Graph.Graph(name, []);

        var tmpNode : Node.Node = null;

        //add all of the nodes first.
        for(var n in list){

            tmpNode = new Node.Node(n, {}, []);
            g.addNode(tmpNode);

        }

        //once we get here the graph should contain nodes but no edges.

        for(var n in list){

            for(var a = 0; a < list[n].length; a++){

                g.addAdj(g.nodes[n], g.nodes[list[n][a]]);

            }

        }


        return g;
    }



}