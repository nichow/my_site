import { GameObject } from "../GameObject";

export class Actor extends GameObject {
    protected health: number = 1;

    public damage(): void {
        if (--this.health <= 0) {
            this.kill();
        }
    }
}