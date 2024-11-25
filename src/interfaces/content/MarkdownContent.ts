import { IDashboardContent } from "../IDashboard";
import { ITileContent } from "./ITileContent";

export class MarkdownContent implements ITileContent {
    public readonly type = "markdown";
    public markdown!: string;

    copy(tileContent: ITileContent): void {
        this.markdown = (tileContent as MarkdownContent).markdown;
    }

    loadFromPartContent(partContent: IDashboardContent): void {
        this.markdown = partContent.content ?? "";
    }

    exportToPartContent(): IDashboardContent {
        return {
            content: this.markdown,
            title: "",
            subtitle: "",
            markdownSource: 1,
            markdownUri: "",
        }
    }

}