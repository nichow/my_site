import { Actor } from './Actor'
import { Bullet } from '../Damaging/Bullet';

export class Player extends Actor {
    public readonly color: string = 'white';
    public bullets: Array<Bullet> = [];
    public fleft: boolean = false;
    public fright: boolean = false;
    public fup: boolean = false;
    public fdown: boolean = false;
    public recoiling: boolean = false;
    
    private async recoil(ms: number) {
        return new Promise<void>((resolve) => {
            setTimeout(resolve, ms);
        });
    }

    public async fire() {
        const firing: boolean = this.fleft || this.fright || this.fdown || this.fup;
        if (firing && !this.recoiling) {
            this.bullets.push(new Bullet(this.x, this.y, this.fleft, this.fright, this.fup, this.fdown));
            this.recoiling = true;
            console.log(this.bullets);
            await this.recoil(250);
            this.recoiling = false;
        }
    }


    constructor() {
        super();
        this.x = 240;
        this.y = 240;
        this.w = 10;
        this.h = 10;
        this.v = 2;
        this.setPos([this.x, this.y]);
    }
}