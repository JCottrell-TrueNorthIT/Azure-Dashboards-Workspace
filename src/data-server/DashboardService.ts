import fs from "fs";

export async function getFileContents(): Promise<string[]> {
    const values = (await fs.promises.readdir("./dashboard")).filter(f => f.endsWith(".yml"));

    var contents: string[] = [];

    for (const file of values) {
        const fileContent = await fs.promises.readFile(`./dashboard/${file}`, "utf8");
        contents.push(fileContent);
    }

    return contents
}