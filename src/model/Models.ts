// Data model
export { Portfolio,
         PortfolioHistoryEntry } from './Portfolio';

export { PortfolioDetails,
         PortfolioContact,
         PortfolioRequirements,
         PortfolioDocument } from './PortfolioDetails'

export { Account,
         AccountCompanyStatusFlags } from './Account';
         
export { User } from './User';

export { DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         PortfolioTimelineEntry, 
         DashboardPortfolioStatus, 
         PortfolioStatusEntry } from './Dashboard';

export { Mpan,
         MpanDocument,
         MpanTopline,
         MpanHistorical } from './Mpan';

export { Site } from './Site';

export { Client } from './Client';

export { CompanyInfo } from './CompanyInfo';

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