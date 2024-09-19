import { Texture } from "pixi.js";

export interface GameAssets {
    letterCell: Texture;
    letterCellGreen: Texture;
    buttonGreen: Texture;
    letterPick: Texture;
    letterPickPink: Texture;
    letterPickBackground: Texture;
    reloadPopupBackground: Texture;
    reloadPopupRibbon: Texture;
};

export type GameFontColor = "#FFFFFF" | "#4D4D4D";

export const whiteColor = "#FFFFFF";
export const grayColor = "#4D4D4D";
