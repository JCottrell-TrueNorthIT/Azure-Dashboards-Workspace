import { MetricsListOptionalParams, MonitorClient } from "@azure/arm-monitor";
import { LogsQueryClient } from "@azure/monitor-query"
import { AzureDeveloperCliCredential } from "@azure/identity";

export class AzMonitorService {
    private monitorClient: MonitorClient;
    private logsQueryClient: LogsQueryClient;

    private subscription: string;
    private appiResource: string;

    private daysToQuery: number;

    constructor() {
        this.subscription = process.env.subscription || "ERROR";
        this.appiResource = process.env["application-insights-resource-id"] || "ERROR";
        this.daysToQuery = Number.parseInt(process.env["days-to-query"] ?? "-1");

        console.log("Subscription: " + this.subscription);
        console.log("Application Insights Resource: " + this.appiResource);
        console.log("Days to Query: " + this.daysToQuery);

        const credential = new AzureDeveloperCliCredential();
        this.monitorClient = new MonitorClient(credential, this.subscription);
        this.logsQueryClient = new LogsQueryClient(credential);
    }
    
    async getMetrics(resource: string, metricName: string, metricNamespace: string, interval: string, aggregation: string) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - this.daysToQuery);

        const metrics = await this.monitorClient.metrics.list(resource, {
            metricnames: metricName,
            metricnamespace: metricNamespace,
            interval: interval,
            aggregation: aggregation,
            
            timespan: startDate.toISOString() + "/" + endDate.toISOString()
        } as MetricsListOptionalParams);
        
        return metrics;
    }

    async query(query: string) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - this.daysToQuery);

        const response = await this.logsQueryClient.queryResource(this.appiResource, query, {
            startTime: startDate,
            endTime: endDate
        });
        return response;
    }

}