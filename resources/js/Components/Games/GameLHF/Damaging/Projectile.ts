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

    public move(): void {
        super.move();
        if (this.x == 480 || this.y == 480 || this.x == 0 || this.y == 0)
            this.kill();
    }

    constructor(x: number, y: number, l: boolean, r: boolean, u: boolean, d: boolean) {
        super();
        this.setPos([x, y])
        this.w = 4;
        this.h = 4;
        this.v = 4;

        this.right = r;
        this.left = l;
        this.down = d;
        this.up = u;
    }
}