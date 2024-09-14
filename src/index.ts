import { Game } from './components/Game';


window.onload = async (): Promise<void> => {
    const game = new Game(1);
    await game.init({
        backgroundColor: "#2B344B",
        backgroundAlpha: 1.0,
        width: Game.WIDTH,
        height: Game.HEIGHT,
        resizeTo: window,
        antialias: true
    });
    // eslint-disable-next-line
    (globalThis as any).__PIXI_APP__ = game;
    document.body.appendChild(game.canvas);
    game.startGame();
};
