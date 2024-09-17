import { TextStyle } from "pixi.js";

export const defaultTextStyle = (fontSize: number = 64, fill: string = "#FFFFFF") => new TextStyle({
    fontFamily: 'Vag World Bold',
    fontWeight: "700",
    fill,
    fontSize,
    lineHeight: 35,
    align: "center",
});
