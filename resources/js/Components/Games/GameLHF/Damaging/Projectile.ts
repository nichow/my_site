import { GameObject } from '../GameObject';

export class Projectile extends GameObject {
    protected damage: number = 0;

    public move(): void {
        super.move();
        if (this.x == 605 || this.y == 445 || this.x == 31 || this.y == 31)
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