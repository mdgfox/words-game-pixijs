import { AssetsManifest } from "pixi.js";

export const manifest: AssetsManifest = {
    bundles: [
        {
            name: "game",
            assets: [
                {
                    alias: "letterCell",
                    src: "public/assets/letter-cell.png",
                },
                {
                    alias: "letterCellGreen",
                    src: "public/assets/letter-cell-green.png",
                },
                {
                    alias: "buttonGreen",
                    src: "public/assets/button-green.png",
                },
                {
                    alias: "letterPick",
                    src: "public/assets/letter-pick.png",
                },
                {
                    alias: "letterPickPink",
                    src: "public/assets/letter-pick-pink.png",
                },
                {
                    alias: "letterPickBackground",
                    src: "public/assets/letter-pick-background.png",
                },
                {
                    alias: "reloadPopupBackground",
                    src: "public/assets/reload-popup-background.png",
                },
                {
                    alias: "reloadPopupRibbon",
                    src: "public/assets/reload-popup-ribbon.png",
                }
            ]
        },
    ]
};
