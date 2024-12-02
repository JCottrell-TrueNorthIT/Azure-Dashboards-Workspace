import fs from "fs";
import {glob} from "glob";

export async function getSharedQueries(): Promise<string> {
    const dir = process.env["queries-file"] ?? ""
    const yamlData = await fs.promises.readFile(dir, "utf8");
    return yamlData;
}

export async function getTileGroups(): Promise<string> {
    const dir = process.env["tile-groups-file"] ?? ""
    const yamlData = await fs.promises.readFile(dir, "utf8");
    return yamlData;
}

export async function getDashboards(): Promise<string[]> {
    const dir = process.env["dashboard-path"] ?? ""

    const values = await glob(`${dir}/**/*.yml`);

    var fileContents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(file, "utf8");
        fileContents.push(fileContent);
    }

    return fileContents;
}

export function injectVariablesIntoYaml(yamlContent: string): string {
    var variables = Object.keys(process.env).filter(k => k.startsWith("ENV_")).map(k => ({ name: k, value: process.env[k] }));

    for (const variable of variables) {
      yamlContent = yamlContent.replaceAll(`{{${variable.name}}}`, `${variable.value}`);
    }

    return yamlContent;
}