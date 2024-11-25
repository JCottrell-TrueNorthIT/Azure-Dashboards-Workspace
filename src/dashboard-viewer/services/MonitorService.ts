import { MetricsContent } from "../../interfaces/content/MetricsContent";
import { QueryContent } from "../../interfaces/content/QueryContent";
import { IQueryResponse } from "../../interfaces/IQueryResponse";
import { ITimeSeriesDataPoint } from "../../interfaces/Shared";
import { DashboardService } from "./DashboardService";

export async function getMetricData(metrics: MetricsContent): Promise<ITimeSeriesDataPoint[]> {
    var queryString = encodeURI("?resource=" + metrics.resource
        + "&metricName=" + metrics.name
        + "&metricNamespace=" + metrics.namespace)
        + "&interval=PT15M"
        + "&aggregation=" + metrics.aggregation;

    var response = await fetch(`/metrics${queryString}`, {method: "GET"});
    
    var data: {timeStamp:string, total?:number }[] = (await response.json())?.value[0]?.timeseries[0]?.data;

    if (!data) {
        console.error("No data returned from query: " + queryString);
    }

    const returnData:ITimeSeriesDataPoint[] = data.map((d) => {
        return {
        x: new Date(d.timeStamp).getTime(),
        y: d.total ?? 0,
        xLabel: d.timeStamp
        }
    });


    return returnData;
}

export async function getQueryString(query: QueryContent): Promise<string> {
    if (query.queryType === "inline") return query.query;

    var sharedQueries = await DashboardService.getSharedQueries();

    var queryString = sharedQueries.queries.find(q => q.name === query.query)?.query;

    if (!queryString) throw new Error("Shared Query not found: " + query.query);
    
    for (const variable of query.variables ?? []) {
        queryString = queryString.replace(`<${variable.name}>`, variable.value);
    }

    return queryString;
}

export async function query(query: QueryContent): Promise<IQueryResponse> {
    var queryString = encodeURIComponent(await getQueryString(query));
    var response = await fetch(`/query?query=${queryString}`, {method: "GET"});

    var data = await response.json();

    if (!data) {
        console.error("No data returned from query: " + query);
    }

    return data;
}