import { RequestState } from '../RequestState';
import { TendersState } from './tendersReducer';
import { TenderSuppliersState } from './tenderSuppliersReducer';

export interface TenderState {
    tenders: TendersState;
    suppliers: TenderSuppliersState;
    addExistingContract: RequestState;
    delete_tender: RequestState;
    create_hh_electricity_tender: RequestState;
    create_nhh_electricity_tender: RequestState;
    create_gas_tender: RequestState;
    assign_tender_supplier: RequestState;
    unassign_tender_supplier: RequestState;
    update_tender: RequestState;
    generate_pack: RequestState;
    issue_pack: RequestState;
    generate_summary: RequestState;
    issue_summary: RequestState;
    backing_sheets: RequestState;
}