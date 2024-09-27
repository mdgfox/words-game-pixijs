import { Container, DestroyOptions, Sprite, Text } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { defaultTextStyle } from "../mainScreen/TextStyles";
import { GameModel } from "../../models/GameModel";
import { BasePopup } from "./BasePopup";
import { Button } from "../infra/Button";

export class WinPopup extends BasePopup {
    private root: Container;
    private message: Text;
    private motivatedMessage: Text;
    private button: Button;

    constructor(private readonly assets: GameAssets, private readonly gameModel: GameModel) {
        super();

        this.root = this.addChild(new Container({ eventMode: "static" }));

        this.message = this.root.addChild(new Text({ text: `Уровень ${gameModel.currentLevel} пройден`, style: defaultTextStyle(60) }));
        this.message.anchor.set(0.5);
        this.message.position.set(0, 260);
        this.motivatedMessage = this.root.addChild(new Text({ text: "Изумительно!", style: defaultTextStyle(72) }));
        this.motivatedMessage.anchor.set(0.5);
        this.motivatedMessage.position.set(0, 360);

        this.button = this.root.addChild(new Button(this.assets, `Уровень ${gameModel.currentLevel + 1}`, { x: 0, y: 780 }));
        this.button.on("pointerup", this.handleButtonClick, this);

        this.handleResize();
    }

    handleButtonClick() {
        this.gameModel.currentLevel++;
        this.gameModel.currentLevelProgress = [];
        this.emit("modal:close");
        this.destroy();
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.button.off("pointerdown", this.handleButtonClick, this);
    }
}
