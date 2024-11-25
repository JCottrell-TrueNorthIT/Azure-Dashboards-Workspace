
import { getDashboardAggregationMappings } from "../../dashboard-viewer/services/DashboardService";
import { IDashboardContent } from "../IDashboard";
import { ITileContent } from "./ITileContent";

export class MetricsContent implements ITileContent {
    public readonly type = "metrics";

    public resource!: string;
    public namespace!: string;
    public name!: string;
    public aggregation!: string;

    copy(tileContent: ITileContent): void {
        this.resource = (tileContent as MetricsContent).resource;
        this.namespace = (tileContent as MetricsContent).namespace;
        this.name = (tileContent as MetricsContent).name;
        this.aggregation = (tileContent as MetricsContent).aggregation;
    }

    exportToPartContent(): IDashboardContent {
        var mappings = getDashboardAggregationMappings().map(kvp => { return { key: kvp.value, value: kvp.key } });

        var aggregationType = mappings.find(kvp => kvp.key === this.aggregation)?.value;

        var namespace = this.namespace;
        var name = this.name;

        var isCustomMetric = namespace === "azure.applicationinsights";

        if (isCustomMetric) {
            namespace = "microsoft.insights/components/kusto";
            name =`customMetrics/${name}`
        }

        return {
            options: {
                chart: {
                    metrics: [
                        {
                            resourceMetadata: {
                                id: this.resource
                            },
                            namespace: namespace,
                            name: name,
                            aggregationType: aggregationType ?? 1
                        }
                    ],
                    title: "",
                    titleKind: 0,
                    visualization: {
                        chartType: 2,
                        legendVisualization: {
                          isVisible: false,
                          position: 2,
                          hideHoverCard: false,
                          hideLabelNames: true
                        },
                        axisVisualization: {
                          x: {
                            isVisible: true,
                            axisType: 2
                          },
                          y: {
                            isVisible: true,
                            axisType: 1
                          }
                        },
                        disablePinning: true
                      }
                }
            }
        }
    }

    loadFromPartContent(partContent: IDashboardContent): void {
        var chartData = partContent.options?.chart?.metrics[0] ?? null; 

        if (chartData == null) {
            throw new Error("No metrics found in chart data");
        }

        var resource = chartData.resourceMetadata.id;

        var name = chartData.name;
        var namespace = chartData.namespace;

        var aggregationMappings = getDashboardAggregationMappings();

        var aggregation = aggregationMappings.find(kvp => kvp.key === chartData?.aggregationType)?.value;

        var isCustomMetric = namespace === "microsoft.insights/components/kusto"

        if (isCustomMetric) {
            namespace = "azure.applicationinsights";
            name = name.replace("customMetrics/", "");
        }
        
        this.resource = resource;
        this.namespace = namespace;
        this.name = name;
        this.aggregation = aggregation ?? "";
    }
}