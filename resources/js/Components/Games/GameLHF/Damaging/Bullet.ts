import { Projectile } from "./Projectile";
import { Player } from "../Actors/Player";
import { Enemy } from "../Actors/Enemies/Enemy";

export class Bullet extends Projectile {
    public readonly color: string = 'orange';
    private targets: Array<Enemy> = [];

    constructor(player:Player, targets: Array<Enemy>) {
        super(player);
        this.targets = targets;
        
        this.setPos(player.getPos())
        this.w = 2;
        this.h = 2;
    }
}