import { Application, ApplicationOptions, Assets } from "pixi.js";
import { manifest } from "../configuration/assetsManifest";
import { Field } from "./mainScreen/Field";
import { GameAssets } from "../configuration/types";
import { InputComponent } from "./mainScreen/input/InputComponent";
import { WinPopup } from "./popups/WinPopup";
import { ReloadPopup } from "./popups/ReloadPopup";
import { GameContext } from "../context/GameContext";
import { GameModel } from "../models/GameModel";
import { BasePopup } from "./popups/BasePopup";
import { Title } from "./mainScreen/Title";

export class Game extends Application {
    static WIDTH = 720;
    static HEIGHT = 1280;

    private readonly gameContext: GameContext;

    private readonly gameModel: GameModel;

    protected assets!: GameAssets;

    private titleComponent?: Title;
    private fieldComponent?: Field;
    private lettersSelectionComponent?: InputComponent;

    private modalWindows: Array<BasePopup> = [];

    public constructor() {
        super();
        this.gameContext = new GameContext();

        this.gameContext.init();

        this.gameModel = this.gameContext.resolve(GameModel);

        window.addEventListener("visibilitychange", this.gameModel.checkIsGameActive.bind(this.gameModel));

        this.gameModel.once("gameModel:showReloadPopup", this.handleShowReloadPopup, this);

        this.gameModel.on("gameModel:showWinPopup", this.handleShowWinPopup, this);

        window.addEventListener("resize", this.handleResize.bind(this));
    }

    async init(options?: Partial<ApplicationOptions>): Promise<void> {
        await super.init(options);
        await this.loadAssets();
        this.handleResize();
    }

    async loadAssets() {
        await Assets.init({ manifest });

        const { assets } = await Assets.loadBundle(["assets", "fonts"]);
        this.assets = assets;

        await this.gameModel.fetchLevels();
    }

    handleResize() {
        const scale = Math.min(window.innerWidth / Game.WIDTH, window.innerHeight / Game.HEIGHT);
        this.stage.scale.set(scale);
    }

    async startGame() {
        if (this.gameModel.isLevelCompleted) {
            return await this.handleShowWinPopup();
        }

        this.titleComponent = this.stage.addChild(new Title(this.gameModel.currentLevel));

        this.fieldComponent = this.stage.addChild(new Field(this.assets, this.gameModel));

        this.lettersSelectionComponent = this.stage.addChild(new InputComponent(this.assets, this.gameModel));
    }

    async showModalPopup(popup: BasePopup) {
        this.modalWindows.push(this.stage.addChild(popup));
        const result = await popup.showModal();
        return result;
    }

    async handleShowReloadPopup() {
        await this.showModalPopup(new ReloadPopup(this.assets));
    }

    async handleShowWinPopup() {
        this.stage.removeChildren();

        await this.showModalPopup(new WinPopup(this.assets, this.gameModel));

        this.startGame();
    }
}
