export interface Mpan {
    id: string;
    mpanCore: string;
    currentTopline: MpanDocument;
    currentHistorical: MpanDocument;
    proposedTopline: MpanDocument;
    proposedHistorical: MpanDocument;
}

export interface MpanDocument {
    documentId: string;
    status: string;
    validFrom: string;
}