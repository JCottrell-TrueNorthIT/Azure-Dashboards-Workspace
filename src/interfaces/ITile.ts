import { ITileContent } from "./content/ITileContent";

export interface ITile {
    title?: string,
    subtitle?: string,
    x: number,
    y: number,
    columnsWidth: number,
    rowsHeight: number,
    content: ITileContent
}
