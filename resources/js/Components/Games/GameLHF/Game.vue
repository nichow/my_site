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
import { type Level, mookLevel } from './Levels';

type rect = {
    x: number,
    y: number,
    w: number,
    h: number
}

const WIDTH: number = 640;
const HEIGHT: number = 480;
const BG: rect = {x: 0, y: 0, w:WIDTH, h:HEIGHT};
const PLAYABLE: rect = {x:30, y:30, w:BG.w - 60, h:BG.h - 60};
const SZ: rect = {x: 30, y: 30, w: PLAYABLE.w/4, h: PLAYABLE.h/3};

class Controls {
    left:  string = 'a';
    right: string = 'd';
    up:    string = 'w';
    down:  string = 's';

    fleft:  string = 'ArrowLeft';
    fright: string = 'ArrowRight';
    fup:    string = 'ArrowUp';
    fdown:  string = 'ArrowDown';
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
    private static score: number = 0;
    private static hiScore: number = 0;
    private static lives: number = 5;
    private static controls: Controls = new Controls();
    
    private static family: Array<Family> = [];
    private static readonly FAM_SZ: Array<rect> = [
            {x: BG.w / 2 - 50, y: PLAYABLE.y, w: 100, h: 100},
            {x: BG.w / 2 - 50, y: PLAYABLE.h - 100, w: 100, h: 100},
            {x: PLAYABLE.x, y: BG.h / 2 - 50, w: 150, h: 100},
            {x: PLAYABLE.w - 150, y: BG.h / 2 - 50, w: 150, h: 100}
    ];
    private static saved: number = 0;
    
    private static enemies: Array<Enemy> = [];
    private static things: Array<Thing> = [];
    private static readonly EN_SZ: Array<rect> = [
        SZ,
        {x: PLAYABLE.w - SZ.w, y: SZ.y, w: SZ.w, h: SZ.h},
        {x: SZ.x, y: PLAYABLE.h - SZ.h, w: SZ.w, h: SZ.h},
        {x: PLAYABLE.w - SZ.x, y: PLAYABLE.h - SZ.h, w: SZ.w, h: SZ.h}
    ];       
            
    private static scene: number = 0;
    private static selected: number = 0;
    private static readonly MENU: number = 2;

    /**
     * randPos generates an x,y coordinate not near the player's start position
     * used to generate start positions of NPCs
     * @returns tuple of 2 numbers: x and y coordinates
     */
    private static randPos(zone: rect): [number, number] {
        let x: number, y: number;
        x = zone.x + Math.floor(Math.random() * zone.w);
        y = zone.y + Math.floor(Math.random() * zone.h);
        return [x, y];
    }
    
    /**
     * Generate a position for a family spawn
     * Family members spawn towards the axes around the center
     * Puts one in each zone, clockwise from top 
     * @returns The bounds of the spawn zone
     */
    private static spawnFam(): rect {
        let mySZ: rect; 
        switch (LHF.family.length % 4) {
            case 0: {
                mySZ = LHF.FAM_SZ[0];
                break;
            }
            case 1: {
                mySZ = LHF.FAM_SZ[1];
                break;
            }
            case 2: {
                mySZ = LHF.FAM_SZ[2];
                break;
            }
            case 3: {
                mySZ = LHF.FAM_SZ[3];
                break;
            }
            default: {
                mySZ = PLAYABLE;
                break;
            }
        }
        return mySZ;
    }
    
    /**
     * Iterate to next level
     */
    private static sceneChange(): void {
        // Reset player pos, things, and saved counter
        LHF.player.reset();
        LHF.things = [];
        LHF.saved = 0;
        // Increment scene
        let scene = ++LHF.scene;
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
        // Add level's family members
        for (let i: number = 0; i < l.father; i++) {
            [x, y] = LHF.randPos(LHF.spawnFam());
            LHF.family.push(new Father(x, y));
        }
        for (let i: number = 0; i < l.mother; i++) {
            [x, y] = LHF.randPos(LHF.spawnFam());
            LHF.family.push(new Mother(x, y));
        }
        for (let i: number = 0; i < l.child; i++) {
            [x, y] = LHF.randPos(LHF.spawnFam());
            LHF.family.push(new Child(x, y));
        }
        // Add level enemies, distributed through zones
        const numZones: number = this.EN_SZ.length;
        let rem: number = l.mook % numZones;
        let perZone: number = Math.floor(l.mook / numZones);
        let mySZ: rect;
        for (let i: number = 0; i < numZones; i++) {
            mySZ = this.EN_SZ[i]; 
            for (let j: number = 0; j < perZone; j++) {
                [x, y] = LHF.randPos(mySZ);
                LHF.enemies.push(new Mook(x, y));
            }
            if (rem-- > 0) {
                [x, y] = LHF.randPos(mySZ);
                LHF.enemies.push(new Mook(x, y));
            }
        }
        rem = l.thing % numZones;
        perZone = Math.floor(l.thing / numZones); 
        for (let i: number = 0; i < numZones; i++) {
            mySZ = this.EN_SZ[i]; 
            for (let j: number = 0; j < perZone; j++) {
                [x, y] = LHF.randPos(mySZ);
                LHF.things.push(new Thing(x, y, LHF.player, LHF.family));
            }
            if (rem-- > 0) {
                [x, y] = LHF.randPos(mySZ);
                LHF.things.push(new Thing(x, y, LHF.player, LHF.family));
            }
        }
    }
    
    private static drawBG(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle="black";
        ctx.fillRect(BG.x, BG.y, BG.w, BG.h);
        ctx.strokeStyle="red";
        let [x, y] = [20, 20];
        ctx.strokeRect(x, y, BG.w - x * 2, BG.h - x * 2);
        ctx.strokeStyle="blue";
        [x, y] = [25, 25];
        ctx.strokeRect(x, y, BG.w - x * 2, BG.h - x * 2);
        ctx.strokeStyle="yellow";
        let p: rect = PLAYABLE;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
    }

    private static drawUI(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle="white";
        ctx.font = "bold 16px monospace";
        ctx.fillText("LAST HUMAN FAMILY", 15, 15);
        ctx.fillText(`SCORE: ${LHF.score}`, BG.w - 130, 15);

        ctx.fillText(`WAVE: ${LHF.scene}`, 85, BG.h - 5);
        ctx.fillText('LIVES: ', 295, BG.h - 5);
        for (let i: number = 0; i < LHF.lives; ++i)
            ctx.fillRect(350 + i * 15, BG.h - 15, 10, 10);
    }

    private static drawMenu(ctx: CanvasRenderingContext2D): void {
        ctx.fillStyle = "white";
        ctx.font = "bold 16px monospace";
        ctx.fillText(`HI-SCORE: ${LHF.hiScore}`, BG.w - 350, 15);
        ctx.font = "bold 48px monospace";
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

    private static drawObject(ctx: CanvasRenderingContext2D, o: GameObject): void {
        let [x, y]: [number, number] = o.getPos();
        let [w, h]: [number, number] = o.getSize();
        ctx.fillStyle = o.color;
        ctx.fillRect(x, y, w, h);

        if(!LHF.player.halt && !(o instanceof Family)) {
            o.move();
        }
    }

    private static drawFamMember(ctx: CanvasRenderingContext2D, fam: Family): void {
        fam.collide(LHF.player);
        LHF.things.map((thing) => {
            fam.collide(thing);
        });
        LHF.drawObject(ctx, fam);
    }

    private static drawBullet(ctx: CanvasRenderingContext2D, b: Bullet): void {
        LHF.drawObject(ctx, b);
        b.collide(LHF.enemies);
        b.collide(LHF.things);
    }

    private static drawEnemy(ctx: CanvasRenderingContext2D, en: Enemy): void {
        LHF.drawObject(ctx, en);
        en.collide(LHF.player);
    }

    private static drawPlayer(ctx: CanvasRenderingContext2D): void {
        LHF.drawObject(ctx, LHF.player);
        if(!LHF.player.isRecoiling())
            LHF.player.fire();
    }

    private static drawThing(ctx: CanvasRenderingContext2D, thing: Thing): void {
        if (!LHF.player.halt) {
            if (thing.hunting) {
                thing.hunt();
            } else {
                let _arr: Array<Actor> = LHF.family;
                _arr.push(LHF.player);
                thing.changeTarget(_arr);
            }
        }
            LHF.drawEnemy(ctx, thing);
    }

    /**
     * Given an array of GOs, draw all that are alive and remove dead from list
     * @param ctx HTML Canvas context
     * @param objects Array of GameObjects being drawn
     * @returns a new Array of GOs with the 'dead' removed
     */
    private static drawObjects(ctx: CanvasRenderingContext2D, objects: Array<GameObject>): Array<GameObject> {
        let _arr: Array<GameObject> = [];
        objects.map((o: GameObject) => {
            if (o.isAlive()) {
                _arr.push(o);
                if (o instanceof Bullet)
                    LHF.drawBullet(ctx, o);
                else if (o instanceof Thing)
                    LHF.drawThing(ctx, o);
                else if (o instanceof Enemy)
                    LHF.drawEnemy(ctx, o);
                else if (o instanceof Family)
                    LHF.drawFamMember(ctx, o);
            }
        });
        return _arr;
    }

    /**
     * Draw UI and all game objects
     * @param ctx HTML canvas context
     */
    private static drawGame(ctx: CanvasRenderingContext2D) {
        LHF.drawUI(ctx);
        LHF.enemies = LHF.drawObjects(ctx, LHF.enemies) as Array<Enemy>;
        LHF.things = LHF.drawObjects(ctx, LHF.things) as Array<Thing>;
        LHF.family = LHF.drawObjects(ctx, LHF.family) as Array<Family>;
        LHF.player.bullets = LHF.drawObjects(ctx, LHF.player.bullets) as Array<Bullet>;
        LHF.drawPlayer(ctx);
    }

    /**
     * Event handler for collisions, fired by collide methods on certain objs
     * @param e CustomEvent with detail = { source: GameObject, target: Actor }
     */
    private static handleCollision(e: Event): void {
        let source = (e as CustomEvent).detail.source;
        let target = (e as CustomEvent).detail.target;
        
        if (source instanceof Bullet && target instanceof Enemy) {
            (target as Enemy).damage();
        } else if (source instanceof Player && target instanceof Family) {
            // increment saved, then add saved * member_score
            LHF.score += ++LHF.saved * (target as Family).getScore();
        }
    }

    /**
     * Event handler for gameplay deaths, fired by Actor.kill()
     * @param e CustomEvent with detail = dead: Actor
     */
    private static handleDeath(e: Event): void {
        let dead: Actor = (e as CustomEvent).detail;
        if (dead instanceof Enemy) {
            LHF.score += (dead as Enemy).getScore();
        } else if (dead instanceof Family) {
            // Things turn family members into Mooks
            let [x, y]: [number, number] = dead.getPos();
            LHF.enemies.push(new Mook(x, y));
        } else if (dead instanceof Player) {
            // -1 life, revive player if more lives remain
            if (--LHF.lives > 0) { 
                LHF.player.revive();
            // Otherwise reset game
            } else {
                LHF.hiScore = LHF.score;
                LHF.score = 0;
                LHF.scene = 0;
            }
        } 
    }

    /**
     * Key handler; handles both down and up events
     * @param which boolean, true if keydown false if keyup
     * @param key key being pressed, passed from KeyboardEvent key property
     */
    private static handleKey(which: boolean, key: string): void {
        let c: Controls = LHF.controls;
        let p: Player = LHF.player;
        // Scene 0 is the menu, only needs keydown commands
        if (LHF.scene == 0 && which) {
            switch (key) {
                // selected is a number which tells the game which option is selected
                case c.up || c.fup: {
                    // Keep lower bound and decrement
                    LHF.selected = LHF.selected == 0 ? 0 : LHF.selected - 1;
                    break;
                }
                case c.down || c.fdown: {
                    // Keep upper bound and increment
                    // Right now I just hard code MENU to be the upper bound
                    LHF.selected = LHF.selected < LHF.MENU ? LHF.MENU - 1 : LHF.selected + 1;
                    break;
                }
                case 'Enter': {
                    // selected == 0 is start game
                    if (LHF.selected == 0) {
                        // load level 1
                        LHF.sceneChange();
                    }
                    break;
                }
            }
        // General game controls for every other scene
        } else {
            /**
             * Controls modify boolean properties on the Player object
             * keydown events set the corresponding property to true
             * keyup events do the opposite.
             */
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

    private handleKeyDown(e: KeyboardEvent): void {
        LHF.handleKey(true, e.key);
    }

    private handleKeyUp(e: KeyboardEvent): void {
        LHF.handleKey(false, e.key);
    }

    private createEventHandlers(): void {
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.handleKeyUp);
        window.addEventListener('collision', LHF.handleCollision)
        window.addEventListener('death', LHF.handleDeath)
    }
    
    // update is called once per tick
    update(ctx: CanvasRenderingContext2D): void {
        LHF.drawBG(ctx);
        if (LHF.scene == 0)
            LHF.drawMenu(ctx);
        else {
            LHF.drawGame(ctx);
            if (LHF.enemies.length === 0)
                LHF.sceneChange();
        }
    }

    constructor() {
        let canvas = document.getElementById('canvas') as HTMLCanvasElement;
        let ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        
        this.canvas = canvas;
        this.ctx = ctx;
        this.createEventHandlers();
        setInterval(this.update, 15, this.ctx)
    }

}

onMounted(() => {
    new LHF();
});
</script>

<template></template>