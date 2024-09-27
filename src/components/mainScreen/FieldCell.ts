import { Container, Sprite, Text } from "pixi.js";
import { GameAssets, whiteColor, GameFontColor } from "../../configuration/types";
import { defaultTextStyle } from "./TextStyles";

export class FieldCell extends Container {
    private root: Container;
    private letterTextComponent: Text;
    private background: Sprite;

    constructor(private readonly letter: string, private readonly assets: GameAssets, scale: number = 1, fontColor: GameFontColor = "#FFFFFF") {
        super();

        this.root = this.addChild(new Container());
        this.background = this.root.addChild(new Sprite({ texture: assets.letterCell, anchor: 0.5 }));
        this.letterTextComponent = this.background.addChild(new Text({ text: letter.toLocaleUpperCase(), style: defaultTextStyle(60, fontColor) }));
        this.letterTextComponent.anchor.set(0.5);
        this.letterTextComponent.visible = fontColor === whiteColor ? false : true;

        this.scale.set(scale);
    }

    openLetter() {
        this.background.texture = this.assets.letterCellGreen;
        this.letterTextComponent.visible = true;
    }
}
