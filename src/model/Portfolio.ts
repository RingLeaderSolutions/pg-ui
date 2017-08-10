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