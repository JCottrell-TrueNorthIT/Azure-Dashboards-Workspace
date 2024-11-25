import fs from "fs";

export async function getFileContents(): Promise<string[]> {
    const values = (await fs.promises.readdir("./dashboard/dashboards")).filter(f => f.endsWith(".yml"));

    var contents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`./dashboard/dashboards/${file}`, "utf8");
        contents.push(fileContent);
    }

    return contents
}

export async function getSharedQueries(): Promise<string> {
    return await fs.promises.readFile("./dashboard/shared-queries.yml", "utf8");
}