import { IDashboardContent, IDashboardInput, IDashboardPart } from "../IDashboard";

export interface ITileContent {
    type: string;

    loadFromPartContent(partContent: IDashboardContent): void;
    exportToPartContent(): IDashboardContent;

    loadInputsFromPart?(part: IDashboardPart): void;

    getDashboardInputs?(): IDashboardInput[];

    copy(tileContent: ITileContent): void;
}