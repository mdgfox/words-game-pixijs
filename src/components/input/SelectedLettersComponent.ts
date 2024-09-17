import { Container, DestroyOptions } from "pixi.js";
import { GameAssets, grayColor } from "../../configuration/types";
import { FieldCell } from "../common/FieldCell";

export class SelectedLettersComponent extends Container {
    private assets: GameAssets;
    private _word: string = "";
    get word() {
        return this._word;
    }
    set word(word: string) {
        this._word = word;
        this.emit("word:updated");
    }
    private root: Container;
    private cells: Array<FieldCell> = [];
    get cellWidth() {
        return 42; // todo check access bug this.cells.length > 0 ? this.cells[0].width : 0;
    }
    constructor(assets: GameAssets) {
        super();

        this.assets = assets;
        this.root = this.addChild(new Container());

        this.addListener("word:updated", this.updateLayout, this);
    }

    updateLayout() {
        this.cells.forEach(cell => cell.destroy());

        const newCells = this.word.split("").map((letter, index) => {
            const cell = new FieldCell(letter, this.assets, 0.58, grayColor);
            cell.position.set(index * 50, 0);
            this.cells.push(cell);
            return cell;
        });

        if (newCells.length > 0) {
            this.root.addChild(...newCells);
        }
        const newPivotX = this.root.width / 2 - this.cellWidth / 2;
        this.root.pivot.set(newPivotX, 0);
    }

    removeLastLetter() {
        if (this.word.length > 0) {
            this.word = this.word.substring(0, this.word.length - 1);
        }
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.removeListener("word:updated", this.updateLayout);
    }
}
