import { Actor } from "../Actor";
import { Player } from "../Player";

export class Family extends Actor {
    protected score: number = 1000;

    public collide(p: Player) {
        if (this.coll(p)) {
            this.kill();
        }
    }

    public getScore() {
        return this.score;
    }
}