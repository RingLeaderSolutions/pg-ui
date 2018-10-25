import { User } from './User';

export interface Client {
    id: string;
    name: string;
    contact: User;
}