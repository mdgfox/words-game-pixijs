import { Container, Sprite, Text } from "pixi.js";
import { GameAssets, whiteColor, GameFontColor } from "../../configuration/types";
import { defaultTextStyle } from "./TextStyles";

export class FieldCell extends Container {
    private letter: string;
    private assets: GameAssets;
    private letterTextComponent: Text;
    private background: Sprite;

    constructor(letter: string, assets: GameAssets, scale: number = 1, fontColor: GameFontColor = "#FFFFFF") {
        super();
        this.letter = letter;
        this.assets = assets;

        this.background = this.addChild(new Sprite(assets.letterCell));
        this.background.anchor.set(0.5);
        this.letterTextComponent = new Text({ text: letter.toLocaleUpperCase(), style: defaultTextStyle(64, fontColor) });
        this.letterTextComponent.anchor.set(0.5);
        this.letterTextComponent.visible = fontColor === whiteColor ? false : true;

        this.background.addChild(this.letterTextComponent);

        this.scale.set(scale);
    }

    openLetter() {
        this.background.texture = this.assets.letterCellGreen;
        this.letterTextComponent.visible = true;
    }
}
