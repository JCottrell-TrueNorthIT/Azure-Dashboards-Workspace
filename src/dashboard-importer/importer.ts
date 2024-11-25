import fs from "fs";

import {IDashboard} from "../interfaces/IDashboard";
import {IYamlDashboard} from "../interfaces/IYamlDashboard";
import yaml from "js-yaml";
import { resolve } from "path";
import { convertPartToTile } from "../dashboard-viewer/services/DashboardService";

export {};


function getInputOutputDirs(): [string, string] {
    var args = process.argv.slice(2);

    const inputDir = args[0];
    const outputDir = args[1];
    return [inputDir, outputDir];
}

async function loadJson<T>(file: string): Promise<T> {
    var rawFile = await fs.promises.readFile(file, "utf8"); 
    
    var data = JSON.parse(rawFile) as T;
    return data;
}

async function main() {
    const [inputDir, outputDir] = getInputOutputDirs();
    var data = await loadJson<IDashboard>(inputDir);
    const parts = data.properties.lenses[0].parts.map(part => convertPartToTile(part));

    const dashboard: IYamlDashboard = {
        name: data.name,
        tiles: parts
    }

    const yamlContent = yaml.dump(dashboard);

    await fs.promises.writeFile(resolve(outputDir, `${dashboard.name}.yml`), yamlContent);
}

main();
