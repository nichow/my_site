import { Actor } from '../Actor';

export class Enemy extends Actor {
    protected score: number = 0;
    protected health: number = 1;
    protected isAlive: boolean = false;

    protected kill(): number {
        this.isAlive = false;
        return this.score;
    }

    public damage(): number {
        if (--this.health <= 0) {
            return this.kill();
        }
        return 0;
    }

    constructor() {
        super();
        this.isAlive = true;
    }
}