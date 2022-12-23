export interface PagedResponse<TResource> {
    pageNumber: number;
    pageSize: number;
    totalRecords: number;
    records: TResource[];
}