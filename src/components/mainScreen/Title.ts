import { Container, DestroyOptions, Text } from 'pixi.js';
import { defaultTextStyle } from './TextStyles';
import { Game } from '../Game';

export class Title extends Container {
    private titleText: Text;
    private resizeHandler: () => void;

    constructor(currentLevel: number) {
        super();
        const text = `Уровень ${currentLevel}`;
        this.titleText = this.addChild(new Text({ text, style: defaultTextStyle(72) }));
        this.titleText.anchor.set(0.5, 0);

        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeHandler);

        this.handleResize();
    }

    handleResize() {
        const scale = window.innerHeight / Game.HEIGHT;
        this.position.set(window.innerWidth / scale / 2, 50);
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        window.removeEventListener("resize", this.resizeHandler);
    }
}
