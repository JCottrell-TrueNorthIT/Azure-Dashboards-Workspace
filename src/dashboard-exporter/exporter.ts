import { resolve } from "path";
import { DashboardService } from "../dashboard-viewer/services/DashboardService";
import fs from "fs";
import { IYamlDashboard } from "../interfaces/IYamlDashboard";
import dotenv from "dotenv";
import * as FileService from "../shared-services/FileService";

import yaml from "js-yaml";
import { ISharedQueries } from "../interfaces/ISharedQueries";
import { ITileGroups } from "../interfaces/ITileGroup";

export { };

dotenv.config({
    path: ".env"
});

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
    DashboardService.getSharedQueries = async() => yaml.load(await FileService.getSharedQueries()) as ISharedQueries;
    DashboardService.getTileGroups = async() => yaml.load(await FileService.getTileGroups()) as ITileGroups;
    DashboardService.getDashboards = async() => await Promise.all((await FileService.getDashboards())
            .map(DashboardService.loadDashboardFromYaml));

    ensureOutFolderExists();

    const yamlDashboards = await DashboardService.getDashboards();

    for (const yamlDashboard of yamlDashboards) {
        await processYamlDashboard(yamlDashboard);
    }
}

main();