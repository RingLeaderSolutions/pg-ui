export interface DashboardPortfolioSummary { 
    context: string;
    value: string;
    portfolioCount: number;
    siteCount: number;
    mpanCount: number;
}

export interface DashboardPortfolioTimeline {
    context: string;
    value: string;

    timelineList: PortfolioTimelineEntry[];
}

export interface PortfolioTimelineEntry {
    id: string;
    contractStart: string;
    contractEnd: string;
    title: string;
    workload: number;
    totalMpans: number;
}

export interface DashboardPortfolioStatus {
    context: string;
    value: string;

    statusList: PortfolioStatusEntry[];
}

export interface PortfolioStatusEntry {
    status: string;
    count: number;
}