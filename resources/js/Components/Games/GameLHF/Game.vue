<script lang="ts" setup>
import { onMounted } from 'vue';
import { Actor } from './Actors/Actor';
import { Player }  from './Actors/Player';
import { Enemy } from './Actors/Enemies/Enemy';
import { Thing } from './Actors/Enemies/Thing';

class Controls {
    left:  string = 'ArrowLeft';
    right: string = 'ArrowRight';
    up:    string = 'ArrowUp';
    down:  string = 'ArrowDown';
}

class LHF {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private static Player: Player = new Player();
    private static Controls: Controls = new Controls();

    private static Enemies: Array<Enemy> = []; 

    private static drawBG(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, 480, 480);
    }

    private static drawActor(ctx: CanvasRenderingContext2D, a:Actor) {
        let pos: [number, number] = a.getPos();
        let size: [number, number] = a.getSize();
        a.move();
        ctx.fillStyle = a.color;
        ctx.fillRect(pos[0], pos[1], size[0], size[1])
    }

    private static drawPlayer(ctx: CanvasRenderingContext2D) {
        LHF.drawActor(ctx, LHF.Player);
    }

    private static drawEnemies(ctx: CanvasRenderingContext2D) {
        let Arr: Array<Enemy> = LHF.Enemies;
        Arr.map((e: Enemy) => {
            LHF.drawActor(ctx, e);
        })
    }

    private static handleKey(which: boolean, key: string) {
        let p: Player = LHF.Player;
        switch (key) {
            case LHF.Controls.left: {
                p.left = which ? true : false;
                break;
            }
            case LHF.Controls.right: {
                p.right = which ? true : false;
                break;
            }
            case LHF.Controls.up: {
                p.up = which ? true : false;
                break;
            }
            case LHF.Controls.down: {
                p.down = which ? true : false;
                break;
            }
        }
    }

    private handleKeyDown(e : KeyboardEvent) {
        LHF.handleKey(true, e.key);
    }

    private handleKeyUp(e : KeyboardEvent) {
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
        LHF.Enemies.push(new Thing(100, 100));
        setInterval(this.update, 10, this.ctx)
    }

    update(ctx: CanvasRenderingContext2D) {
        LHF.drawBG(ctx);
        LHF.drawPlayer(ctx);
        LHF.drawEnemies(ctx);
    }
}

onMounted(() => {
    new LHF();
});
</script>

<template>
</template>./Actors/Player