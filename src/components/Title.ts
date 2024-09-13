import { Container, Text, TextStyle } from 'pixi.js';

export class Title extends Container {
    private _currentLevel: number;
    get currentLevel() {
        return this._currentLevel;
    }
    set currentLevel(value: number) {
        localStorage.setItem("currentLevel", value.toString());
        this._currentLevel = value;
    }
    private titleText: Text;
    constructor() {
        super();

        this._currentLevel = Number.parseInt(localStorage.getItem("currentLevel") ?? "1");
        const text = `Уровень ${this.currentLevel}`;
        this.titleText = this.addChild(new Text({ text, style: titleTextStyle }));
        this.titleText.anchor.set(0.5);

    }

    convertCurrentLevelToReal(level: number) {
        const realLevel = level % 3;
        return realLevel === 0 ? 1 : realLevel;
    }
}

const titleTextStyle = new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fill: "#FFFFFF",
    fontSize: 64,
    lineHeight: 35,
    align: "center",
});
