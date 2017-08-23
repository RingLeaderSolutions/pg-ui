export interface Portfolio {
    id: string;
    title: string;
    status: string;
    category: string;
    teamId: number;
    ownerId: number;
    supportOwner: number;
    client: number;
    contractStart: number;
    contractEnd: number;
}

export interface PortfoliosSummary { 
    context: string;
    value: string;
    portfolioCount: number;
    siteCount: number;
    mpanCount: number;
}

export interface PortfoliosTimeline {
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

export interface PortfoliosStatus {
    context: string;
    value: string;

    statusList: PortfolioStatusEntry[];
}

export interface PortfolioStatusEntry {
    status: string;
    count: number;
}