import { ITile } from "./ITile";
import { IGroupedTiles } from "./ITileGroup";

export interface IYamlDashboard {
    name: string;
    isMain?: boolean;
    timeRange?: string;
    tiles: ITile[];
}

export interface IPartialYamlDashboard {
    name: string;
    isMain?: boolean;
    timeRange?: string;
    tiles: (ITile | IGroupedTiles)[]
}