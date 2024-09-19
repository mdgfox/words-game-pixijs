import { Container, DestroyOptions } from "pixi.js";
import { GameAssets } from "../../configuration/types";
import { GameModel } from "../../models/GameModel";
import { Game } from "../Game";
import { FieldCell } from "./FieldCell";

export class Field extends Container {
    private currentLevel: string[];
    private lines: Array<Container>;
    private resizeHandler: () => void;

    constructor(private readonly assets: GameAssets, private readonly gameModel: GameModel) {
        super({ eventMode: "static" });
        this.currentLevel = this.gameModel.currentLevelConfig;

        this.lines = this.currentLevel.map((word, index) => {
            const line = new Container();

            const letters = word.split("").map((letter, letterIndex) => {
                const cell = new FieldCell(letter, this.assets);
                cell.position.set(letterIndex * 100, 0);
                return cell;
            });

            if (gameModel.currentLevelProgress.includes(index)) {
                letters.forEach((fieldCell: FieldCell) => fieldCell.openLetter());
            }

            line.addChild(...letters);

            line.position.set(0, index * (this.assets.letterCell.height + 20));

            line.pivot.set(line.width / 2 - letters[0].width / 2, 0);

            return line;
        });

        this.addChild(...this.lines);

        this.gameModel.on("gameModel:openLine", this.openLine, this);
        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeHandler);

        this.handleResize();
    }

    handleResize() {
        const scale = window.innerHeight / Game.HEIGHT;
        this.position.set(window.innerWidth / scale / 2 + this.width / 2, 170);
        this.pivot.set(this.width / 2, 0);
    }

    openLine(index: number) {
        const cells = this.lines[index].children as FieldCell[];
        cells.forEach((fieldCell: FieldCell) => fieldCell.openLetter());
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        this.gameModel.off("gameModel:openLine", this.openLine, this);
        window.removeEventListener("resize", this.resizeHandler);
    }
}
