/**
 * Created by sdiemert on 2015-11-04.
 */

define(['require', 'exports'], function(require, exports){

    exports.getInput = function(node, id){

        var s = "";

        s += "<div class='form-group'>";
        s += "<label for='input-"+id+"'>"+node.getValue().label+"</label>";
        s += "<input type='text' id='input-"+id+"' class='form-control' />";
        s += "</div>";

        return s;
    };

    exports.getBox = function(node, id){

        var s = "";

        s += "<div class='panel panel-default' >";
        s += "<div id='box-"+id+"'class='panel-body' >";
        s += "</div>";
        s += "</div>";

        return s;
    };

});
