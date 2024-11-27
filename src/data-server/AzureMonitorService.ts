import { MetricsListOptionalParams, MetricsListResponse, MonitorClient } from "@azure/arm-monitor";
import { LogsQueryClient, LogsQueryResult } from "@azure/monitor-query"
import { AzureDeveloperCliCredential } from "@azure/identity";
import { Cache } from "./Cache";

export class AzMonitorService {
    private monitorClient: MonitorClient;
    private logsQueryClient: LogsQueryClient;

    private subscription: string;
    private appiResource: string;

    private daysToQuery: number;

    private metricCache: Cache<MetricsListResponse>;
    private queryCache: Cache<LogsQueryResult>;

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

        this.metricCache = new Cache<MetricsListResponse>();
        this.queryCache = new Cache<LogsQueryResult>();
    }
    
    async getMetrics(
        resource: string, 
        metricName: string, 
        metricNamespace: string, 
        interval: string, 
        aggregation: string): Promise<MetricsListResponse> {
        
        const cacheKey = `${resource};${metricName};${metricNamespace}${interval}${aggregation}`
        const cache = this.metricCache.get(cacheKey);

        if (cache) return cache;

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
        
        this.metricCache.set(cacheKey, metrics);

        return metrics;
    }

    async query(query: string): Promise<LogsQueryResult> {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - this.daysToQuery);

        const cache = this.queryCache.get(query);

        if (cache) return cache;

        const response = await this.logsQueryClient.queryResource(this.appiResource, query, {
            startTime: startDate,
            endTime: endDate
        });

        this.queryCache.set(query, response);

        return response;
    }

}