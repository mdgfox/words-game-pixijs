import { Container } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { FieldCell } from "../common/FieldCell";

export class Field extends Container {
    private currentLevel: string[];
    private lines: Array<Container>;
    private openedLinesCounter: number = 0;
    get openedLines() {
        return this.openedLinesCounter;
    }

    constructor(assets: GameAssets, words: string[], progress: number[]) {
        super({ eventMode: "static" });
        this.currentLevel = words;

        this.lines = this.currentLevel.map((word, index) => {
            const line = new Container();

            const letters = word.split("").map((letter, letterIndex) => {
                const cell = new FieldCell(letter, assets);
                cell.position.set(letterIndex * 100, 0);
                return cell;
            });

            if (progress.includes(index)) {
                this.openedLinesCounter++;
                letters.forEach((fieldCell: FieldCell) => fieldCell.openLetter());
            }

            line.addChild(...letters);

            line.position.set(0, index * (assets.letterCell.height + 20));

            line.pivot.set(line.width / 2 - letters[0].width / 2, 0);

            return line;
        });

        this.addChild(...this.lines);
    }

    openLine(index: number) {
        this.openedLinesCounter++;
        const cells = this.lines[index].children as FieldCell[];
        cells.forEach((fieldCell: FieldCell) => fieldCell.openLetter());
    }
}
