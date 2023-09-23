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
        x = x < 30 ? 30 : x;
        x = x > 610 - this.w ? 610 - this.w : x;
        y = y < 30 ? 30 : y;
        y = y > 450 - this.h ? 450 - this.h : y;
        this.x = x;
        this.y = y;
    }

    protected kill(): void {
        this.alive = false;
    }

    protected coll(tgt: GameObject): boolean {
        let tgtPos: [number, number] = tgt.getPos();
        let tgtSize: [number, number] = tgt.getSize();
        let myBox = [this.x, this.x + this.w, this.y, this.y + this.h]
        let tgtBox = [tgtPos[0], tgtPos[0] + tgtSize[0], tgtPos[1], tgtPos[1] + tgtSize[1]];
        let collX: boolean = (myBox[0] <= tgtBox[1] && myBox[1] >= tgtBox[0]) || (myBox[0] >= tgtBox[1] && myBox[1] <= tgtBox[0])
        if (!collX)
            return false;
        let collY: boolean = (myBox[2] <= tgtBox[3] && myBox[3] >= tgtBox[2]) || (myBox[2] >= tgtBox[3] && myBox[3] <= tgtBox[2])
        return collY;
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