import fs from "fs";

export async function getFileContents(): Promise<string[]> {
    const dir = process.env["dashboard-path"] ?? ""

    const values = (await fs.promises.readdir(dir)).filter(f => f.endsWith(".yml"));

    var contents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`${dir}/${file}`, "utf8");
        contents.push(fileContent);
    }

    return contents
}

export async function getSharedQueries(): Promise<string> {
    const dir = process.env["queries-file"] ?? ""
    return await fs.promises.readFile(dir, "utf8");
}

export async function getTileGroups(): Promise<string> {
    const dir = process.env["tile-groups-file"] ?? ""
    return await fs.promises.readFile(dir, "utf8");
}