import { Container, FederatedEvent, Graphics, Point, Sprite } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { LetterComponent } from "./LetterComponent";

export class LettersRoulette extends Container {

    private assets: GameAssets;
    private root: Container;
    private letters: Array<LetterComponent>;
    private selectorLine: Graphics;
    private linesContainer: Container;
    private lettersContainer: Container;
    private selectionStarted = false;
    private selectedLetters: Array<LetterComponent> = [];

    private _radius: number = 135;

    public get radius(): number {
        return this._radius;
    }
    public set radius(value: number) {
        this._radius = value;
        this.updateLettersPositions();
    }

    constructor(assets: GameAssets, chars: string[]) {
        super({ eventMode: "static" });

        this.assets = assets;

        this.root = this.addChild(new Container());

        this.selectorLine = this.root.addChild(new Graphics());

        this.linesContainer = this.root.addChild(new Container());

        this.lettersContainer = this.root.addChild(new Container());
        const lettersContainerBackground = this.lettersContainer.addChild(new Sprite({ texture: assets.letterPickBackground, anchor: 0.5 }));

        this.letters = this.shuffleChars(chars).map((char) => {
            const letter = this.lettersContainer.addChild(new LetterComponent(assets, char));

            letter.on("onPointerDown", this.onLetterPointerDown, this);
            letter.on("onPointerOver", this.onPointerOverLetter, this);

            return letter;
        });

        this.initListeners();

        this.updateLayout();
    }

    private updateLettersPositions() {
        const angleRad = 2 * Math.PI / this.letters.length;

        for (let i = 0; i < this.letters.length; i++) {
            const angle = i * angleRad - Math.PI / 2;
            this.letters[i].position.set(Math.cos(angle) * this._radius, Math.sin(angle) * this._radius);
        }
    }

    private updateLayout() {
        this.updateLettersPositions();
    }

    private initListeners() {
        this.on("pointerup", this.onPointerUp, this);
        this.on("pointerupoutside", this.onPointerUp, this);
        this.on("pointermove", this.onPointerMove, this);
    }

    private onPointerUp(_e: FederatedEvent) {
        if (!this.selectionStarted) {
            return;
        }
        const word = this.selectedLetters.map((letter) => letter.letter).join("");
        this.emit("letterRoulette:onSelectionComplete", word);
        this.selectionStarted = false;
        this.selectedLetters = [];
        this.letters.forEach(letter => letter.selected = false);
        this.linesContainer.removeChildren();
        this.selectorLine.clear();
    }

    private onPointerMove(e: any) {
        if (!this.selectionStarted) {
            return;
        }
        if (this.selectedLetters.length == 0) {
            return;
        }
        const lastSelectedLetter = this.selectedLetters[this.selectedLetters.length - 1];
        const mousePosition = e.data.getLocalPosition(this);
        this.selectorLine.clear();
        this.drawSelectorLine(this.selectorLine, lastSelectedLetter.position, mousePosition);
    }

    private onLetterPointerDown(letter: LetterComponent) {
        this.selectionStarted = true;
        this.setLetterSelected(letter);
    }

    private onPointerOverLetter(letter: LetterComponent) {
        if (!this.selectionStarted) {
            return;
        }
        if (letter.selected) {
            this.tryDeselectLetter(letter);
            return;
        }
        this.setLetterSelected(letter);
    }

    private tryDeselectLetter(letter: LetterComponent) {
        if (this.selectedLetters.length < 2) {
            return;
        }
        const previousLetterIndex = this.selectedLetters.length - 2 < 0 ? 0 : this.selectedLetters.length - 2;
        const previousLetter = this.selectedLetters[previousLetterIndex];
        if (previousLetter != letter) {
            return;
        }
        const lastLetter = this.selectedLetters.pop();
        lastLetter!.selected = false;
        this.linesContainer.removeChildAt(this.linesContainer.children.length - 1);
        this.emit("letterRoulette:onLetterDeselected", lastLetter);
    }

    private setLetterSelected(letter: LetterComponent) {
        letter.selected = true;
        if (this.selectedLetters.length > 0) {
            const previousLetter = this.selectedLetters[this.selectedLetters.length - 1];
            this.linesContainer.addChild(this.drawLine(new Graphics(), previousLetter.position, letter.position));
        }
        this.selectedLetters.push(letter);
        this.emit("letterRoulette:onLetterSelected", letter);
    }

    private drawLine(container: Graphics, from: Point, to: Point): Graphics {
        container.setStrokeStyle({ width: 100, color: "#638EC4" })
        container.moveTo(from.x, from.y);
        container.lineTo(to.x, to.y);
        return container;
    }

    private drawSelectorLine(container: Graphics, from: Point, to: Point): Graphics {
        return this.drawLine(container, from, to).lineStyle(15, "#638EC4")
            .beginFill("#638EC4")
            .circle(to.x, to.y, 15)
            .endFill();
    }

    private shuffleChars(chars: string[]) {
        const arrCopy = [...chars];
        for (let i = arrCopy.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arrCopy[i], arrCopy[j]] = [arrCopy[j], arrCopy[i]];
        }
        return arrCopy;
    }
}
