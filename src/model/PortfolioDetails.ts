export interface PortfolioContact {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    phoneNumber: string;
    accountId: string;
    portfolioId: string;
}

export interface PortfolioSummary {
    id: string;
    title: string;
    status: string;
    category: string;
    teamId: number;
    ownerId: number;
    supportOwner: number;
    accountId: string;
    contact: PortfolioContact;
    contractStart: string;
    contractEnd: string;
}

export interface PortfolioRequirements {
    id?: string;
    portfolioId: string;
    product: string;
    paymentTerms: number;
    startDate: string;
    durationMonths: number;
    stodId: string;
    gasRequired: boolean;
    electricityRequired: boolean;
    greenPercentage: number;
}

export interface PortfolioDocument {
    id: string;
    blobFileName: string;
    accountId: string;
    documentType: string;
    received: string;
    expiry: string;
}

export interface MeterGroup {
    groupName: string,
    meterCount: number,
    supplyDataCount: number,
    historicalCount: number,
    forecastCount: number
}

export interface PortfolioDetails {
    portfolio: PortfolioSummary;
    meterGroups: MeterGroup[];
    requirements?: PortfolioRequirements;
    documentation?: PortfolioDocument[];
    siteCount: number;
}