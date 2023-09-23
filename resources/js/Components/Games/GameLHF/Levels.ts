type LevelData = {
    thing: number;
}

type Level = {
    enemies: Array<LevelData>
}

export const thingLevel: Level = {
    enemies: [
        { thing: 10 }
    ]
};