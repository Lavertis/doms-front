import {DrugItem} from "./drugs";

export interface Prescription {
    id: string,
    drugItems: DrugItem[],
    createdAt: Date,
    fulfillmentDeadline: Date
}