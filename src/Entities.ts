/**
 * Created by sdiemert on 2015-10-31.
 */

export interface Value {
    type: string;
    newEntity : boolean;
}

export class Entity {

    private value:Value = null;

    public constructor(value:Value) {

        this.value = value || {type: null, newEntity : false};
    }

    public getValue():Value {
        return this.value;
    }

}

export class Node extends Entity {

    public constructor(value:Value) {
        super(value);
    }

}

export class Edge extends Entity {

    private end1:Node = null;
    private end2:Node = null;

    // 1 : end1 -> end2
    // -1: end1 <- end2
    // 0 : end1 <-> end2
    private direction:number = null;

    public constructor(value:Value, end1:Node, end2:Node, direction:number) {

        super(value);

        this.end1 = end1;
        this.end2 = end2;

        this.direction = direction;

    }

    public getEnd1():Node {
        return this.end1;
    }

    public getEnd2():Node {

        return this.end2;
    }

    public getDirection():number {
        return this.direction;
    }
}
