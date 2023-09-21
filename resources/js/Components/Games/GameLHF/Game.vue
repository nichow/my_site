<script lang="ts" setup>
import { onMounted } from 'vue';
import { Actor } from './Actors/Actor';
import { GameObject } from './GameObject';
import { Player }  from './Actors/Player';
import { Bullet } from './Damaging/Bullet'
import { Enemy } from './Actors/Enemies/Enemy';
import { Thing } from './Actors/Enemies/Thing';

class Controls {
    left:  string = 'ArrowLeft';
    right: string = 'ArrowRight';
    up:    string = 'ArrowUp';
    down:  string = 'ArrowDown';

    fleft:  string = 'a';
    fright: string = 'd';
    fup:    string = 'w';
    fdown:  string = 's';
}

class LHF {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private static player: Player = new Player();
    private static controls: Controls = new Controls();
    private static enemies: Array<Enemy> = []; 

    private static drawBG(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, 480, 480);
    }

    private static drawObject(ctx: CanvasRenderingContext2D, o:GameObject) {
        let pos: [number, number] = o.getPos();
        let size: [number, number] = o.getSize();
        o.move();
        ctx.fillStyle = o.color;
        ctx.fillRect(pos[0], pos[1], size[0], size[1])
    }

    private static drawPlayer(ctx: CanvasRenderingContext2D) {
        LHF.drawObject(ctx, LHF.player);
    }

    private static drawObjects(ctx: CanvasRenderingContext2D, objects: Array<GameObject>) {
        let _arr: Array<GameObject> = [];
        objects.map((o: GameObject)=>{
            if (o.isAlive()) {
                _arr.push(o);
                LHF.drawObject(ctx, o);
            }
        });
        return _arr;
    }

    private static drawEnemies(ctx: CanvasRenderingContext2D) {
        LHF.enemies = LHF.drawObjects(ctx, LHF.enemies) as Array<Enemy>;
    }

    private static drawBullets(ctx: CanvasRenderingContext2D) {
        LHF.player.bullets = LHF.drawObjects(ctx, LHF.player.bullets) as Array<Bullet>;
    }

    private static handleKey(which: boolean, key: string) {
        let p: Player = LHF.player;
        let c: Controls = LHF.controls;
        switch (key) {
            case c.left: {
                p.left = which;
                break;
            }
            case c.right: {
                p.right = which;
                break;
            }
            case c.up: {
                p.up = which;
                break;
            }
            case c.down: {
                p.down = which;
                break;
            }
            case c.fleft: {
                p.fleft = which;
                break;
            }
            case c.fright: {
                p.fright = which;
                break;
            }
            case c.fup: {
                p.fup = which;
                break;
            }
            case c.fdown: {
                p.fdown = which;
                break;
            }
        }
    }

    private handleKeyDown(e: KeyboardEvent) {
        LHF.handleKey(true, e.key);
    }

    private handleKeyUp(e: KeyboardEvent) {
        LHF.handleKey(false, e.key);
    }

    private createEventHandlers() {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
    }
    
    constructor() {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.createEventHandlers();
        LHF.enemies.push(new Thing(100, 100));
        setInterval(this.update, 10, this.ctx)
    }

    update(ctx: CanvasRenderingContext2D) {
        LHF.drawBG(ctx);
        LHF.drawPlayer(ctx);
        LHF.drawEnemies(ctx);
        if(!LHF.player.recoiling)
            LHF.player.fire();
        LHF.drawBullets(ctx);
    }
}

onMounted(() => {
    new LHF();
});
</script>

<template>
</template>