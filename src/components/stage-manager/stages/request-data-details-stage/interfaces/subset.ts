export interface SubsetColumn {
    old_name: string;
    new_name?: string;
}

export interface ISubset {
    headers: SubsetColumn[];
    file_name: string;
    values: { [key: string]: any }[];
}