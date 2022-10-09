export interface Drug {
    rxcui?: number;
    name: string;
    alternative_name: string;
    quantity: number;
    dosage: string;
}

export interface DrugItem {
    id: string,
    rxcui: number;
    name: string,
    quantity: number,
    dosage: string
}

export interface ConceptProperty {
    rxcui: string;
    name: string;
    synonym: string;
    tty: string;
    language: string;
    suppress: string;
    umlscui: string;
}

export interface ConceptGroup {
    tty: string;
    conceptProperties: ConceptProperty[];
}

export interface DrugGroup {
    name?: string;
    conceptGroup: ConceptGroup[];
}

export interface DrugApiResult {
    drugGroup: DrugGroup;
}