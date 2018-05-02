// Data model
export { Portfolio,
         PortfolioHistoryEntry } from './Portfolio';

export { PortfolioDetails,
         PortfolioContact,
         PortfolioRequirements,
         PortfolioDocument } from './PortfolioDetails'

export { Account,
         AccountCompanyStatusFlags,
         AccountDetail,
         SiteDetail,
         HierarchySite,
         HierarchyMpan,
         HierarchyMprn } from './HierarchyObjects';
         
export { User } from './User';

export { DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         PortfolioTimelineEntry, 
         DashboardPortfolioStatus, 
         PortfolioStatusEntry } from './Dashboard';

export { Client } from './Client';

export { CompanyInfo } from './CompanyInfo';
export { UploadReport, SupplyDataUploadReport, UploadFileReport, UploadResultItem, PortfolioUploadReports, UploadReportBase, QuoteImportUploadReport } from './Uploads';

export enum UtilityType {
    Gas,
    Electricity
}

export interface BackendVersion {
    version: string;
}

// Application data model
export { PortfolioCreationStage } from './app/PortfolioCreationStage';

export interface UploadResponse {
    success: boolean;
    uploadedFiles: string[];
    error: string;
}