import { ITileContent } from "./content/ITileContent";
import { IDashboardPart, IDashboard } from "./IDashboard";
import { ISharedQueries } from "./ISharedQueries";
import { ITile } from "./ITile";
import { IYamlDashboard } from "./IYamlDashboard";

export interface IDashboardService {
    getDashboard(): Promise<IYamlDashboard>;
    getSharedQueries(): Promise<ISharedQueries>;
    loadDashboardFromYaml(yamlString: string): IYamlDashboard;
    initTileContent(content: ITileContent): ITileContent;
    createEmptyTileContent(type: string): ITileContent;
    getTileTypeMappings(): { key: string, value: string }[];
    getDashboardAggregationMappings(): { key: number, value: string }[];
    convertTileToPart(tile: ITile): Promise<IDashboardPart>;
    convertPartToTile(part: IDashboardPart): ITile;
    createDashboardFromYaml(yamlDashboard: IYamlDashboard): Promise<IDashboard>;
    createEmptyDashboard(): Partial<IDashboard>;
}