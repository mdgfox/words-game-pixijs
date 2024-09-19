import { Container, Graphics, Sprite, Text } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { Game } from "../Game";
import { adjustableTextStyle, defaultTextStyle } from "../mainScreen/TextStyles";
import { BasePopup } from "./BasePopup";

export class ReloadPopup extends BasePopup {
    private overlay: Graphics;
    private root: Container;
    private background: Sprite;
    private ribbon: Sprite;
    private ribbonText: Text;
    private message: Text;
    private button: Sprite;
    private buttonText: Text;
    constructor(assets: GameAssets) {
        super();

        this.overlay = this.addChild(new Graphics().rect(0, 0, 1, 1)).fill("#000000");
        this.overlay.interactive = true;
        this.overlay.alpha = 0.7;
        this.interactive = true;

        this.root = this.addChild(new Container());

        this.background = this.root.addChild(new Sprite(assets.reloadPopupBackground));
        this.background.anchor.set(0.5);
        this.background.position.set(this.overlay.width / 2, this.overlay.height / 2);

        this.ribbon = this.background.addChild(new Sprite(assets.reloadPopupRibbon));
        this.ribbon.anchor.set(0.5);
        this.ribbon.position.set(0, -175);

        this.ribbonText = this.ribbon.addChild(new Text({ text: "Две вкладки с игрой?", style: adjustableTextStyle(40, 35, 300, "#FFFFFF") }));
        this.ribbonText.anchor.set(0.5, 0.6);

        const messageText = "Похоже, игра открыта в нескольких вкладках браузера. Чтобы продолжить играть в этой вкладке, обновите страницу.";
        this.message = this.background.addChild(new Text({ text: messageText, style: adjustableTextStyle(32, 38, 500, "#4D4D4D") }));
        this.message.anchor.set(0.5, 0.6);

        this.button = this.background.addChild(new Sprite({ texture: assets.buttonGreen, anchor: 0.5 }));
        this.button.eventMode = "static";
        this.button.position.set(0, 150);
        this.buttonText = this.button.addChild(new Text({ text: "Обновить", style: defaultTextStyle(48) }));
        this.buttonText.anchor.set(0.5);
        this.button.on("pointerdown", this.handleButtonClick, this);

        this.zIndex = 10;
        this.handleResize();
    }

    handleButtonClick() {
        window.location.reload();
    }

    handleResize(): void {
        const scale = window.innerHeight / Game.HEIGHT;
        this.overlay.width = window.innerWidth / scale;
        this.overlay.height = window.innerHeight / scale;
        this.background.position.set(this.overlay.width / 2, this.overlay.height / 2);
    }
}
