import { Container, DestroyOptions, NineSliceSprite, Text } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { defaultTextStyle } from "../mainScreen/TextStyles";

export class Button extends Container {
    private readonly mainColorTint = "#FFFFFF";
    private readonly hoverColorTint = "#64c867";
    private readonly downColorTint = "#548b54";

    private root: Container;
    private backSprite: NineSliceSprite;
    private textComponent?: Text;

    protected isDown: boolean = false;
    protected isDisabled: boolean = false;
    protected isHovered: boolean = false;

    constructor(private readonly assets: GameAssets, private readonly text?: string, initPosition?: { x: number; y: number }) {
        super();
        this.root = this.addChild(new Container());
        if (initPosition) {
            this.root.position.set(initPosition.x, initPosition.y);
        }

        this.backSprite = this.root.addChild(new NineSliceSprite({
            texture: this.assets.buttonGreen,
            leftWidth: 0, rightWidth: 0, topHeight: 0, bottomHeight: 0
        }));
        this.backSprite.pivot.set(this.backSprite.width / 2, this.backSprite.height / 2);


        if (this.text) {
            this.textComponent = this.root.addChild(new Text({ text, style: defaultTextStyle(48) }));
            this.textComponent.anchor.set(0.5);
        }

        this.interactive = true;
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.on("pointerdown", this.onPointerdown, this);
        this.on("pointerup", this.onPointerup, this);
        this.on("pointerupoutside", this.onPointerup, this);
        this.on("pointercancel", this.onPointerup, this);
        this.on("pointerover", this.onPointerover, this);
        this.on("pointerout", this.onPointerout, this);
    }

    updateBack() {
        if (this.isDown) {
            this.backSprite.tint = this.downColorTint;
            return;
        }
        if (this.isHovered) {
            this.backSprite.tint = this.hoverColorTint;
            return;
        }

        this.backSprite.tint = this.mainColorTint;
    }

    onPointerdown() {
        if (this.isDisabled) { return; }

        this.isDown = true;
        this.updateBack();
    }

    onPointerup() {
        this.isDown = false;
        this.updateBack();
    }

    onPointerover() {
        this.isHovered = true;
        this.updateBack();
    }

    onPointerout() {
        this.isHovered = false;
        this.updateBack();
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.off("pointerdown", this.onPointerdown, this);
        this.off("pointerup", this.onPointerup, this);
        this.off("pointerupoutside", this.onPointerup, this);
        this.off("pointercancel", this.onPointerup, this);
        this.off("pointerover", this.onPointerover, this);
        this.off("pointerout", this.onPointerout, this);
    }
}