/**
 * Created by sdiemert on 2015-11-05.
 */

import {Graph} from './Graph';
import graphFactory = require('./GraphFactory');
import {Action, AddNodeAction, AddSubGraph} from "./Action";
import {Rule, ActionRule} from "./Rule";
import {AddAction} from "./Action";
import {Value} from "./Entities";
import {AddEdgesToExistingGraph} from "./Action";

export class RuleFactory {

    constructor() {
    }

    public ruleFromJson(obj:graphFactory.GraphObject):ActionRule {

        // 1) extract match graph (anything but 'not' or 'new' nodes).

        var G:Graph = this.extractMatchGraph(obj);

        // 2) create actions according to nodes that need to be altered (added, removed, edited).

        var actions:Array<Action> = this.getActions(obj);

        // 3) sanitize the match graph to remove any 'new' edges or nodes that might have slipped through.

        G = RuleFactory.sanitizeMatchGraph(G);

        console.log(G);

        // 4) return a new rule with the actions in order.

        return new ActionRule(actions, G);
    }

    private extractMatchGraph(obj:graphFactory.GraphObject):Graph {

        var gf = new graphFactory.GraphFactory();

        var H:Graph = gf.graphFromObject(obj);

        var vertices = H.getVertices();

        //find nodes that are part of the match graph
        //  - not new nodes.

        var toInduce = [];

        for (var v = 0; v < vertices.length; v++) {

            if (!vertices[v].getValue().newEntity) {

                toInduce.push(v);

            }

        }

        var G:Graph = H.inducedGraph(toInduce);

        return G;

    }

    private getActions(obj:graphFactory.GraphObject):Array<Action> {

        var actions:Array<Action> = [];

        //precedence:
        //  - edit actions
        //  - add actions
        //  - delete actions

        // TODO: Call edit actions here....

        RuleFactory.extractAddActions(obj, actions);

        RuleFactory.extractDeleteActions(obj, actions);

        return actions;

    }

    private static sanitizeMatchGraph(G:Graph):Graph {

        var vertices = G.getVertices();
        var edges = G.getEdges();

        for (var v = 0; v < vertices.length; v++) {
            if (vertices[v].getValue().newEntity) {
                G.removeNode(v);
            }
        }

        for (var e = 0; e < edges.length; e++){
            if(edges[e].getValue().newEntity){
                G.removeEdge(e);
            }
        }

        return G;
    }

    private static extractDeleteActions(obj:graphFactory.GraphObject, actions:Array<Action>) {


    }

    private static extractAddActions(obj:graphFactory.GraphObject, actions:Array<Action>) {

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

        var newGraph:Graph = H.inducedGraph(toAdd);

        actions.push(new AddSubGraph('add sub graph', newGraph, newEdges));

        newEdges = [];

        for (var e = 0; e < obj.edges.length; e++) {

            //check that neither nodes of the end are "new"
            if (
                obj.edges[e].value.newEntity && !obj.nodes[obj.edges[e].end1].newEntity && !obj.nodes[obj.edges[e].end2].newEntity
            ) {
                newEdges.push(obj.edges[e]);
            }

        }

        actions.push(new AddEdgesToExistingGraph('add edges to existing graph', newEdges));
    }


    private static findConnected(obj:graphFactory.GraphObject, n:number):Array<{ end1 : number, end2: number, direction : number, value : Value}> {

        var toReturn:Array<{ end1 : number, end2: number, direction : number, value : Value}> = [];

        for (var i = 0; i < obj.edges.length; i++) {

            if (
                (obj.edges[i].end1 === n && !obj.nodes[obj.edges[i].end2].newEntity)
            ) {
                toReturn.push(obj.edges[i]);
            } else if (
                obj.edges[i].end2 === n && !obj.nodes[obj.edges[i].end1].newEntity
            ) {
                toReturn.push(obj.edges[i]);
            }

        }
        return toReturn;
    }


}
