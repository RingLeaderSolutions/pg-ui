import { User } from './User';

export interface Portfolio {
    id: string;
    title: string;
    status: string;
    contractStart: string;
    contractEnd: string;
    accounts: number;
    sites: number;
    mpans: number;
    category: string;
    client: Client;
    creditRating: string;
    approvalStatus: string;
    salesLead: User;
    supportExec: User;
}

export interface PortfolioCreationRequest { 
    id?: string;
    title: string;
    category: string;
    teamId: number;
    ownerId: number;
    supportOwner: number;
    accountId: string;
}

export interface Client {
    id: string;
    name: string;
    contact: User;
}

export interface  PortfolioHistoryEntry {
    id: string;
    parent: string;
    category: string;
    entityType: string;
    entityId: string;
    description: string;
    actionRequired: boolean;
    owner: number;
    documentId: string;
    documentType: string;
    created: number;
    children: PortfolioHistoryEntry[];
}