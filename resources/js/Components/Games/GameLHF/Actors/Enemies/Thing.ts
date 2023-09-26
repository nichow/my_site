import { Enemy } from './Enemy';
import { Actor } from '../Actor';
import { Player } from '../Player';
import { Family } from '../Family/Family';

const v: number = .4;

export class Thing extends Enemy {
    public readonly color: string = 'green';
    public hunting: boolean = false;
    private target: Actor;

    private distance(target: Actor): number {
        if (!target.isAlive()) {
            return Number.MAX_SAFE_INTEGER;
        }
        const [x, y]: [number, number] = this.getPos();
        const [tx, ty]: [number, number] = target.getPos();
        const a: number = x - tx;
        const b: number = y - ty;
        const c: number = a * a + b * b;
        return c;
    }

    // can't be killed, can be slowed
    public async damage() {
        this.v = v / 2;
        await this.waitfor(1000);
        this.v = v;
    }
    
    public hunt(): void {
        if(!this.target.isAlive())
            this.hunting = false;
        else {
            let [tx, ty]: [number, number] = this.target.getPos(); 
            if (tx < this.x) {
                this.left = true;
                this.right = false;
            } else if (tx > this.x) {
                this.right = true;
                this.left = false;
            } else {
                this.left = false;
                this.right = false;
            }
            if (ty > this.y) {
                this.down = true;
                this.up = false;
            } else if (ty < this.y) {
                this.up = true; 
                this.down = false;
            } else {
                this.up = false;
                this.down = false;
            }
        }
    }


    public changeTarget(potential: Array<Actor>) {
        let _target: Actor = potential.reduce((newTarget, actor) => {
            if (this.distance(newTarget) > this.distance(actor)) {
                newTarget = actor;
            }
            return newTarget;
        });
        this.hunting = true;
        this.target = _target;
    }

    public getTarget(): Actor {
        return this.target;
    }

    constructor(x: number, y: number, p: Player, fam: Array<Family>) {
        super();
        this.x = x; 
        this.y = y; 
        this.w = 20;
        this.h = 30;
        this.v = v;
        this.target = p;
        let potential: Array<Actor> = fam;
        potential.push(p);
        this.changeTarget(potential);
    }
}