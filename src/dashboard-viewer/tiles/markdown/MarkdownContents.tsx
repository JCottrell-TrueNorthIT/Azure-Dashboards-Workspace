import Markdown from "react-markdown";

import rehypeRaw from "rehype-raw";
import { TileContents } from "../base/TileContents";
import "./MarkdownContents.css";
import { MarkdownContent } from "../../../interfaces/content/MarkdownContent";

export class MarkdownContents extends TileContents<MarkdownContent, any> {
    
    render() {
        return (
            <Markdown rehypePlugins={[rehypeRaw]} >{this.props.content.markdown}</Markdown>
        );
    }
}