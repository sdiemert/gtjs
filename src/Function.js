/**
 * Created by sdiemert on 2016-03-06.
 */
"use strict";

var Morphism = require("./Morphism.js").Morphism;

var InvalidFunctionError = require("./Error.js").InvalidFunctionError;

class Function extends Morphism {

    constructor(m) {
        super(m);

        if (!this.structureOk()) {
            throw new InvalidFunctionError("Cannot make a Function out of passed object.");
        }
    }

    structureOk() {

        // ensure that function properties are observed:
        //  - every element of domain maps to only one element of codomain
        //  - every element of domain maps to something in codomain


        if (!super.structureOk()) {

            return false;

        } else {

            for (var k in this._mapping) {

                if (this._mapping[k].length !== 1) {
                    return false;
                }

            }

            //return true if the super() says its OK too...
            return true;
        }

    }

    /**
     * Should return a single element, since this a function.
     *
     * @param x
     * @returns {Object}
     */
    get(x){
        var r = super.get(x);
        if(r) return r[0];
        else null;
    }

}

module.exports = {Function: Function};

