import express from "express";

import {AzMonitorService} from "./AzureMonitorService";
import {getFileContents, getSharedQueries, getTileGroups} from "./DashboardService";
import * as dotenv from "dotenv";

dotenv.config({
  path: ".env.local"
});

dotenv.config({
  path: ".env"
});

const app = express()
const port = 8000
const service = new AzMonitorService();

app.get('/', (request, response) => {
  response.send('Hello World!')
})

app.get('/metrics', async(request, response) => {
  var query: {resource: string, metricName: string, metricNamespace: string, interval: string, aggregation: string}
    = request.query as any;

  try {
    var result = await service.getMetrics(query.resource, query.metricName, query.metricNamespace, query.interval, query.aggregation);
    response.send(result);
  } catch (e: any) {
    response.status(500).send(e.message);
  }
})

app.get('/query', async(request, response) => {
  var query: {query: string} = request.query as any;

  try {
    var result = await service.query(query.query);
    response.send(result);
  } catch (e: any) {
    response.status(500).send(e.message);
  }

});

app.get('/dashboard', async(request, response) => {
  try {
    response.send(await getFileContents());
  } catch (e: any) {
    response.status(500).send(e.message);
  }
});

app.get('/shared-queries', async(request, response) => {
  try {
    response.send(await getSharedQueries());
  } catch (e: any) {
    response.status(500).send(e.message);
  }
});

app.get('/tile-groups', async(request, response) => {
  try {
    response.send(await getTileGroups());
  } catch (e: any) {
    response.status(500).send(e.message);
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});