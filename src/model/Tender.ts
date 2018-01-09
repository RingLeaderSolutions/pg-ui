export interface Tender {
    tenderId: string;
    portfolioId: string;
    created: string;
    deadline: string;
    deadlineNotes: string;
    status: string;
    quotes: TenderQuote[];
    assignedSuppliers: TenderSupplier[];
    packs: TenderPack[];
    existingContract: TenderContract;
    utility: string;
}

export interface TenderQuote {

}

export interface TenderSupplier {
    supplierId: string;
    name: string;
    acctMgrId: string;
    gasSupplier: boolean;
    electricitySupplier: boolean;
    paymentTerms: number;
    logoUri: string;
}

export interface TenderPack {
    packId: string;
    tenderId: string;
    supplierId: string;
    created: string;
    lastIssued: string;
    zipFileName: string;
    meterCount: number;
}

export interface TenderContract {
    contractId: string;
    supplierId: string;
    accountId: string;
    contractStart: string;
    contractEnd: string;
    product: string;
    reference: string;
    utility: string;
    incumbent: boolean;
    uploaded: string;
    status: string;
}