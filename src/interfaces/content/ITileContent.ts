import { IDashboardContent, IDashboardInput, IDashboardPart } from "../IDashboard";

export interface ITileContent {
    type: string;

    loadFromPartContent(partContent: IDashboardContent): void;
    loadInputsFromPart?(part: IDashboardPart): void;

    exportToPartContent(): Promise<IDashboardContent>;
    getDashboardInputs?(): Promise<IDashboardInput[]>;

    copy(tileContent: ITileContent): void;
}