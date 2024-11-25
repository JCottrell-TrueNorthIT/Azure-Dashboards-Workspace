import { IDashboardContent, IDashboardInput, IDashboardPart } from "../IDashboard";
import { ITileContent } from "./ITileContent";

export class QueryContent implements ITileContent {
    public readonly type = "query";
    public query!: string;

    public title!: string;
    public subtitle!: string;
    public resourceId!: string;

    copy(tileContent: ITileContent): void {
        this.query = (tileContent as QueryContent).query;
        this.title = (tileContent as QueryContent).title;
        this.subtitle = (tileContent as QueryContent).subtitle;
        this.resourceId = (tileContent as QueryContent).resourceId;
    }

    loadInputsFromPart(part: IDashboardPart): void {
        var inputs = part.metadata.inputs;

        var resourceInput = inputs.find(input => input.name === "Scope");

        this.resourceId = (resourceInput?.value as any)?.resourceIds[0] ?? "";
    }

    getDashboardInputs(): IDashboardInput[] {
        var genericInputs = this.getGenericInputs();
        var specificInputs = this.getSpecificInputs();

        var fullInputs = genericInputs.concat(specificInputs);

        return fullInputs;
    }

    loadFromPartContent(partContent: IDashboardContent): void {
        this.query = partContent.Query ?? "";
        this.title = partContent.PartTitle ?? "";
        this.subtitle = partContent.PartSubTitle ?? "";
    }

    exportToPartContent(): IDashboardContent {
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


    private getSpecificInputs(): IDashboardInput[] {
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
                value: this.query,
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