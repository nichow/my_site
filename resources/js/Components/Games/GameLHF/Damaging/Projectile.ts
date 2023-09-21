import { GameObject } from '../GameObject';
import { Actor } from '../Actors/Actor';

export class Projectile extends GameObject {
    protected damage: number = 0;

    protected coll(tgt: Actor): boolean {
        let tgtPos: [number, number] = tgt.getPos();
        let tgtSize: [number, number] = tgt.getSize();
        let collX: boolean = this.x >= tgtPos[0] && this.x <= tgtPos[0] + tgtSize[0]
        if (!collX)
            return false;
        let collY: boolean = this.y >= tgtPos[1] && this.y <= tgtPos[1] + tgtSize[1]
        return collY;
    }
}