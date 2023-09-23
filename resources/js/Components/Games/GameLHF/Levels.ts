type LevelData = {
    mook: number;
}

type Level = {
    enemies: Array<LevelData>
}

export const mookLevel: Level = {
    enemies: [
        { mook: 10 }
    ]
};