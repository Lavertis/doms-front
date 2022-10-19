import {FilterMatchMode} from "primereact/api";

export interface LazyParams {
    first: number,
    rows: number,
    page: number,
    filters: { [key: string]: { value: any, matchMode: FilterMatchMode } }
}