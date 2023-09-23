<script lang="ts" setup>
import { onMounted } from 'vue';
import { Actor } from './Actors/Actor';
import { GameObject } from './GameObject';
import { Player }  from './Actors/Player';
import { Bullet } from './Damaging/Bullet'
import { Enemy } from './Actors/Enemies/Enemy';
import { Thing } from './Actors/Enemies/Thing';
import { thingLevel } from './Levels';

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
    private static score: number = 0;
    private static lives: number = 5;
    private static scene: number = 0;
    private static selected: number = 0;
    private static readonly menuOptions: number = 2;

    private static sceneChange(scene: number) {
        LHF.scene = scene;
        switch(scene % 5) {
            case 1: {
                thingLevel.enemies.map((item) => {
                    for (let i: number = 0; i < item.thing; i++) {
                        let x: number = 35 + Math.floor(Math.random() * 400);
                        let y: number = 35 + Math.floor(Math.random() * 390);
                        LHF.enemies.push(new Thing(x, y));
                    }
                });
            }
        }
    }
    
    private static drawBG(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, 480, 480);
        ctx.strokeStyle="red";
        ctx.strokeRect(20, 20, 440, 440);
        ctx.strokeStyle="blue";
        ctx.strokeRect(25, 25, 430, 430);
        ctx.strokeStyle="yellow";
        ctx.strokeRect(30, 30, 420, 420);
    }

    private static drawUI(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle="white";
        ctx.font = "bold 16px monospace"
        ctx.fillText("LAST HUMAN FAMILY", 15, 15);
        ctx.fillText(`SCORE: ${LHF.score}`, 350, 15);

        ctx.fillText('LIVES: ', 175, 475);
        for (let i: number = 0; i < LHF.lives; ++i)
            ctx.fillRect(230 + i * 15, 465, 10, 10);
    }

    private static drawMenu(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.font = "bold 48px monospace"
        ctx.fillText('LAST', 60, 125);
        ctx.fillText('HUMAN FAMILY', 120, 175);

        ctx.font = "bold 24px monospace"
        ctx.fillText('START', 225, 275);
        ctx.fillText('OPTIONS', 225, 300);
        switch(LHF.selected) {
            case 0: {
                ctx.fillRect(200, 265, 5, 5);
                break;
            }
            case 1: {
                ctx.fillRect(200, 290, 5, 5);
                break;
            }
        }
    }

    private static drawObject(ctx: CanvasRenderingContext2D, o:GameObject) {
        let pos: [number, number] = o.getPos();
        let size: [number, number] = o.getSize();
        if (!LHF.player.halt)
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

    private static handleCollision(e: Event) {
        let source = (e as CustomEvent).detail.source;
        let target = (e as CustomEvent).detail.target;

        if (source instanceof Bullet) {
            (target as Enemy).damage();
        }
    }

    private static handleDeath(e: Event) {
        let dead: Actor = (e as CustomEvent).detail;

        if (dead instanceof Enemy) {
            LHF.score += (dead as Enemy).getScore();
        } else if (dead instanceof Player) {
            if (LHF.lives-- > 0) { 
                LHF.player.revive();
            }
        }
    }

    private static handleKey(which: boolean, key: string) {
        let p: Player = LHF.player;
        let c: Controls = LHF.controls;
        if (LHF.scene == 0) {
            switch (key) {
                case c.up: {
                    if (which)
                        LHF.selected = LHF.selected == 0 ? 0 : LHF.selected - 1;
                    break;
                }
                case c.down: {
                    if (which)
                        LHF.selected = LHF.selected < LHF.menuOptions ? 1 : LHF.selected + 1;
                    break;
                }
                case 'Enter': {
                    if (which) {
                        if (LHF.selected == 0) {
                            LHF.sceneChange(1);
                        }
                    }
                }
            }
        } else {
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
        window.addEventListener('collision', LHF.handleCollision)
        window.addEventListener('death', LHF.handleDeath)
    }
    
    update(ctx: CanvasRenderingContext2D) {
        LHF.drawBG(ctx);
        if (LHF.scene == 0)
            LHF.drawMenu(ctx);
        else {
            LHF.drawUI(ctx);
            LHF.drawEnemies(ctx);
            LHF.drawPlayer(ctx);
            if(!LHF.player.isRecoiling())
                LHF.player.fire();
            LHF.drawBullets(ctx);
            LHF.player.bullets.map((bullet) => {
                bullet.collide(LHF.enemies);
            });
            LHF.enemies.map((enemy) => {
                enemy.collide(LHF.player);
            })
        }
    }

    constructor() {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.createEventHandlers();
        setInterval(this.update, 10, this.ctx)
    }

}

onMounted(() => {
    new LHF();
});
</script>

<template>
</template>