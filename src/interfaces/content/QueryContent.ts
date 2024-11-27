import { getQueryString } from "../../dashboard-viewer/services/MonitorService";
import { IDashboardContent, IDashboardInput, IDashboardPart } from "../IDashboard";
import { ITileContent } from "./ITileContent";

export interface QueryVariable {
    name: string;
    value: string;
}

export class QueryContent implements ITileContent {
    public readonly type = "query";
    public queryType!: "inline" | "shared";
    public query!: string;

    public variables?: QueryVariable[];

    public title!: string;
    public subtitle!: string;
    public resourceId!: string;

    copy(tileContent: ITileContent): void {
        this.queryType = (tileContent as QueryContent).queryType;
        this.query = (tileContent as QueryContent).query;
        this.variables = (tileContent as QueryContent).variables;
        this.title = (tileContent as QueryContent).title;
        this.subtitle = (tileContent as QueryContent).subtitle;
        this.resourceId = (tileContent as QueryContent).resourceId;
    }

    loadInputsFromPart(part: IDashboardPart): void {
        var inputs = part.metadata.inputs;

        var resourceInput = inputs.find(input => input.name === "Scope");

        this.resourceId = (resourceInput?.value as any)?.resourceIds[0] ?? "";
    }

    async getDashboardInputs(): Promise<IDashboardInput[]> {
        var genericInputs = this.getGenericInputs();
        var specificInputs = await this.getSpecificInputs();

        var fullInputs = genericInputs.concat(specificInputs);

        return fullInputs;
    }

    loadFromPartContent(partContent: IDashboardContent): void {
        this.queryType = "inline";
        this.query = partContent.Query ?? "";
        this.title = partContent.PartTitle ?? "";
        this.subtitle = partContent.PartSubTitle ?? "";
    }

    async exportToPartContent(): Promise<IDashboardContent> {
        return {
            content: this.query,
            PartTitle: this.title,
            PartSubTitle: this.subtitle,
        }
    }

    private getGenericInputs(): IDashboardInput[] {
        return [
            {
                name: "Version",
                value: "2.0",
                isOptional: true
            },
            {
                name: "Dimensions",
                isOptional: true
            },
            {
                name: "ControlType",
                value: "AnalyticsGrid",
                isOptional: true
            }
        ]
    }


    private async getSpecificInputs(): Promise<IDashboardInput[]> {
        const queryString = await getQueryString(this);

        return [
            {
                name: "PartTitle",
                value: this.title,
                isOptional: true
            },
            {
                name: "PartSubTitle",
                value: this.subtitle,
                isOptional: true
            },
            {
                name: "Query",
                value: queryString,
                isOptional: true
            },
            {
                name: "Scope",
                value: {
                    resourceIds: [
                        this.resourceId
                    ]
                },
                isOptional: true
            },
        ]

    }

}