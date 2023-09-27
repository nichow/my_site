import { Enemy } from './Enemy';

const WIDTH: number = 640;
const HEIGHT: number = 480;
const BG = {x: 0, y: 0, w:WIDTH, h:HEIGHT};
const PLAYABLE = {x:30, y:30, w:BG.w - 60, h:BG.h - 60};

export class Mook extends Enemy {
    public readonly color: string = 'red';

    private async wander() {
        while (this.isAlive) {
            await this.chooseDirection();
        }
    }

    private async chooseDirection() {
        let direction: number = Math.floor(Math.random() * 5);
        switch(direction) {
            case 0: {
                if (this.x < 50) {
                    this.right = true; 
                    this.left = false;
                } else {
                    this.left = true;
                    this.right = false;
                }
                this.up = false;
                this.down = false;
                break;
            }
            case 1: {
                if (this.x > PLAYABLE.w + 50) {
                    this.left = true;
                    this.right = false;
                } else {
                    this.left = false;
                    this.right = true;
                }
                this.up = false;
                this.down = false;
                break;
            }
            case 2: {
                this.left = false;
                this.right = false;
                if (this.y < 50) {
                    this.up = false;
                    this.down = true;
                } else {
                    this.up = true;
                    this.down = false;
                }
                break;
            }
            case 3: {
                this.left = false;
                this.right = false;
                if (this.y < PLAYABLE.h + 50) {
                    this.up = true;
                    this.down = false;
                } else {
                    this.up = false;
                    this.down = true;
                }
                break;
            }
        }
        // ms 
        let ms: number = Math.floor(100 + Math.random() * 750);
        await this.waitfor(ms);
    }

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
        this.w = 10;
        this.h = 15;
        this.v = 1;
        this.score = 100;
        this.wander();
    }
}