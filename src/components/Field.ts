import { Container } from "pixi.js";
import { GameAssets } from "../configuration/types";
import { FieldCell } from "./FieldCell";

export class Field extends Container {
    private _allLevels: string[][];
    private _levelConfig: string[];
    get levelConfig() {
        return this._levelConfig;
    }
    set levelConfig(value: string[]) {
        this._levelConfig = value;
    }

    private lines: Array<Container>;
    private ind: number = 0;

    constructor(levels: Array<{ words: string[] }>, assets: GameAssets, currentLevel: number = 1) {
        super();
        this._allLevels = levels.map(level => level.words);
        this._levelConfig = this._allLevels[currentLevel - 1];

        this.lines = this.levelConfig.map((word, index) => {
            const line = new Container();

            const letters = word.split("").map((letter, letterIndex) => {
                const cell = new FieldCell(letter, assets);
                cell.position.set(letterIndex * 100, 0);
                return cell;
            });

            line.addChild(...letters);

            line.position.set(0, index * (assets.letterCell.height + 20));

            line.pivot.set(line.width / 2 - letters[0].width / 2, 0);

            return line;
        });

        this.addChild(...this.lines);

        this.on("pointerdown", this.handleClick, this);
        this.eventMode = "static";
    }

    openLine(index: number) {
        const cells = this.lines[index].children as FieldCell[];
        cells.forEach((fieldCell: FieldCell) => fieldCell.openLetter());
    }

    handleClick() {
        this.openLine(this.ind);
        this.ind += 1;
    }
}
