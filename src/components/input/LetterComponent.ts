import { Container, Sprite, Text, TextStyle, isMobile } from "pixi.js";
import { GameAssets } from "../../configuration/types";

export class LetterComponent extends Container {
    private _letter: string;
    get letter() {
        return this._letter;
    }
    private assets: GameAssets;

    private root: Container;
    private background: Sprite;
    private textField: Text;

    private _selected: boolean = false;
    public get selected() {
        return this._selected;
    }
    public set selected(value: boolean) {
        this._selected = value;
        this._selected ? this.setSelected() : this.setDeselected();
    }

    public constructor(assets: GameAssets, letter: string) {
        super({ eventMode: "static" });

        this.assets = assets;
        this._letter = letter;

        this.root = this.addChild(new Container({ eventMode: "static" }));

        this.background = this.root.addChild(new Sprite({ texture: assets.letterPick, anchor: 0.5 }));
        this.background.eventMode = "static";

        this.textField = this.background.addChild(new Text({ text: letter.toLocaleUpperCase(), style: letterTextStyle("#4D4D4D") }));
        this.textField.anchor.set(0.5);

        this.on("pointerover", () => this.emit("onPointerOver", this), this);

        if (isMobile.phone) {
            this.on("pointermove", () => this.emit("onPointerOver", this), this);
        }

        this.on("pointerdown", () => this.emit("onPointerDown", this), this);
    }

    private setSelected() {
        this.background.texture = this.assets.letterPickPink;
        this.textField.style = letterTextStyle("#FFFFFF");
    }

    private setDeselected() {
        this.background.texture = this.assets.letterPick;
        this.textField.style = letterTextStyle("#4D4D4D");

    }
}

const letterTextStyle = (fill: string) => new TextStyle({
    fontFamily: "Vag World Bold",
    fontWeight: "700",
    fill,
    fontSize: 64,
    lineHeight: 35,
    align: "center",
});
