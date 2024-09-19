import { Container, DestroyOptions } from "pixi.js";
import { Game } from "../Game";

export class BasePopup extends Container {
    protected resizeHandler: () => void;

    constructor() {
        super({ eventMode: "static" });

        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener("resize", this.resizeHandler);
    }

    handleResize() {
        const scale = window.innerHeight / Game.HEIGHT;
        this.position.set(window.innerWidth / scale / 2, 0);
    }

    protected show() {
        // todo here we can adjust simple animation
    }

    protected hide() {
        // todo here we can adjust simple animation
    }

    showModal<T>() {
        return new Promise((resolve) => {
            this.once("modal:close",
                (key: T) => {
                    this.hide();
                    resolve(key);
                });
            this.show();
        });
    }

    destroy(options?: DestroyOptions): void {
        super.destroy(options);
        window.removeEventListener("resize", this.resizeHandler);
    }
}