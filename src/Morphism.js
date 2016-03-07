/**
 * Created by sdiemert on 2016-03-06.
 */

"use strict";

var InvalidMorphismError = require("./Error.js").InvalidMorphismError;

class Morphism {

    /**
     * An object that represents the morphism.
     * every key into the object is the domain.
     * Every value is an Array of items that the
     * key maps to.
     *
     * @param m {Object} already contains a mapping to build off of.
     *  has structure like: { key : [val1, val2, ...], ... }
     */
    constructor(m) {

        if (!m) {

            this._mapping = {};

        } else {

            this._mapping = m;

        }

        if (!this.structureOk()) {
            throw new InvalidMorphismError("Structure of Morphism is invalid.")
        }

    }

    /**
     * Checks the structure of the morphism to make sure it
     * is not invalid.
     *
     * @return {boolean} false if the structure is invalid, true otherwise.
     */
    structureOk() {

        for (var k in this._mapping) {
            if (!(this._mapping[k] instanceof Array)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Adds the source (s) to the domain and the target (t)
     * to the codomain. A mapping s -> t is also added.
     *
     * @param s the source of the mapping.
     * @param t the destination of the mapping.
     */
    put(s, t) {

        if (!this._mapping[s]) {

            this._mapping[s] = [t];

        } else {

            this._mapping[s].push(t);

        }

    }

    /**
     * Gets the domain of the morphism.
     *
     * @returns {Array}
     */
    getDomain() {
        return Object.keys(this._mapping);
    }

    getCoDomain() {

        var toReturn = [];

        // Loop through object keys.
        for (var k in this._mapping) {

            // Loop through arrays.
            for (var i = 0; i < this._mapping[k].length; i++) {

                if (toReturn.indexOf(this._mapping[k][i]) === -1) {
                    toReturn.push(this._mapping[k][i]);
                }

            }

        }

        return toReturn;

    }

    /**
     * Removes the mapping between elements x and y. If only x is given removes
     * x from the domain.
     * @param x {Object} element from the domain to remove.
     * @param y {Object | undefined} element from the codomain to remove.
     * @return {boolean} returns true if successfully removed, false otherwise.
     */
    remove(x, y) {

        if (!this._mapping[x]) return false;

        if (y !== null && y !== undefined) {

            // Check that the thing we are removing is there...

            if (this._mapping[x].indexOf(y) === -1) return false;

            // remove y from x's mapping.
            this._mapping[x].splice(this._mapping[x].indexOf(y), 1);

            // only delete x from the domain if it has nothing to map to
            // in the co-domain.
            if (this._mapping[x].length === 0) delete this._mapping[x];

        } else {

            // if y is not defined we just remove all of x.
            delete this._mapping[x];

        }

        return true;

    }

    /**
     * Gets all of the value mapped from x.
     * @param x {Object}
     * @returns {Array}
     */
    get(x) {

        if (!this._mapping[x]) {
            return null;
        } else {
            return this._mapping[x];
        }

    }

    /**
     * Gets a single value mapped by x.
     * @param x
     * @returns {Object}
     */
    getOne(x) {

        // TODO: Make this random???

        var a = this.get(x);

        if (a) {
            return a[0]
        } else {
            return null;
        }
    }

    toString() {

        var s = "{ ";

        for (var k in this._mapping) {

            for (var i = 0; i < this._mapping[k].length; i++) {

                s += "(" + k + "," + this._mapping[k][i] + "), ";

            }

        }

        s += "}";

        return s;

    }

}

module.exports = {Morphism: Morphism};

