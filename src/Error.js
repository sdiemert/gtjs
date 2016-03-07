"use strict";
/**
 * Created by sdiemert on 2016-03-06.
 */


/**
 *
 * @param m {String} a message for the error.
 * @constructor
 */
function InvalidMorphismError(m){

    this.message = m;

}

module.exports = {
    InvalidMorphismError : InvalidMorphismError
};
