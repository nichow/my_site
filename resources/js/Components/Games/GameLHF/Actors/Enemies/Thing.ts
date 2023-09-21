import { Enemy } from './Enemy';

export class Thing extends Enemy {
    public readonly color: string = 'red';

    constructor(xStart: number, yStart: number) {
        super();
        this.x = xStart;
        this.y = yStart;
        this.w = 15;
        this.h = 30;
        this.score = 100;
    }
}