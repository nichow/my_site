import { GameObject } from "../GameObject";

export class Actor extends GameObject {
    public left:  boolean = false;
    public right: boolean = false;
    public up:    boolean = false;
    public down:  boolean = false;

    public move(): void {
        let newX: number = this.x;
        let newY: number = this.y;
        if (this.left) {
            newX -= this.v;
        }
        if (this.right) {
            newX += this.v;
        }
        if (this.up) {
            newY -= this.v;
        }
        if (this.down) {
            newY += this.v;
        }
        this.setPos([newX, newY]);
    }
}