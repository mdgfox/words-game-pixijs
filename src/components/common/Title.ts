import { Container, Text, TextStyle } from 'pixi.js';

export class Title extends Container {
    private titleText: Text;
    constructor(currentLevel: number) {
        super();
        const text = `Уровень ${currentLevel}`;
        this.titleText = this.addChild(new Text({ text, style: titleTextStyle }));
        this.titleText.anchor.set(0.5, 0);
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
