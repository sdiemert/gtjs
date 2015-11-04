/**
 * Created by sdiemert on 2015-11-03.
 */

import g = require("./Graph");

function defaultCallback(host : g.Graph, matchList : Array<number>):g.Graph{

    console.log("I am a default callback function!");
    console.log(matchList);

    return host;

}

export class Rule{

    private matchGraph : g.Graph;

    private callback : Function;

    constructor(matchGraph : g.Graph, callback : Function){
        this.matchGraph = matchGraph;
        this.callback = callback || defaultCallback;
    }

    /**
     *
     * @param host
     *
     * @return: true if the host graph was successfully matched and modified, false otherwise.
     */
    public tryRule(host : g.Graph):g.Graph{

        var N : Array<number> = host.hasSubGraph(this.matchGraph);

        if(!N){

            return null;

        }else{

            return this.callback(host, N);

        }

    }

}
