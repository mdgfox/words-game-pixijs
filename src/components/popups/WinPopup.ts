import { Container, DestroyOptions, Sprite, Text } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { defaultTextStyle } from "../common/TextStyles";

export class WinPopup extends Container {
    private root: Container;
    private message: Text;
    private motivatedMessage: Text;
    private button: Sprite; // todo check migration of UI segment as types problems
    private buttonText: Text;
    constructor(assets: GameAssets, levelNum: number) {
        super({ eventMode: "static" });

        this.root = this.addChild(new Container({ eventMode: "static" }));

        this.message = this.root.addChild(new Text({ text: `Уровень ${levelNum} пройден`, style: defaultTextStyle(36) }));
        this.message.anchor.set(0.5);
        this.message.position.set(0, 260);
        this.motivatedMessage = this.root.addChild(new Text({ text: "Изумительно!", style: defaultTextStyle(52) }));
        this.motivatedMessage.anchor.set(0.5);
        this.motivatedMessage.position.set(0, 360);
        this.button = this.root.addChild(new Sprite({ texture: assets.buttonGreen, anchor: 0.5 }));
        this.button.eventMode = "static";
        this.button.position.set(0, 780);
        this.buttonText = this.button.addChild(new Text({ text: `Уровень ${++levelNum}`, style: defaultTextStyle(48) }));
        this.buttonText.anchor.set(0.5);
        this.button.on("pointerdown", this.handleButtonClick, this);
    }

    handleButtonClick() {
        this.emit("winPopup:close");
        this.destroy();
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.button.off("pointerdown", this.handleButtonClick, this);
    }
}
