import React from "react";
import './TileContents.css';
import { ITileContent } from "../../../interfaces/content/ITileContent";

export class TileContents<T extends ITileContent, S> extends React.Component<{content: T}, S> {
    render() {
        return <div className="contents">test3</div>
    }
}