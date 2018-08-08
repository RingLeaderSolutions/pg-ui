export interface Tender {
    tenderId?: string;
    tenderTitle: string;
    billingMethod: string;
    portfolioId: string;
    created?: string;
    deadline: string;
    deadlineNotes: string;
    status?: string;
    assignedSuppliers?: TenderSupplier[];
    summaries?: TenderRecommendation[];
    unissuedPacks?: TenderPack[];
    issuances?: TenderIssuance[];
    existingContract?: TenderContract;
    utility: string;
    commission: number;
    allInclusive: boolean;
    halfHourly: boolean;
    acuom?: string;
    annualConsumption?: number;
    requirements: TenderRequirements;
    packStatusMessage?: string;
    meterCount?: number;
    offerTypes: TenderOfferType[]
}

export interface TenderOfferType {
    id: string;
    tenderId: string;
    product: string;
    duration: number;
}

export interface TenderRequirements {
    id: string;
    portfolioId: string;
    tenderId?: string;
    greenPercentage: number;
    paymentTerms: number;
    tariffId: string;
}

export interface TenderIssuance {
    issuanceId: string;
    created: string;
    expiry: string;
    packs: TenderPack[];
    status: string;
    tenderId: string;
}

export interface TenderIssuanceEmail {
    subject: string;
    body: string;
}

export interface TenderQuote {
    appu: number;
    contractBlobId: string;
    expiry: string;
    portfolioId: string;
    quoteId: string;
    received: string;
    sheetCount: number;
    status: string;
    tenderId: string;
    termsheetBlobId: string;
    utility: string;
    supplierId: string;
    totalIncCCL: number;
    collateralList: TenderQuoteCollateral[];
    version: number;
    contractLength: number;
}

export interface TenderQuoteCollateral {
    collateralId: string;
    quoteId: string;
    created: string;
    documentBlobId: string;
}

export interface SupplierRating {
    category: string;
    reason: string;
    score: string;
}

export interface TenderSupplier {
    supplierId: string;
    name: string;
    acctMgrId: string;
    gasSupplier: boolean;
    electricitySupplier: boolean;
    paymentTerms: number;
    logoUri: string;
    serviceRatings: SupplierRating[];
}

export interface TenderPack {
    packId: string;
    tenderId: string;
    supplierId: string;
    created: string;
    lastIssued: string;
    zipFileName: string;
    meterCount: number;
    quotes: TenderQuote[]
}

export interface TenderContract {
    contractId: string;
    supplierId: string;
    accountId: string;
    product: string;
    reference: string;
    utility: string;
    incumbent: boolean;
    uploaded: string;
    status: string;
    sheetCount: number;
    averagePPU?: number;
    totalIncCCL?: number;
}

export interface TenderRecommendation {
    summaryId: string;
    accepted: string;
    communicated: string;
    created: string;
    meterCount: number;
    packId: string;
    summaryFileName: string;
    supplierCount: number;
    supplierId: string;
    tenderId: string;
}

export interface RecommendationSummary {
    tenderTitle: string;
    tenderId: string;
    clientName: string;
    attentionOf: string;
    summaryId: string;
    reportDate: string;
    existingSupplier: string;
    existingtotalIncCCL: number;
    existingAPPU: number;
    offerSummaries: RecommendationOfferSummary[];
}

export interface RecommendationOfferSummary {
    supplierName: string;
    duration: number;
    version: number;
    totalIncCCL: number;
    cclCost: number;
    previousAmountDifference: number;
    previousPercentageDifference: number;
    adriftAmount: number;
    adriftPercentage: number;
    ranking: number;
    appu: number;
    winner: boolean;
}

export interface RecommendationSupplier {
    supplierName: string;
    duration: number;
    version: number;
    winner: boolean;
    incumbentContract: boolean;
    backingsheetTitles: string[];
    backingsheets: string[][];
}

export interface RecommendationSite {
    siteCode: string;
    siteName: string;
    supplierAddress: string;
    billingAddress: string;
    currentContract: RecommendationContract;
    recommendedSiteOffer: RecommendationOfferWinner;
    siteOffersList: RecommendationSiteOffer[];
    recommendedBillingRates: RecommendationBillingRateSummary;
}

export interface RecommendationBillingRateSummary {
    monthlyRates: RecommendationBillingRate[];
    yearlyRates: RecommendationBillingRate[];
}

export interface RecommendationBillingRate {
    title: string;
    amount: number;
    formattedAmount: string;
    total: boolean;
    uom: string;
}

export interface RecommendationContract {
    supplierName: string;
    totalIncCCL: number;
    appu: number;
    ccl: number;
}

export interface RecommendationOfferWinner {
    supplierName: string;
    totalIncCCL: number;
    startDate: string;
    endDate: string;
    percentageChange: number;
    fuelType: string;
    paymentTerms: number;
}

export interface RecommendationSiteOffer {
    supplierName: string;
    duration: number;
    version: number;
    totalIncCCL: number;
    cclCost: number;
    previousAmountDifference: number;
    previousPercentageDifference: number;
    adriftAmount: number;
    adriftPercentage: number;
    ranking: number;
    winner: boolean;
    appu: number;
}

export interface ContractRatesResponse {
    summaryFields: any;
    headers: string[];
    entries: string[][];
}

export interface BackingSheet {
    sheetType: string,
    parentId: string,
    sheetId: string,
    tenderRef: string,
    supplier: string,
    siteCode: string,
    address1: string,
    address2: string,
    town: string,
    postcode: string,
    utility: string,
    product: string,
    contractLength: number,
    billingFrequency: string,
    paymentTerms: number,
    topline: string,
    consumption1: number,
    consumption2: number,
    consumption3: number,
    consumption4: number,
    consumption5: number,
    totalUnits: number,
    rateName1: string,
    rateName2: string,
    rateName3: string,
    rateName4: string,
    rateName5: string,
    rate1: number,
    rate2: number,
    rate3: number,
    rate4: number,
    rate5: number,
    duosRedConsumption: number,
    duosAmberConsumption: number,
    duosGreenConsumption: number,
    duosRedRate: number,
    duosAmberRate: number,
    duosGreenRate: number,
    greenPercentage: number,
    greenPremiumRate: number,
    fixedCharge: number,
    settlementRate: number,
    kVARate: number,
    kVACapacity: number,
    fITRate: number,
    cCLRate: number,
    commission: number,
    vatPercentage: number,
    rate1Cost: number,
    rate2Cost: number,
    rate3Cost: number,
    rate4Cost: number,
    rate5Cost: number,
    duosRedCost: number,
    duosAmberCost: number,
    duosGreenCost: number,
    greenPremiumCost: number,
    fixedChargesCost: number,
    settlementsCost: number,
    kVACosts: number,
    fITCosts: number,
    cCLCosts: number,
    commissionCost: number,
    totalCostIncCCL: number,
    vATCost: number,
    totalCostIncVAT: number,
    mpanCore: string;
    availabilityChargeUOM: string;
    fixedChargeUOM: string;
}

export interface Tariff {
    id: string;
    name: string;
}