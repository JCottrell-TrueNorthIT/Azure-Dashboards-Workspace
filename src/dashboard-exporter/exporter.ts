import { resolve } from "path";
import { DashboardService } from "../dashboard-viewer/services/DashboardService";
import fs from "fs";
import { IYamlDashboard } from "../interfaces/IYamlDashboard";
import yaml from "js-yaml";
import { ISharedQueries } from "../interfaces/ISharedQueries";
import * as dotenv from "dotenv";
import { ITileGroups } from "../interfaces/ITileGroup";

export { };

dotenv.config({
    path: ".env"
});

async function getSharedQueries(): Promise<ISharedQueries> {
    const dir = process.env["queries-file"] ?? ""
    const yamlData = await fs.promises.readFile(dir, "utf8");
    return yaml.load(yamlData) as ISharedQueries;
}

async function getTileGroups(): Promise<ITileGroups> {
    const dir = process.env["tile-groups-file"] ?? ""
    const yamlData = await fs.promises.readFile(dir, "utf8");
    return yaml.load(yamlData) as ITileGroups;
}

async function getDashboards(): Promise<IYamlDashboard[]> {
    const dir = process.env["dashboard-path"] ?? ""

    const values = (await fs.promises.readdir(dir)).filter(f => f.endsWith(".yml"));

    var fileContents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`${dir}/${file}`, "utf8");
        fileContents.push(fileContent);
    }

    return await Promise.all(fileContents.map(DashboardService.loadDashboardFromYaml));
}

async function processYamlDashboard(yamlDashboard: IYamlDashboard) {
    const dashboard = await DashboardService.createDashboardFromYaml(yamlDashboard);
    const jsonContent = JSON.stringify(dashboard, null, 2);

    await fs.promises.writeFile(resolve("./build", `${dashboard.name}.json`), jsonContent);
}

function ensureOutFolderExists() {
    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build");
    }
}

async function main() {
    DashboardService.getSharedQueries = getSharedQueries;
    DashboardService.getTileGroups = getTileGroups;
    DashboardService.getAllDashboards = getDashboards;

    ensureOutFolderExists();

    const yamlDashboards = getDashboards();

    for (const yamlDashboard of await yamlDashboards) {
        await processYamlDashboard(yamlDashboard);
    }
}

main();