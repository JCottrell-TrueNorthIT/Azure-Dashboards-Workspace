import React from "react";
import './Tile.css';
import { ChartContents } from "../chart/ChartContents";
import { MarkdownContents } from "../markdown/MarkdownContents";
import { QueryContents } from "../query/QueryContents";
import { MetricsContent } from "../../../interfaces/content/MetricsContent";
import { ITile } from "../../../interfaces/ITile";
import { MarkdownContent } from "../../../interfaces/content/MarkdownContent";
import { QueryContent } from "../../../interfaces/content/QueryContent";

interface TileProps {
    tile: ITile;
};

export class Tile extends React.Component< TileProps > {

    getTileContent() {
        const content = this.props.tile.content;

        switch (this.props.tile.content.type) {
            case "metrics":
                return <ChartContents content={content as MetricsContent}/>
            case "markdown":
                return <MarkdownContents content={content as MarkdownContent}/>
            case "query":
                return <QueryContents content={content as QueryContent}/>
        }

        return (
            <h1>INVALID TILE TYPE</h1>
        )
    }

    render() {
        return (
            <div className="tile" style={
                {
                    height: this.props.tile.rowsHeight * 88, 
                    width: this.props.tile.columnsWidth * 89, 
                    left: this.props.tile.x * 90, 
                    top: this.props.tile.y * 90
                    }}>
                <div className="tile-title">
                    {!!this.props.tile.title && <h3 className="tile-title-text">{this.props.tile.title}</h3>}
                    {!!this.props.tile.subtitle && <div className="tile-title-subtext">{this.props.tile.subtitle}</div>}
                </div>
                <div className="contents">
                    {this.getTileContent()}
                </div>
            </div>
        );
    }
}