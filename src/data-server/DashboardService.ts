import * as FileService from "../shared-services/FileService";

export async function getFileContents(): Promise<string[]> {
    const contents = await FileService.getDashboards();
    return contents.map(FileService.injectVariablesIntoYaml);
}

export async function getSharedQueries(): Promise<string> {
    const queries = await FileService.getSharedQueries();
    return FileService.injectVariablesIntoYaml(queries);
}

export async function getTileGroups(): Promise<string> {
    const tileGroups = await FileService.getTileGroups();
    return FileService.injectVariablesIntoYaml(tileGroups);
}
