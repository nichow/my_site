import { GameObject } from "../GameObject";
import { Bullet } from "../Damaging/Bullet";

export class Actor extends GameObject {
    protected health: number = 1;
    public fleft: boolean = false;
    public fright: boolean = false;
    public fup: boolean = false;
    public fdown: boolean = false;
    protected recoiling: boolean = false;

    protected async recoil(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    public damage(): void {
        if (--this.health <= 0) {
            this.kill();
        }
    }

    public isRecoiling(): boolean {
        return this.recoiling;
    }
}