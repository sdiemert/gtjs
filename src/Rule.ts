/**
 * Created by sdiemert on 2015-11-03.
 */

import g = require("./Graph");

function defaultCallback(host:g.Graph, matchList:Array<number>):g.Graph {

    return host;

}

export class Rule {

    private matchGraph:g.Graph;

    private callback:Function;

    constructor(matchGraph:g.Graph, callback:Function) {
        this.matchGraph = matchGraph;
        this.callback = callback || defaultCallback;
    }

    /**
     * @param host
     *
     * @return: true if the host graph was successfully matched and modified, false otherwise.
     */
    public tryRule(host:g.Graph):g.Graph {

        var N:Array<Array<number>> = host.hasSubGraph(this.matchGraph);

        if (!N || N.length === 0) {

            return null;

        } else {

            var x = Math.floor(Math.random() * (N.length - 1));
            return this.callback(host, N[x]);

        }

    }

    /**
     * Returns sub graphs of the host that can have the rule applied.
     * @param host
     * @returns {Array<Array<number>>}
     */
    public canApply(host:g.Graph):Array<Array<number>> {

        var N:Array<Array<number>> = host.hasSubGraph(this.matchGraph);

        if (!N || N.length === 0) {

            return null;

        }else{

            return N;

        }

    }

    public doRule(host : g.Graph, vertices : Array<number>): g.Graph{

        return this.callback(host, vertices);

    }

}
