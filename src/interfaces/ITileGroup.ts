import { ITile } from "./ITile";

export interface IGroupedTiles {
    groupName: string;
    x: number;
    y: number;
    variables: { name: string, value: string }[];
}

export interface ITileGroup {
    name: string;
    tiles: ITile[];
}

export interface ITileGroups {
    groups: ITileGroup[];
}