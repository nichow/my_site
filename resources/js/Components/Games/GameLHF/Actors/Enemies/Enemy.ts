import { Actor } from '../Actor';

export class Enemy extends Actor {
    protected score: number = 0;

    constructor() {
        super();
    }
}