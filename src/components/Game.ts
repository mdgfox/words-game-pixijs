import { Application, Assets, Texture } from "pixi.js";
import { manifest } from "../configuration/assetsManifest";
import { Title } from "./Title";
import { Field } from "./Field";
import axios from "axios";

export class Game extends Application {
    public static WIDTH = 640;
    public static HEIGHT = 1136;

    protected assets: { letterCell?: Texture, buttonGreen?: Texture, letterField?: Texture } = {};

    private titleComponent!: Title;
    private field!: Field;
    private levels: Array<{ words: string[] }> = [];

    public constructor() {
        super();
        // this.stage.scale.set(2);
    }

    async loadAssets() {
        Assets.addBundle('fonts', { "vag-world": './public/vag-world-bold.ttf' });

        await Assets.init({ manifest });

        this.assets = await Assets.loadBundle("game");

        await Assets.loadBundle("fonts");

        for (let i = 1; i < 4; i++) {
            const levelConfig = await this.fetchLevelById(i);
            this.levels.push(levelConfig);
        }
    }

    async fetchLevelById(id: number) {
        const { data } = await axios.get<{ words: string[] }>(`public/levels/${id}.json`);
        return data;
    }

    async startGame() {
        this.titleComponent = this.stage.addChild(new Title());
        this.titleComponent.position.set(1000 / 2, 40);

        this.field = this.stage.addChild(new Field(this.levels, this.assets.letterCell!));
        this.field.position.set(720, 500);

        // todo here word letters select component
    }

}
