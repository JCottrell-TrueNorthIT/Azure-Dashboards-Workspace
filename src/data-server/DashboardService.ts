import fs from "fs";

function injectVariablesIntoYaml(yamlContent: string): string {
    var variables = Object.keys(process.env).filter(k => k.startsWith("ENV_")).map(k => ({ name: k, value: process.env[k] }));

    for (const variable of variables) {
      yamlContent = yamlContent.replaceAll(`{{${variable.name}}}`, `${variable.value}`);
    }

    return yamlContent;
}

export async function getFileContents(): Promise<string[]> {
    const dir = process.env["dashboard-path"] ?? ""

    const values = (await fs.promises.readdir(dir)).filter(f => f.endsWith(".yml"));

    var contents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`${dir}/${file}`, "utf8");
        contents.push(fileContent);
    }

    return contents.map(injectVariablesIntoYaml);
}

export async function getSharedQueries(): Promise<string> {
    const dir = process.env["queries-file"] ?? ""
    const queries = await fs.promises.readFile(dir, "utf8");

    return injectVariablesIntoYaml(queries);
}

export async function getTileGroups(): Promise<string> {
    const dir = process.env["tile-groups-file"] ?? ""
    const groups = await fs.promises.readFile(dir, "utf8");

    return injectVariablesIntoYaml(groups);
}