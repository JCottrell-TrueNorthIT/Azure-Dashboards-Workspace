import React from "react";
import { IYamlDashboard } from "../../interfaces/IYamlDashboard";
import "./dashboard.css";
import { ITile } from "../../interfaces/ITile";
import { Tile } from "../tiles/base/Tile";

export class Dashboard extends React.Component<{ dashboard: IYamlDashboard }> {
    render() {
        return (
            <>
                {
                    this.props.dashboard.tiles.map((tile: ITile) => (
                            <Tile tile={tile} />
                        ))
                }
            </>
        );
    }
}