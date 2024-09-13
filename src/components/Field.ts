import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js";

export class Field extends Container {
    private _allLevels: string[][];
    private _levelConfig: string[];
    get levelConfig() {
        return this._levelConfig;
    }
    set levelConfig(value: string[]) {
        this._levelConfig = value;
    }

    constructor(levels: Array<{ words: string[] }>, cellTexture: Texture, currentLevel: number = 1) {
        super();
        this._allLevels = levels.map(level => level.words);
        this._levelConfig = this._allLevels[currentLevel - 1];

        const lines = this.levelConfig.map((word, index) => {
            const line = new Container();
            line.position.set(0, index * (cellTexture.height + 20));
            const letters = word.split("").map((letter, letterIndex) => {
                const letterBackground = new Sprite(cellTexture);
                letterBackground.position.set(letterIndex * 100, 0);
                letterBackground.anchor.set(0.5);
                const letterText = letterBackground.addChild(new Text({ text: letter, style: letterTextStyle }));
                letterText.anchor.set(0.5);
                return letterBackground;
            });

            line.addChild(...letters);
            line.pivot.set(line.width / 2, line.height / 2);
            return line;
        });

        this.addChild(...lines);
        this.pivot.set(this.width / 2, this.height / 2);
    }
}

const letterTextStyle = new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fontSize: 64,
    lineHeight: 35,
    align: "center",
});
