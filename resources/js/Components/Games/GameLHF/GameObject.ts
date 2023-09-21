export class GameObject {
    protected alive: boolean = false;

    protected x: number = 0;
    protected y: number = 0;
    protected w: number = 0;
    protected h: number = 0;
    protected v: number = 0;

    public left:  boolean = false;
    public right: boolean = false;
    public up:    boolean = false;
    public down:  boolean = false;

    public color: string = 'black';

    protected setPos(pos: [number, number]): void {
        let x: number = pos[0];
        let y: number = pos[1];
        x = x < 0 ? 0 : x;
        x = x > 480 ? 480 : x;
        y = y < 0 ? 0 : y;
        y = y > 480 ? 480 : y;
        this.x = x;
        this.y = y;
    }

    protected kill(): void {
        this.alive = false;
    }

    public move(): void {
        let newX: number = this.x;
        let newY: number = this.y;
        if (this.left) {
            newX -= this.v;
        }
        if (this.right) {
            newX += this.v;
        }
        if (this.up) {
            newY -= this.v;
        }
        if (this.down) {
            newY += this.v;
        }
        this.setPos([newX, newY]);
    }

    public getPos(): [number, number] {
        return [this.x, this.y];
    }

    public getSize(): [number, number] {
        return [this.w, this.h];
    }
    
    public isAlive(): boolean {
        return this.alive;
    }

    constructor() {
        this.alive = true;
    }
}