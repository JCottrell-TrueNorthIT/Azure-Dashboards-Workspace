export interface IQueryResponse {
    tables: ITable[];
    status: string;
}

export interface ITable {
    name: string;
    columns: IColumn[];
    rows: (string | number)[][];
    columnDescriptors: IColumn[];
}

export interface IColumn {
    name: string;
    type: string;
}
