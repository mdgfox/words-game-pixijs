import { TextStyle } from "pixi.js";
import { GameFontColor } from "../../configuration/types";

export const defaultTextStyle = (fontSize: number = 64, fill: GameFontColor = "#FFFFFF") => new TextStyle({
    fontFamily: "Rubik Semibold",
    fontWeight: "700",
    fill,
    fontSize,
    lineHeight: 35,
    align: "center",
});

export const adjustableTextStyle = (fontSize: number, lineHeight: number, wordWrapWidth: number, fill: GameFontColor = "#FFFFFF") => new TextStyle({
    fontFamily: "Rubik Semibold",
    fontWeight: "700",
    fill,
    fontSize,
    lineHeight,
    align: "center",
    wordWrap: wordWrapWidth !== -1,
    wordWrapWidth,
});