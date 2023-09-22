import { Actor } from './Actor'
import { Bullet } from '../Damaging/Bullet';

export class Player extends Actor {
    public readonly color: string = 'white';
    public bullets: Array<Bullet> = [];
    private readonly recoilTime: number = 150;
    
    public async fire() {
        const firing: boolean = this.fleft || this.fright || this.fdown || this.fup;
        if (firing && !this.recoiling) {
            this.bullets.push(new Bullet(this.x, this.y, this.fleft, this.fright, this.fup, this.fdown));
            this.recoiling = true;
            await this.recoil(this.recoilTime);
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