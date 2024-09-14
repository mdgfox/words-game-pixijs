import { Application, ApplicationOptions, Assets } from "pixi.js";
import { manifest } from "../configuration/assetsManifest";
import { Title } from "./Title";
import { Field } from "./Field";
import axios from "axios";
import { GameAssets } from "../configuration/types";
import { LettersController } from "./LettersController";

export class Game extends Application {
    public static WIDTH = 640;
    public static HEIGHT = 1136;

    protected assets!: GameAssets;
    private levels: Array<{ words: string[] }> = [];

    private titleComponent!: Title;
    private field!: Field;
    private inputController!: LettersController;

    private currentLevel: number;

    public constructor(initialLevel: number) {
        super();
        this.currentLevel = initialLevel;
        this.stage.eventMode = "static";
    }

    async init(options?: Partial<ApplicationOptions>): Promise<void> {
        await super.init(options);
        await this.loadAssets();
    }

    async loadAssets() {
        Assets.addBundle('fonts', { "vag-world": './public/vag-world-bold.ttf' });

        await Assets.init({ manifest });

        this.assets = await Assets.loadBundle("game");

        await Assets.loadBundle("fonts");

        for (let i = 1; i < 4; i++) {
            const { data } = await axios.get<{ words: string[] }>(`public/levels/${i}.json`);
            this.levels.push(data);
        }
    }

    async startGame() { // todo here need to get level num, to restart game with different levels
        this.titleComponent = this.stage.addChild(new Title());
        this.titleComponent.position.set(this.screen.width / 2, 40);

        this.field = this.stage.addChild(new Field(this.levels, this.assets));
        this.field.position.set(this.screen.width / 2 + this.field.width / 2, 200);
        this.field.pivot.set(this.field.width / 2, 0);

        this.inputController = this.stage.addChild(new LettersController(this.assets));
        this.inputController.position.set(this.screen.width / 2, 750);
        this.inputController.pivot.set(this.inputController.width / 2, 0);
    }

}
