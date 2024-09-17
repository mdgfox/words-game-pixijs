import { Container, Graphics, Sprite, Text, TextStyle } from "pixi.js";
import { grayColor, GameAssets, whiteColor } from "../../configuration/types";
import { Game } from "../Game";
import { defaultTextStyle } from "../common/TextStyles";

export class ReloadPopup extends Container {
    private overlay: Graphics;
    private root: Container;
    private background: Sprite;
    private ribbon: Sprite;
    private ribbonText: Text;
    private message: Text;
    private button: Sprite;
    private buttonText: Text;
    constructor(assets: GameAssets) {
        super({ eventMode: "static" });

        const scale = window.innerHeight / Game.HEIGHT;
        this.overlay = this.addChild(new Graphics().rect(-0.5, -0.5, window.innerWidth / scale, window.innerHeight / scale)).fill("#000000");
        this.overlay.position.set(-this.overlay.width / 2, 0);
        this.overlay.alpha = 0.7;
        this.interactive = true;

        this.root = this.addChild(new Container());

        this.background = this.root.addChild(new Sprite(assets.reloadPopupBackground));
        this.background.anchor.set(0.5);
        this.background.position.set(0, 620);

        this.ribbon = this.background.addChild(new Sprite(assets.reloadPopupRibbon));
        this.ribbon.anchor.set(0.5);
        this.ribbon.position.set(0, -175);

        this.ribbonText = this.ribbon.addChild(new Text({ text: "Две вкладки с игрой?", style: ribbonTextStyle }));
        this.ribbonText.anchor.set(0.5);

        const messageText = "Похоже, игра открыта в нескольких вкладках браузера. Чтобы продолжить играть в этой вкладке, обновите страницу.";
        this.message = this.background.addChild(new Text({ text: messageText, style: messageTextStyle }));
        this.message.anchor.set(0.5);

        this.button = this.background.addChild(new Sprite({ texture: assets.buttonGreen, anchor: 0.5 }));
        this.button.eventMode = "static";
        this.button.position.set(0, 150);
        this.buttonText = this.button.addChild(new Text({ text: "Обновить", style: defaultTextStyle(48) }));
        this.buttonText.anchor.set(0.5);
        this.button.on("pointerdown", this.handleButtonClick, this);

        this.zIndex = 10;
    }

    handleButtonClick() {
        window.location.reload();
    }

}

const ribbonTextStyle = new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fill: whiteColor,
    fontSize: 40,
    lineHeight: 35,
    align: "center",
    wordWrap: true,
    wordWrapWidth: 300,
});

const messageTextStyle = new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fill: grayColor,
    fontSize: 32,
    lineHeight: 38,
    align: "center",
    wordWrap: true,
    wordWrapWidth: 500
});
