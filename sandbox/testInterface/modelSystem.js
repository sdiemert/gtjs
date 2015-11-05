/**
 * Created by sdiemert on 2015-11-04.
 */

define(['require', 'exports', '../../bin/Graph', '../../bin/Rule', '../../bin/Entities'], function (require, exports, Graph, Rule, En) {

    var M = new Graph.Graph();
    M.addNode(new En.Node({type: 'root'}));

    var M1 = new Graph.Graph();
    M1.addNode(new En.Node({type: 'box'}));


    var M2 = new Graph.Graph();
    M2.addNode(new En.Node({type: 'root'}));
    M2.addNode(new En.Node({type: 'box'}));
    M2.addNode(new En.Node({type: 'box'}));
    M2.addEdgeByNumber(0, 1, {}, 1);
    M2.addEdgeByNumber(0, 2, {}, 1);

    exports.AddInput = new Rule.Rule(M1, function (host, ids) {

        var x = host.addNode(new En.Node({type: 'input', label: 'Label'}));
        host.addEdgeByNumber(ids[0], x, {}, 1);
        return host;

    });

    exports.AddInput2 = new Rule.Rule(M2, function (host, ids) {

        console.log("Match!");

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
