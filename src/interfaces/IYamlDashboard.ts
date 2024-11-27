import { ITile } from "./ITile";
import { IGroupedTiles } from "./ITileGroup";

export interface IYamlDashboard {
    name: string;
    tiles: ITile[];
}

export interface IPartialYamlDashboard {
    name: string;
    tiles: (ITile | IGroupedTiles)[]
}