import { Container } from "pixi.js";
import { WordInputVisualization } from "./WordInputVisualization";
import { GameAssets } from "../configuration/types";

export class LettersController extends Container {
    private root: Container;
    private currentWordComponent: WordInputVisualization;
    constructor(assets: GameAssets) {
        super();

        this.root = this.addChild(new Container());
        this.currentWordComponent = this.root.addChild(new WordInputVisualization(assets));
    }
}
