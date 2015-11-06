requirejs(['../../bin/Graph', '../../bin/Rule', '../../bin/Entities',
    'modelSystem', '../js/vis.min.js', '../../bin/VizJsAdaptor', 'interfaceModels',
    '../../bin/GraphFactory'], function(Graph, Rule, En, sys, vis, Adaptor, iFace, GF){

    var gf = new GF.GraphFactory();
    var UIModel = gf.graphFromObject(JSON.parse('{"name":"M","nodes":[{"type":"root","new":false},{"type":"box","new":true}],"edges":[{"end1":0,"end2":1,"direction":1,"value":{"type":null,"new":false}}]}'));

    function showGraph(id, toShow){

        var A = new Adaptor.VizJsAdaptor();

        var a = A.adapt(toShow);

        var nodes = new vis.DataSet(a.nodes);
        var edges = new vis.DataSet(a.edges);
        var container = document.getElementById(id);
        var data = {
            nodes : nodes,
            edges : edges
        };
        var net = new vis.Network(container, data, {});

    }


    function renderModel(rootId, modelroot, model){

        var adj = model.getAdjacentNodes(model.getVertices()[modelroot]);

        var x = null;

        for(var v = 0; v < adj.length; v++){

            x = model.getVertices().indexOf(adj[v]);

            if(adj[v].getValue().type === 'box'){


                $(rootId).append(iFace.getBox(adj[v], x));

                console.log("x: "+ x);

                renderModel('#box-'+x, x, model);

            }else if(adj[v].getValue().type === 'input'){

                console.log(rootId);
                $(rootId).append(iFace.getInput(adj[v], x));

            }

        }


    }

    function addInput2(){

        sys.AddInput2.tryRule(UIModel);

        $("#root").text("");
        renderModel('#root', 0, UIModel);

        showGraph('graph-show', UIModel);

    }


    function addInput(){

        sys.AddInput.tryRule(UIModel);

        $("#root").text("");
        renderModel('#root', 0, UIModel);

        showGraph('graph-show', UIModel);

    }

    function addBox(){

        sys.AddBox.tryRule(UIModel);
        $("#root").text("");
        renderModel('#root', 0, UIModel);
        showGraph('graph-show', UIModel);

    }

    showGraph('graph-show', UIModel);

    $('#add-input-button').click(addInput);
    $('#add-input-button2').click(addInput2);
    $('#add-box-button').click(addBox);

});