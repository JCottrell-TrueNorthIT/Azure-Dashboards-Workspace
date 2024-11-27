import yaml from "js-yaml";
import { IYamlDashboard } from "../../interfaces/IYamlDashboard";
import { ITileContent } from "../../interfaces/content/ITileContent";
import { MarkdownContent } from "../../interfaces/content/MarkdownContent";
import { MetricsContent } from "../../interfaces/content/MetricsContent";
import { QueryContent } from "../../interfaces/content/QueryContent";
import { IDashboard, IDashboardInput, IDashboardPart, IDashboardPosition } from "../../interfaces/IDashboard";
import { ITile } from "../../interfaces/ITile";

export async function getDashboards(): Promise<IYamlDashboard[]> {
  const response = await (await fetch("/dashboard", { method: "GET" })).json() as string[];
  const dashboards = response.map(loadDashboardFromYaml) as IYamlDashboard[];
  return dashboards;
}

export function loadDashboardFromYaml(yamlString: string): IYamlDashboard {
  const yamlContent = yaml.load(yamlString) as IYamlDashboard;

  yamlContent.tiles.forEach(t => t.content = initTileContent(t.content));
  const dashboardEnvNames = Object.keys(process.env)
            .filter(key => key.startsWith("REACT_APP_URI")); 

  for (const tile of yamlContent.tiles) {
    if (tile.content.type == "markdown") {
      const markdownContent = tile.content as MarkdownContent;
      for (const dashboardEnvName of dashboardEnvNames) {
        markdownContent.markdown = markdownContent.markdown.replaceAll(`{{${dashboardEnvName}}}`, process.env[dashboardEnvName] || "");
      }
    }
  }

  return yamlContent;
}

export function initTileContent(content: ITileContent): ITileContent {
  const newTileContent = createEmptyTileContent(content.type);

  newTileContent.copy(content);

  return newTileContent;
}

export function createEmptyTileContent(type: string): ITileContent {
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

export function getTileTypeMappings(): { key: string, value: string }[] {
  return [
    { key: "Extension/HubsExtension/PartType/MarkdownPart", value: "markdown" },
    { key: "Extension/HubsExtension/PartType/MonitorChartPart", value: "metrics" },
    { key: "Extension/Microsoft_OperationsManagementSuite_Workspace/PartType/LogsDashboardPart", value: "query" }
  ]
}

export function getDashboardAggregationMappings(): { key: number, value: string }[] {
  return [
    { key: 1, value: "Total" },
    { key: 2, value: "Average" },
    { key: 3, value: "Minimum" },
    { key: 4, value: "Maximum" },
    { key: 5, value: "Count" },
  ]
}

export function convertTileToPart(tile: ITile): IDashboardPart {
  const position: IDashboardPosition = {
    x: tile.x,
    y: tile.y,
    colSpan: tile.columnsWidth,
    rowSpan: tile.rowsHeight
  }

  const partContent = tile.content.exportToPartContent();
  var contentInputs: IDashboardInput[] = [];

  if (tile.content.getDashboardInputs) {
    contentInputs = tile.content.getDashboardInputs();
  }

  const partType = getTileTypeMappings().find(kvp => kvp.value === tile.content.type)?.key ?? "";

  return {
    position: position,
    metadata: {
      inputs: contentInputs,
      type: partType,
      settings: {
        content: partContent
      }
    }
  }
}

export function convertPartToTile(part: IDashboardPart): ITile {
  const position = part.position;

  const partContent = part.metadata.settings.content;

  const contentType = getTileTypeMappings().find(kvp => kvp.key === part.metadata.type)?.value ?? "";

  const content = createEmptyTileContent(contentType);
  content.loadFromPartContent(partContent);

  if (content.loadInputsFromPart) content.loadInputsFromPart(part);

  var title = partContent.title;

  if (!title) {
    title = partContent.PartTitle;

    if (!title) {
      title = part.metadata.partHeader?.title;
    }
  }

  var subtitle = partContent.subtitle;

  if (!subtitle) {
    subtitle = partContent.PartSubTitle;

    if (!subtitle) {
      subtitle = part.metadata.partHeader?.subtitle;
    }
  }

  return {
    title: title,
    subtitle: subtitle,
    x: position.x,
    y: position.y,
    columnsWidth: position.colSpan,
    rowsHeight: position.rowSpan,
    content: content
  }
}

export function createDashboardFromYaml(yamlDashboard: IYamlDashboard): IDashboard {
  const emptyDashboard = createEmptyDashboard();

  emptyDashboard.name = yamlDashboard.name;

  if (!emptyDashboard.properties?.lenses?.length) throw new Error("Empty dashboard not properly initialized");

  emptyDashboard.properties.lenses[0].parts = yamlDashboard.tiles.map(t => convertTileToPart(t));

  return emptyDashboard as IDashboard;
}

export function createEmptyDashboard(): Partial<IDashboard> {
  return {
    properties: {
      lenses: [
        {
          "order": 0,
          "parts": []
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
