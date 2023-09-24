import { Enemy } from './Enemy';
import { Actor } from '../Actor';
import { Player } from '../Player';
import { Family } from '../Family/Family';

export class Thing extends Enemy {
    public readonly color: string = 'green';
    public hunting: boolean = false;
    private target: Actor;

    // can't be killed, can be slowed
    public async damage() {
        this.v = 0.125;
        await this.waitfor(1000);
        this.v = 0.25;
    }

    public hunt(): void {
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

    private distance(target: Actor): number {
        const [x, y]: [number, number] = this.getPos();
        let [tx, ty]: [number, number] = target.getPos();
        const a: number = x - tx;
        const b: number = y - ty;
        const c: number = Math.sqrt(a * a + b * b);
        return c;
    }

    public async changeTarget(potential: Array<Actor>) {
        let _target: Actor = this.target;
        let dist: number = _target.isAlive() ? this.distance(_target) : 1012;
        _target = potential.reduce((newTarget, actor) => {
            if (actor !== this.target) {
                let testDist: number = this.distance(actor);
                if (testDist < dist) {
                    newTarget = actor;
                    dist = testDist;
                }
            }
            return newTarget ? newTarget : this.target;
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
        this.v = 0.25;
        this.target = p;
        let potential: Array<Actor> = fam;
        potential.push(p);
        this.changeTarget(potential);
    }
}