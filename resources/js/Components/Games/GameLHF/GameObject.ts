export class GameObject {
    protected x: number = 0;
    protected y: number = 0;
    protected w: number = 0;
    protected h: number = 0;
    protected v: number = 0;

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

    public getPos(): [number, number] {
        return [this.x, this.y];
    }

    public getSize(): [number, number] {
        return [this.w, this.h];
    }
}