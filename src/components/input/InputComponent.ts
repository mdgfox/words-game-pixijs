import { Container, DestroyOptions } from "pixi.js";
import { SelectedLettersComponent } from "./SelectedLettersComponent";
import { GameAssets } from "../../configuration/types";
import { LettersCircleComponent } from "./LettersCircleComponent";
import { LetterComponent } from "./LetterComponent";

export class InputComponent extends Container {
    private root: Container;
    private currentWordComponent: SelectedLettersComponent;
    private lettersRoulette: LettersCircleComponent;
    constructor(assets: GameAssets, chars: string[]) {
        super({ eventMode: "static" });

        this.root = this.addChild(new Container());
        this.currentWordComponent = this.root.addChild(new SelectedLettersComponent(assets));
        this.lettersRoulette = this.root.addChild(new LettersCircleComponent(assets, chars));
        this.lettersRoulette.position.set(0, 230);

        this.lettersRoulette.on("letterRoulette:onLetterSelected", this.handleLetterSelected, this);

        this.lettersRoulette.on("letterRoulette:onLetterDeselected", this.handleLetterDeselected, this);

        this.lettersRoulette.on("letterRoulette:onSelectionComplete", this.handleSelectionComplete, this);
    }

    handleLetterSelected(letterComponent: LetterComponent) {
        this.currentWordComponent.word += letterComponent.letter;
    }

    handleLetterDeselected(_letterComponent: LetterComponent) {
        this.currentWordComponent.removeLastLetter();
    }

    handleSelectionComplete(word: string) {
        if (word.length > 1) {
            this.emit("lettersController:wordCheck", word);
        }
        this.currentWordComponent.word = "";
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.lettersRoulette.off("letterRoulette:onLetterSelected", this.handleLetterSelected, this);
        this.lettersRoulette.off("letterRoulette:onLetterDeselected", this.handleLetterDeselected, this);
        this.lettersRoulette.off("letterRoulette:onSelectionComplete", this.handleSelectionComplete, this);
    }
}
