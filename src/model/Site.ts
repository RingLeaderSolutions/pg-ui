import { Mpan } from './Mpan';

export interface Site {
    id: string;
    name: string;
    effectiveFrom: string;
    effectiveTo: string;
    mpans: Mpan[];
}