import { resolve } from "path";
import { loadDashboardFromYaml, createDashboardFromYaml } from "../dashboard-viewer/services/DashboardService";
import fs from "fs";
import { IYamlDashboard } from "../interfaces/IYamlDashboard";

export { };

async function getDashboards(): Promise<IYamlDashboard[]> {
    const values = (await fs.promises.readdir("./dashboard")).filter(f => f.endsWith(".yml"));
    console.log(values);

    var yamlDashboards: IYamlDashboard[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`./dashboard/${file}`, "utf8");
        const dashboard = loadDashboardFromYaml(fileContent);

        yamlDashboards.push(dashboard);
    }

    return yamlDashboards;
}

async function processYamlDashboard(yamlDashboard: IYamlDashboard) {
    const dashboard = createDashboardFromYaml(yamlDashboard);
    const jsonContent = JSON.stringify(dashboard, null, 2);

    await fs.promises.writeFile(resolve("./build", `${dashboard.name}.json`), jsonContent);
}

function ensureOutFolderExists() {
    if (!fs.existsSync("./build")) {
        fs.mkdirSync("./build");
    }
}

async function main() {
    ensureOutFolderExists();

    const yamlDashboards = getDashboards();

    for (const yamlDashboard of await yamlDashboards) {
        await processYamlDashboard(yamlDashboard);
    }
}

main();