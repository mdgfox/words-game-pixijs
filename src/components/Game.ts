import { Application, ApplicationOptions, Assets, BrowserAdapter, uid } from "pixi.js";
import { manifest } from "../configuration/assetsManifest";
import { Title } from "./common/Title";
import { Field } from "./field/Field";
import axios from "axios";
import { GameAssets } from "../configuration/types";
import { LettersController } from "./input/LettersController";
import { WinPopup } from "./popups/WinPopup";
import { v4 as uuidv4 } from 'uuid';
import { ReloadPopup } from "./popups/ReloadPopup";

export class Game extends Application {
    public static WIDTH = 640;
    public static HEIGHT = 1280;

    private uuid: string;
    protected assets!: GameAssets;
    private levels: Record<string, string[]> = {};

    private titleComponent?: Title;
    private field?: Field;
    private inputController?: LettersController;
    private winPopup?: WinPopup;
    private reloadPopup?: ReloadPopup;

    private _currentLevel: number;
    set currentLevel(value: number) {
        this._currentLevel = value;
        localStorage.setItem("currentLevel", value.toString());
    }

    private _currentLevelProgress: number[];
    set currentLevelProgress(value: number[]) {
        this._currentLevelProgress = value;
        localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
    }
    addCurrentLevelProgress(value: number) {
        this._currentLevelProgress.push(value);
        localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
    }

    public constructor(initialLevel: number = 1) {
        super({ eventMode: "static" });
        const currentStorageLevel = localStorage.getItem("currentLevel");
        if (!currentStorageLevel) {
            this._currentLevel = initialLevel;
            localStorage.setItem("currentLevel", this._currentLevel.toString());
        } else {
            this._currentLevel = Number.parseInt(currentStorageLevel);
        }

        const currentStorageLevelProgress = localStorage.getItem(`level[${this._currentLevel}].progress`);
        if (!currentStorageLevelProgress) {
            this._currentLevelProgress = [];
            localStorage.setItem(`level[${this._currentLevel}].progress`, this._currentLevelProgress.toString());
        } else {
            this._currentLevelProgress = currentStorageLevelProgress.split(',').map(i => Number.parseInt(i));
        }

        this.uuid = uuidv4();
        localStorage.setItem("activeId", this.uuid);
        window.addEventListener("visibilitychange", this.handleActiveApplicationCheck.bind(this));

        window.addEventListener("resize", this.handleResize.bind(this));
    }

    async init(options?: Partial<ApplicationOptions>): Promise<void> {
        await super.init(options);
        await this.loadAssets();
        this.handleActiveApplicationCheck();
        this.handleResize();
    }

    handleActiveApplicationCheck() {
        const activeAppId = localStorage.getItem("activeId");
        if (activeAppId !== this.uuid && !this.reloadPopup) {
            this.reloadPopup = this.stage.addChild(new ReloadPopup(this.assets));
            this.updateLayout(window.innerHeight / Game.HEIGHT);
        }
    }

    async loadAssets() {
        Assets.addBundle('fonts', { "vag-world": './public/vag-world-bold.ttf' });

        await Assets.init({ manifest });

        this.assets = await Assets.loadBundle("game");

        await Assets.loadBundle("fonts");

        for (let i = 1; i < 4; i++) {
            const { data } = await axios.get<{ words: string[] }>(`public/levels/${i}.json`);
            this.levels[`level${i}`] = data.words;
        }
    }

    handleResize() {
        const scale = window.innerHeight / Game.HEIGHT;
        this.stage.scale.set(scale);
        this.updateLayout(scale);
    }


    async startGame() {
        this.titleComponent = this.stage.addChild(new Title(this._currentLevel));

        this.field = this.stage.addChild(new Field(this.assets, this.getCurrentLevelConfig(), this._currentLevelProgress));

        this.inputController = this.stage.addChild(new LettersController(this.assets, this.getCurrentLevelLetters()));

        this.updateLayout(window.innerHeight / Game.HEIGHT);
    }

    updateLayout(scale: number) {
        const screenWidthScaled = this.screen.width / scale;
        if (this.titleComponent) {
            this.titleComponent.position.set(screenWidthScaled / 2, 20);
        }

        if (this.field) {
            this.field.position.set(screenWidthScaled / 2 + this.field.width / 2, 170);
            this.field.pivot.set(this.field.width / 2, 0);
        }

        if (this.inputController) {
            this.inputController.on("lettersController:wordCheck", this.handleWordSelectionComplete, this);
            this.inputController.position.set(screenWidthScaled / 2, 700);
        }

        if (this.winPopup) {
            this.winPopup.position.set(screenWidthScaled / 2, 0);
        }

        if (this.reloadPopup) {
            this.reloadPopup.position.set(screenWidthScaled / 2, 0);
        }

    }

    convertCurrentLevelToReal(level: number) {
        const realLevel = level % 3;
        return realLevel === 0 ? 3 : realLevel;
    }

    getCurrentLevelConfig() {
        const convertedLevelNum = this.convertCurrentLevelToReal(this._currentLevel);
        return this.levels[`level${convertedLevelNum}`];
    }

    getCurrentLevelLetters() {
        const levelConfig = this.getCurrentLevelConfig();
        const allWords = levelConfig.join("");
        const uniqueChars = [...new Set(allWords)];
        return uniqueChars;
    }

    handleWordSelectionComplete(word: string) {
        const currentLevel = this.getCurrentLevelConfig();
        const index = currentLevel.findIndex(levelWord => levelWord == word);
        if (index !== -1) {
            this.addCurrentLevelProgress(index);
            this.field?.openLine(index);
        }
        if (this.field?.openedLines === currentLevel.length) {
            this.handleLevelWin();
        }
    }

    handleLevelWin() {
        this.titleComponent?.destroy();
        this.titleComponent = undefined;
        this.field?.destroy();
        this.field = undefined;
        this.inputController?.destroy();
        this.inputController = undefined;
        this.winPopup = this.stage.addChild(new WinPopup(this.assets, this._currentLevel));
        this.winPopup.on("winPopup:close", this.handleCloseWinPopup, this);
        this.updateLayout(window.innerHeight / Game.HEIGHT);
    }

    handleCloseWinPopup() {
        this.currentLevel = this._currentLevel + 1;
        this.currentLevelProgress = [];
        this.startGame();
    }
}
