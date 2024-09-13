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
                    alias: "buttonGreen",
                    src: "public/assets/letter-cell.png",
                },
                {
                    alias: "letterField",
                    src: "public/assets/letter-field.png",
                },
            ]
        },
    ]
};
