<script lang="ts" setup>
import { onMounted } from 'vue';
import { Actor } from './Actors/Actor';
import { GameObject } from './GameObject';
import { Player }  from './Actors/Player';
import { Bullet } from './Damaging/Bullet'
import { Enemy } from './Actors/Enemies/Enemy';
import { Mook } from './Actors/Enemies/Mook';
import { Thing } from './Actors/Enemies/Thing';
import { Family } from './Actors/Family/Family';
import { Father } from './Actors/Family/Father';
import { Mother } from './Actors/Family/Mother';
import { Child } from './Actors/Family/Child';
import { Level, mookLevel } from './Levels';

class View {
    public readonly WIDTH: number = 640;
    public readonly HEIGHT: number = 480;
}

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
/**
 * LHF is the game manager, it sets up and draws the canvas/context,
 * and contains the main update loop. Draws the BG, UI, and game objects;
 * sets up event handlers, and handles most game logic
 */
class LHF {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    private static player: Player = new Player();
    private static controls: Controls = new Controls();
    private static view: View = new View();
    private static enemies: Array<Enemy> = [];
    private static family: Array<Family> = [];
    private static saved: number = 0;
    private static score: number = 0;
    private static lives: number = 5;
    private static scene: number = 0;
    private static selected: number = 0;
    private static readonly menuOptions: number = 2;

    /**
     * randPos generates a random x,y coordinate not near 
     * the player's start position of (240, 240)
     * used to generate start positions of NPCs
     * @returns tuple of 2 numbers: x and y coordinates
     */
    private static randPos(): [number, number] {
        let x: number, y: number;
        do {
            x = 35 + Math.floor(Math.random() * 600);
        } while (x >= 280 && x <= 360);
        do {
            y = 35 + Math.floor(Math.random() * 400);
        } while (y >= 200 && y <= 280);
        return [x, y]
    }

    /**
     * update the game's scene to given
     * @param scene scene being changed to
     */
    private static sceneChange(scene: number) {
        LHF.scene = scene;
        LHF.saved = 0;
        let l: Level; 
        switch(scene % 5) {
            case 1: {
                l = mookLevel;
                break;
            }
            default: {
                l = mookLevel;
                break;
            }
        }
        let x: number, y: number;
        for (let i: number = 0; i < l.mook; i++) {
            [x, y] = LHF.randPos();
            LHF.enemies.push(new Mook(x, y));
        }
        for (let i: number = 0; i < l.thing; i++) {
            [x, y] = LHF.randPos();
            LHF.enemies.push(new Thing(x, y));
        }
        for (let i: number = 0; i < l.father; i++) {
            [x, y] = LHF.randPos()
            LHF.family.push(new Father(x, y));
        }
        for (let i: number = 0; i < l.mother; i++) {
            [x, y] = LHF.randPos()
            LHF.family.push(new Mother(x, y));
        }
        for (let i: number = 0; i < l.child; i++) {
            [x, y] = LHF.randPos()
            LHF.family.push(new Child(x, y));
        }
    }
    
    private static drawBG(ctx: CanvasRenderingContext2D) {
        let v: View = LHF.view;
        ctx.fillStyle="black";
        ctx.fillRect(0, 0, v.WIDTH, v.HEIGHT);
        ctx.strokeStyle="red";
        ctx.strokeRect(20, 20, v.WIDTH - 40, v.HEIGHT - 40);
        ctx.strokeStyle="blue";
        ctx.strokeRect(25, 25, v.WIDTH - 50, v.HEIGHT - 50);
        ctx.strokeStyle="yellow";
        ctx.strokeRect(30, 30, v.WIDTH - 60, v.HEIGHT - 60);
    }

    private static drawUI(ctx: CanvasRenderingContext2D) {
        let v: View = LHF.view;
        ctx.fillStyle="white";
        ctx.font = "bold 16px monospace"
        ctx.fillText("LAST HUMAN FAMILY", 15, 15);
        ctx.fillText(`SCORE: ${LHF.score}`, v.WIDTH - 130, 15);

        ctx.fillText(`WAVE: ${LHF.scene}`, 85, v.HEIGHT - 5);
        ctx.fillText('LIVES: ', 295, v.HEIGHT - 5);
        for (let i: number = 0; i < LHF.lives; ++i)
            ctx.fillRect(350 + i * 15, v.HEIGHT - 15, 10, 10);
    }

    private static drawMenu(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "white";
        ctx.font = "bold 48px monospace"
        ctx.fillText('LAST HUMAN FAMILY', 100, 175);

        ctx.font = "bold 24px monospace"
        ctx.fillText('START', 300, 275);
        ctx.fillText('OPTIONS', 300, 300);
        switch(LHF.selected) {
            case 0: {
                ctx.fillRect(275, 265, 5, 5);
                break;
            }
            case 1: {
                ctx.fillRect(275, 290, 5, 5);
                break;
            }
        }
    }

    private static drawObject(ctx: CanvasRenderingContext2D, o:GameObject) {
        let pos: [number, number] = o.getPos();
        let size: [number, number] = o.getSize();
        if (!LHF.player.halt) {
            if (o instanceof Thing)
                o.hunt(LHF.player.getPos());
            if (!(o instanceof Family))
                o.move();
        }
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

    private static drawFamily(ctx: CanvasRenderingContext2D) {
        LHF.family = LHF.drawObjects(ctx, LHF.family) as Array<Family>;
    }

    private static handleCollision(e: Event) {
        let source = (e as CustomEvent).detail.source;
        let target = (e as CustomEvent).detail.target;

        if (source instanceof Bullet) {
            (target as Enemy).damage();
        }
    }

    /**
     * handler for death event
     * not strictly "deaths" as saving family members triggers same event
     * add score for enemies/family, remove life and respawn if player
     * @param e event being handled, e.detail is the Actor dying
     */
    private static handleDeath(e: Event) {
        let dead: Actor = (e as CustomEvent).detail;

        if (dead instanceof Enemy) {
            LHF.score += (dead as Enemy).getScore();
        } else if (dead instanceof Family) {
            // for family members, score = 1000 * number saved this level
            LHF.score += ++LHF.saved * (dead as Family).getScore();
        } else if (dead instanceof Player) {
            if (--LHF.lives > 0) { 
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
            LHF.drawFamily(ctx);
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
            LHF.family.map((member) => {
                member.collide(LHF.player);
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