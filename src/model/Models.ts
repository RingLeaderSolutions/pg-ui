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