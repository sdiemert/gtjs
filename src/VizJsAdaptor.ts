/**
 * Created by sdiemert on 2015-11-03.
 */

import g = require('./Graph');

export class VizJsAdaptor{

    constructor(){}

    public adapt(G : g.Graph):Object{

        var toReturn = { edges : [], nodes : []} ;

        var V = G.getVertices();

        var E = G.getEdges();

        for(var v = 0; v < V.length; v++){

            toReturn.nodes.push({id : v, label: v});

        }

        for(var e = 0; e < E.length; e++){


            if(E[e].getDirection() === 1){
                toReturn.edges.push(
                    {from : V.indexOf(E[e].getEnd1()), to: V.indexOf(E[e].getEnd2()), arrows: {to:true}}
                );
            }else if(E[e].getDirection() === -1){
                toReturn.edges.push(
                    {from : V.indexOf(E[e].getEnd1()), to: V.indexOf(E[e].getEnd2()), arrows: {from:true}}
                );
            }else{
                toReturn.edges.push(
                    {from : V.indexOf(E[e].getEnd1()), to: V.indexOf(E[e].getEnd2())}
                );
            }



        }

        return toReturn;

    }


}
