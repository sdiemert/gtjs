/**
 * Created by sdiemert on 2015-11-05.
 */

import graph = require('./Graph');
import graphFactory = require('./GraphFactory');
import {Action, AddNodeAction, AddSubGraph} from "./Action";
import {Rule, ActionRule} from "./Rule";
import {AddAction} from "./Action";
import {Value} from "./Entities";

export class RuleFactory {

    constructor() {
    }

    public ruleFromJson(obj:graphFactory.GraphObject):ActionRule {

        console.log(obj);

        // 1) extract match graph (anything but 'not' or 'new' nodes).

        var G = this.extractMatchGraph(obj);

        // 2) create actions according to nodes that need to be altered (added, removed, edited).

        var actions:Array<Action> = this.getActions(obj);

        // 3) return a new rule with the actions in order.

        return new ActionRule(actions, G);
    }

    private extractMatchGraph(obj:graphFactory.GraphObject):graph.Graph {

        var gf = new graphFactory.GraphFactory();

        var H = gf.graphFromObject(obj);

        var vertices = H.getVertices();

        //find nodes that are part of the match graph
        //  - not new nodes.

        var toInduce = [];

        for (var v = 0; v < vertices.length; v++) {

            if (!vertices[v].getValue().newEntity) {

                toInduce.push(v);

            }

        }

        var G:graph.Graph = H.inducedGraph(toInduce);

        return G;

    }

    private getActions(obj:graphFactory.GraphObject):Array<Action> {

        var actions:Array<Action> = [];

        //precedence:
        //  - edit actions
        //  - add actions
        //  - delete actions

        var toAdd:Array<number> = [];
        var newEdges = [];

        for (var n = 0; n < obj.nodes.length; n++) {

            if (obj.nodes[n].newEntity) {
                toAdd.push(n);
                newEdges = newEdges.concat(RuleFactory.findConnected(obj, n));
            }

        }

        var gf = new graphFactory.GraphFactory();
        var H = gf.graphFromObject(obj);

        var newGraph:graph.Graph = H.inducedGraph(toAdd);

        console.log(newGraph);
        console.log(newEdges);

        actions.push(new AddSubGraph('add sub graph', newGraph, newEdges));

        return actions;

    }


    private static findConnected(obj:graphFactory.GraphObject, n:number):
        Array<{ end1 : number, end2: number, direction : number, value : Value}> {

        var toReturn:Array<{ end1 : number, end2: number, direction : number, value : Value}> = [];

        for (var i = 0; i < obj.edges.length; i++) {

            if (
                (obj.edges[i].end1 === n && !obj.nodes[obj.edges[i].end2].newEntity)
            ) {
                toReturn.push(obj.edges[i]);
            }else if(
                obj.edges[i].end2 === n && !obj.nodes[obj.edges[i].end1].newEntity
            ){
                toReturn.push(obj.edges[i]);
            }

        }
        return toReturn;
    }


}
