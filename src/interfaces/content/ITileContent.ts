import { IDashboardContent, IDashboardInput, IDashboardPart } from "../IDashboard";
import { ITile } from "../ITile";

export interface ITileContent {
    parent?: ITile;
    type: string;

    loadFromPartContent(partContent: IDashboardContent): void;
    loadInputsFromPart?(part: IDashboardPart): void;

    exportToPartContent(): Promise<IDashboardContent>;
    getDashboardInputs?(): Promise<IDashboardInput[]>;

    copy(tileContent: ITileContent): void;
}