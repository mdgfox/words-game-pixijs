import { Container, DestroyOptions } from "pixi.js";
import { SelectedLettersComponent } from "./SelectedLettersComponent";
import { GameAssets } from "../../../configuration/types";
import { LettersCircleComponent } from "./LettersCircleComponent";
import { LetterComponent } from "./LetterComponent";
import { GameModel } from "../../../models/GameModel";
import { Game } from "../../Game";

export class InputComponent extends Container {
    private root: Container;
    private currentWordComponent: SelectedLettersComponent;
    private lettersCircle: LettersCircleComponent;
    private resizeHandler: () => void;

    constructor(private readonly assets: GameAssets, private readonly gameModel: GameModel) {
        super({ eventMode: "static" });

        this.root = this.addChild(new Container());
        this.currentWordComponent = this.root.addChild(new SelectedLettersComponent(this.assets));
        this.lettersCircle = this.root.addChild(new LettersCircleComponent(this.assets, this.gameModel.getCurrentLevelLetters()));
        this.lettersCircle.position.set(0, 230);

        this.lettersCircle.on("lettersCircle:onLetterSelected", this.handleLetterSelected, this);

        this.lettersCircle.on("lettersCircle:onLetterDeselected", this.handleLetterDeselected, this);

        this.lettersCircle.on("lettersCircle:onSelectionComplete", this.handleSelectionComplete, this);

        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeHandler);

        this.handleResize();
    }

    handleLetterSelected(letterComponent: LetterComponent) {
        this.currentWordComponent.word += letterComponent.letter;
    }

    handleLetterDeselected(_letterComponent: LetterComponent) {
        this.currentWordComponent.removeLastLetter();
    }

    handleSelectionComplete(word: string) {
        if (word.length > 1) {
            this.gameModel.handleWordSelectionComplete(word);
        }
        this.currentWordComponent.word = "";
    }

    handleResize() {
        const scale = Math.min(window.innerWidth / Game.WIDTH, window.innerHeight / Game.HEIGHT);
        this.position.set(window.innerWidth / scale / 2, 750);
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.lettersCircle.off("lettersCircle:onLetterSelected", this.handleLetterSelected, this);
        this.lettersCircle.off("lettersCircle:onLetterDeselected", this.handleLetterDeselected, this);
        this.lettersCircle.off("lettersCircle:onSelectionComplete", this.handleSelectionComplete, this);
        window.removeEventListener("resize", this.resizeHandler);
    }
}
