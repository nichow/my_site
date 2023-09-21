import { Projectile } from "./Projectile";
import { Enemy } from "../Actors/Enemies/Enemy";

export class Bullet extends Projectile {
    public readonly color: string = 'orange';

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