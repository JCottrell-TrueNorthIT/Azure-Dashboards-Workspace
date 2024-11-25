import yaml from "js-yaml";
import { IYamlDashboard } from "../../interfaces/IYamlDashboard";
import { ITileContent } from "../../interfaces/content/ITileContent";
import { MarkdownContent } from "../../interfaces/content/MarkdownContent";
import { MetricsContent } from "../../interfaces/content/MetricsContent";
import { QueryContent } from "../../interfaces/content/QueryContent";
import { IDashboard, IDashboardInput, IDashboardPart, IDashboardPosition } from "../../interfaces/IDashboard";
import { ITile } from "../../interfaces/ITile";
import { ISharedQueries } from "../../interfaces/ISharedQueries";
import { IDashboardService } from "../../interfaces/IDashboardService";

export class DashboardServiceClass implements IDashboardService {
  constructor() {
    this.getDashboard = this.getDashboard.bind(this);
    this.getSharedQueries = this.getSharedQueries.bind(this);
    this.loadDashboardFromYaml = this.loadDashboardFromYaml.bind(this);
    this.initTileContent = this.initTileContent.bind(this);
    this.createEmptyTileContent = this.createEmptyTileContent.bind(this);
    this.convertTileToPart = this.convertTileToPart.bind(this);
    this.convertPartToTile = this.convertPartToTile.bind(this);
    this.createDashboardFromYaml = this.createDashboardFromYaml.bind(this);
    this.createEmptyDashboard = this.createEmptyDashboard.bind(this);
  }

  async getDashboard(): Promise<IYamlDashboard> {
    const response = await (await fetch("/dashboard", { method: "GET" })).json() as string[];
    const dashboard = response.map(this.loadDashboardFromYaml) as IYamlDashboard[];
    return dashboard[1];
  }

  async getSharedQueries(): Promise<ISharedQueries> {
    const response = await (await fetch("/shared-queries", { method: "GET" })).text();
    return yaml.load(response) as ISharedQueries;
  }

  initTileContent(content: ITileContent): ITileContent {
    const newTileContent = this.createEmptyTileContent(content.type);
    newTileContent.copy(content);
    return newTileContent;
  }

  loadDashboardFromYaml(yamlString: string): IYamlDashboard {
    const yamlContent = yaml.load(yamlString) as IYamlDashboard;

    yamlContent.tiles.forEach(t => t.content = this.initTileContent(t.content));
    return yamlContent;
  }

  createEmptyTileContent(type: string): ITileContent {
    switch (type) {
      case "markdown":
        return new MarkdownContent();
      case "metrics":
        return new MetricsContent();
      case "query":
        return new QueryContent();
    }
    return { type: "ERROR" } as ITileContent;
  }

  getTileTypeMappings(): { key: string, value: string }[] {
    return [
      { key: "Extension/HubsExtension/PartType/MarkdownPart", value: "markdown" },
      { key: "Extension/HubsExtension/PartType/MonitorChartPart", value: "metrics" },
      { key: "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart", value: "query" }
    ];
  }

  getDashboardAggregationMappings(): { key: number, value: string }[] {
    return [
      { key: 1, value: "Total" },
      { key: 2, value: "Average" },
      { key: 3, value: "Minimum" },
      { key: 4, value: "Maximum" },
      { key: 5, value: "Count" },
    ];
  }

  async convertTileToPart(tile: ITile): Promise<IDashboardPart> {
    const position: IDashboardPosition = {
      x: tile.x,
      y: tile.y,
      colSpan: tile.columnsWidth,
      rowSpan: tile.rowsHeight
    };

    const partContent = await tile.content.exportToPartContent();
    let contentInputs: IDashboardInput[] = [];

    if (tile.content.getDashboardInputs) {
      contentInputs = await tile.content.getDashboardInputs();
    }

    const partType = this.getTileTypeMappings().find(kvp => kvp.value === tile.content.type)?.key ?? "";

    return {
      position: position,
      metadata: {
        inputs: contentInputs,
        type: partType,
        settings: {
          content: partContent
        }
      }
    };
  }

  convertPartToTile(part: IDashboardPart): ITile {
    const position = part.position;
    const partContent = part.metadata.settings.content;
    const contentType = this.getTileTypeMappings().find(kvp => kvp.key === part.metadata.type)?.value ?? "";
    const content = this.createEmptyTileContent(contentType);
    content.loadFromPartContent(partContent);

    if (content.loadInputsFromPart) content.loadInputsFromPart(part);

    let title = partContent.title || partContent.PartTitle || part.metadata.partHeader?.title;
    let subtitle = partContent.subtitle || partContent.PartSubTitle || part.metadata.partHeader?.subtitle;

    return {
      title: title,
      subtitle: subtitle,
      x: position.x,
      y: position.y,
      columnsWidth: position.colSpan,
      rowsHeight: position.rowSpan,
      content: content
    };
  }

  async createDashboardFromYaml(yamlDashboard: IYamlDashboard): Promise<IDashboard> {
    const emptyDashboard = this.createEmptyDashboard();
    emptyDashboard.name = yamlDashboard.name;

    if (!emptyDashboard.properties?.lenses?.length) throw new Error("Empty dashboard not properly initialized");

    emptyDashboard.properties.lenses[0].parts = await Promise.all(yamlDashboard.tiles.map(async(t) => await this.convertTileToPart(t)));

    return emptyDashboard as IDashboard;
  }

  createEmptyDashboard(): Partial<IDashboard> {
    return {
      properties: {
        lenses: [
          {
            order: 0,
            parts: []
          }
        ],
        metadata: {
          model: {
            timeRange: {
              value: {
                relative: {
                  duration: 24,
                  timeUnit: 1
                }
              },
              type: "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange"
            },
            filterLocale: {
              value: "en-US"
            },
            filters: {
              value: {
                MsPortalFx_TimeRange: {
                  model: {
                    format: "utc",
                    granularity: "auto",
                    relative: "24h"
                  },
                  displayCache: {
                    name: "UTC Time",
                    value: "Past 24 hours"
                  },
                  filteredPartIds: []
                }
              }
            }
          }
        }
      },
      type: "Microsoft.Portal/dashboards",
      location: "INSERT LOCATION",
      apiVersion: "2015-08-01-preview"
    };
  }
}

export var DashboardService = new DashboardServiceClass();