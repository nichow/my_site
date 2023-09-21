import { Actor } from './Actor'

export class Player extends Actor {
    public readonly color: string = 'white';

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