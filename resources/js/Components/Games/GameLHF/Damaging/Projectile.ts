import { GameObject } from '../GameObject';
import { Actor } from '../Actors/Actor';

export class Projectile extends GameObject {
    protected damage: number = 0;
    protected source: Actor;

    protected coll(tgt: Actor): boolean {
        let tgtPos: [number, number] = tgt.getPos();
        let tgtSize: [number, number] = tgt.getSize();
        return this.x >= tgtPos[0] && this.x <= tgtPos[0] + tgtSize[0] && this.y >= tgtPos[1] && this.y <= tgtPos[1] + tgtSize[1] 
    }

    constructor(src:Actor) {
        super();
        this.source = src;
    }
}