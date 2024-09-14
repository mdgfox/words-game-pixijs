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
                    src: "public/assets/letter-cell.png",
                },
                {
                    alias: "letterPick",
                    src: "public/assets/letter-pick.png",
                },
                {
                    alias: "letterPickPink",
                    src: "public/assets/letter-pick-pink.png",
                },
            ]
        },
    ]
};
