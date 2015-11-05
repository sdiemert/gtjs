/**
 * Created by sdiemert on 2015-11-04.
 */

define(['require', 'exports', '../../bin/Graph', '../../bin/Rule', '../../bin/Entities', '../../bin/GraphFactory'],
    function (require, exports, Graph, Rule, En, Factory) {

        var gf = new Factory.GraphFactory();


    var M = new Graph.Graph();
    M.addNode(new En.Node({type: 'root'}));

    var M1 = new Graph.Graph();
    M1.addNode(new En.Node({type: 'box'}));

    var M2 = gf.graphFromObject({

        name : 'M2',
        nodes : [{type : 'root'}, {type : 'box'}, {type : 'box'}],
        edges : [
            {end1 : 0, end2: 1, direction : 1, value : {type : null} },
            {end1 : 0, end2: 2, direction : 1, value : {type : null} },
        ]
    });

    exports.AddInput = new Rule.Rule(M1, function (host, ids) {

        var x = host.addNode(new En.Node({type: 'input', label: 'Label'}));
        host.addEdgeByNumber(ids[0], x, {}, 1);
        return host;

    });

    exports.AddInput2 = new Rule.Rule(M2, function (host, ids) {

        var x = host.addNode(new En.Node({type: 'input', label: 'Label'}));
        host.addEdgeByNumber(ids[2], x, {}, 1);
        return host;

    });

    exports.AddBox = new Rule.Rule(M, function (host, ids) {

        var x = host.addNode(new En.Node({type: 'box'}));
        host.addEdgeByNumber(ids[0], x, {}, 1);
        return host;

    });

});
