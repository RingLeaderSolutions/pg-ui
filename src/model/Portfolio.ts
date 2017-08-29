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

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    status: string;
    avatarUrl: string;
}

export interface Client {
    id: string;
    name: string;
    contact: User;
}