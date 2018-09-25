import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';
import { ContractRenewalStage } from '../../model/app/ContractRenewalStage';
import { ContractRenewalResponse } from '../../model/Tender';

export interface RenewContractState {
    stage: ContractRenewalStage;
    result: ContractRenewalResponse;
    errorMessage: string;
}

const initialState : RenewContractState = {
    stage: ContractRenewalStage.Idle,
    result: null,
    errorMessage: ''
}

const renewContractReducer = (state: RenewContractState, action: any) => {
    switch(action.type){
        case types.CREATE_CONTRACT_RENEWAL_WORKING:
            return {
                stage: ContractRenewalStage.RenewalRequestSent
            };
        case types.CREATE_CONTRACT_RENEWAL_SUCCESSFUL:
            return {
                stage: ContractRenewalStage.WaitingForCompletion
            };
        case types.CREATE_CONTRACT_RENEWAL_FAILED:
            return {
                stage: ContractRenewalStage.RenewalFailed,
                errorMessage: action.errorMessage
            };
        case types.CREATE_CONTRACT_RENEWAL_WAIT_COMPLETED:
            return {
                stage: ContractRenewalStage.Complete,
                result: action.data
            };
        case types.CREATE_CONTRACT_RENEWAL_CLEAR:
            return initialState;
        default:
            return state;
    }
}

export default reduceReducers((state = initialState) => state, renewContractReducer);