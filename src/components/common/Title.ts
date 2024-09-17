import { Container, Text } from 'pixi.js';
import { defaultTextStyle } from './TextStyles';

export class Title extends Container {
    private titleText: Text;
    constructor(currentLevel: number) {
        super();
        const text = `Уровень ${currentLevel}`;
        this.titleText = this.addChild(new Text({ text, style: defaultTextStyle() }));
        this.titleText.anchor.set(0.5, 0);
    }
}
