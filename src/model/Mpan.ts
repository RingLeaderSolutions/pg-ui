import { User } from './User';

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

export interface MpanTopline {
    _id: string;
    connection: string;
    cot: boolean;
    da: string;
    dc: string;
    duosFixed: boolean;
    eac: string;
    energisation: string;
    gspGroup: string;
    llf: string;
    measurementClass: string;
    meterType: string;
    mo: string;
    mpanCore: string;
    mtc: string;
    newConnection: boolean;
    profileClass: string;
    retrievalMethod: string;
    ssc: string;
    voltage: string;

    group: string;
    created: string;
    creator: User;
}

export interface MpanHistorical {
    mpanCore: string;
    type: string;
    source: string;
    clock: string;
    creator: User;
    created: string
    group: string;
    entries: MpanHistoricalEntry[];
}

export interface MpanHistoricalEntry {
    data: number[];
    date: string;
}