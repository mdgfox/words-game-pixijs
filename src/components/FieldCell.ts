import { Container, Sprite, Text, TextStyle } from "pixi.js";
import { GameAssets } from "../configuration/types";

export class FieldCell extends Container {
    private letter: string;
    private assets: GameAssets;
    private letterTextComponent: Text;
    private background: Sprite;

    constructor(letter: string, assets: GameAssets, scale: number = 1, fontType: "white" | "black" = "white") {
        super();
        this.letter = letter;
        this.assets = assets;

        this.background = this.addChild(new Sprite(assets.letterCell));
        this.background.anchor.set(0.5);
        this.letterTextComponent = new Text({ text: letter, style: letterTextStyle(fontType === "white" ? "#FFFFFF" : "#4D4D4D") });
        this.letterTextComponent.anchor.set(0.5);
        this.letterTextComponent.visible = fontType === "white" ? false : true;

        this.background.addChild(this.letterTextComponent);

        this.scale.set(scale);
    }

    openLetter() {
        this.background.texture = this.assets.letterCellGreen;
        this.letterTextComponent.visible = true;
    }
}

const letterTextStyle = (fill: string) => new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fill,
    fontSize: 64,
    lineHeight: 35,
    align: "center",
});
