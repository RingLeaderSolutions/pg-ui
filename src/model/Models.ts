// Data model
export { Portfolio,
         PortfolioHistoryEntry } from './Portfolio';

export { PortfolioDetails,
         PortfolioContact,
         PortfolioRequirements } from './PortfolioDetails'

export { Account,
         AccountCompanyStatusFlags,
         AccountDetail,
         SiteDetail,
         HierarchySite,
         HierarchyMpan,
         HierarchyMprn,
         AccountDocument } from './HierarchyObjects';
         
export { User } from './User';

export { DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         PortfolioTimelineEntry, 
         DashboardPortfolioStatus, 
         PortfolioStatusEntry } from './Dashboard';

export { Client } from './Client';

export { CompanyInfo } from './CompanyInfo';
export { UploadReport, UploadReportDetail, UploadFileReport, UploadResultItem, UploadReportsResponse, UploadReportBase, ImportReportDetail } from './Uploads';

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
    sumamryElectricityTemplate: string;
    summaryGasTemplate: string;
}