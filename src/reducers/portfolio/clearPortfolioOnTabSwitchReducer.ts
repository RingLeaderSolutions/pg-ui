import { PortfolioState } from "./PortfolioState";
import * as types from '../../actions/actionTypes';
import { initialRequestState, idleInitialRequestState } from '../RequestState';

export const clearPortfolioOnTabSwitchReducer = (state: PortfolioState, action: any): PortfolioState => {
    switch (action.type) {
        case types.SELECT_APPLICATION_TAB:
            return {
                account: initialRequestState,
                details: initialRequestState,
                history: initialRequestState,
                selected: initialRequestState,
                tender: {
                    tenders: initialRequestState,
                    suppliers: initialRequestState,
                    addExistingContract: idleInitialRequestState,
                    delete_tender: idleInitialRequestState,
                    create_tender: idleInitialRequestState,
                    update_tender_suppliers: idleInitialRequestState,
                    update_tender: idleInitialRequestState,
                    generate_pack: idleInitialRequestState,
                    issue_pack: idleInitialRequestState,
                    generate_summary: idleInitialRequestState,
                    issue_summary: idleInitialRequestState,
                    backing_sheets: initialRequestState,
                    issuance_email: idleInitialRequestState,
                    tariffs: idleInitialRequestState,
                    delete_quote: idleInitialRequestState
                },
                uploads: initialRequestState
            };
        default:
            return state;
    }
}