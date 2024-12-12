
import { DashboardService } from "../../dashboard-viewer/services/DashboardService";
import { IDashboardContent } from "../IDashboard";
import { ITile } from "../ITile";
import { ITileContent } from "./ITileContent";

type Operator = 'Equals' | 'NotEquals';

interface IYamlMetricFilter {
    attribute: string;
    operator: Operator;
    values: string[];
}

export class MetricsContent implements ITileContent {
    parent?: ITile;
    public readonly type = "metrics";

    public resource!: string;
    public namespace!: string;
    public name!: string;
    public aggregation!: string;
    public filters!: IYamlMetricFilter[];

    copy(tileContent: ITileContent): void {
        this.resource = (tileContent as MetricsContent).resource;
        this.namespace = (tileContent as MetricsContent).namespace;
        this.name = (tileContent as MetricsContent).name;
        this.aggregation = (tileContent as MetricsContent).aggregation;
        this.filters = (tileContent as MetricsContent).filters;
    }

    async exportToPartContent(): Promise<IDashboardContent> {
        var mappings = DashboardService.getDashboardAggregationMappings().map(kvp => { return { key: kvp.value, value: kvp.key } });

        var aggregationType = mappings.find(kvp => kvp.key === this.aggregation)?.value;

        var namespace = this.namespace;
        var name = this.name;

        var isCustomMetric = namespace === "azure.applicationinsights";

        if (isCustomMetric) {
            namespace = "microsoft.insights/components/kusto";
            name =`customMetrics/${name}`
        }

        const dashboardContent: IDashboardContent = {
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
                    title: this.parent?.title ?? "",
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
        if (this.filters?.length && dashboardContent.options) {
            dashboardContent.options.chart.filterCollection = {
                filters: this.filters.map(f => {
                    return {
                        key: f.attribute,
                        operator: this.translateOperatorFromYaml(f.operator),
                        values: f.values
                    }
                })
            }
        }
        return dashboardContent;
    }

    translateOperatorFromYaml(operator?: Operator): number {
        if (operator === 'NotEquals') return 1;
        return 0;
    }

    loadFromPartContent(partContent: IDashboardContent): void {
        var chartData = partContent.options?.chart?.metrics[0] ?? null; 

        if (chartData == null) {
            throw new Error("No metrics found in chart data");
        }

        var resource = chartData.resourceMetadata.id;

        var name = chartData.name;
        var namespace = chartData.namespace;

        var aggregationMappings = DashboardService.getDashboardAggregationMappings();

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