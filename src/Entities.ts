/**
 * Created by sdiemert on 2015-10-31.
 */

class Entity{

    private value : Object = null;

    public constructor(value:Object){

        this.value = value;
    }

}

export class Node extends Entity{

    public constructor(value:Object){
       super(value);
    }

}

export class Edge extends Entity{

    private end1:Object = null;
    private end2:Object = null;

    // 1 : end1 -> end2
    // -1: end1 <- end2
    // 0 : end1 <-> end2
    private direction:number = null;

    public constructor(value:Object, end1:Node, end2:Node, direction : number){

        super(value);

        this.end1 = end1;
        this.end2 = end2;

        this.direction = direction;

    }

}
