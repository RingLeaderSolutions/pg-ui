// Data model
export * from './Portfolio';
export * from './PortfolioDetails'
export * from './HierarchyObjects';
export * from './User';
export * from './Dashboard';
export * from './Client';
export * from './CompanyInfo';
export * from './Uploads';

export enum UtilityType {
    Gas,
    Electricity
}

export function decodeUtilityType(utility: UtilityType): string {
    switch(utility){
        case UtilityType.Electricity:
            return "Electricity";
        case UtilityType.Gas:
            return "Gas";
        default:
            return "Unknown";
    }
}

export interface BackendVersion {
    version: string;
}

export interface ExportResponse {
    exportUri: string;
}

export interface UploadResponse {
    success: boolean;
    uploadedFiles: string[];
    error: string;
}

export interface InstanceDetail {
    address: string;
    buildType: string;
    consul: string;
    contactus: string;
    email: string;
    logoUri: string;
    mongodb: string;
    name: string;
    summaryElectricityTemplate: string;
    summaryGasTemplate: string;
}

export enum ApplicationTab {
    Dashboard,
    Portfolios,
    Accounts
}