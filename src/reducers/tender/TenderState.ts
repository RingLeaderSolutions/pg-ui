import { RequestState } from '../RequestState';
import { TendersState } from './tendersReducer';
import { TenderSuppliersState } from './tenderSuppliersReducer';

export interface TenderState {
    tenders: TendersState;
    suppliers: TenderSuppliersState;
    addExistingContract: RequestState;
}