import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';

export interface ModalDialogState {
    shown_dialog: string;
}

const initialDialogState : ModalDialogState = {
    shown_dialog: null
}

const showCloseDialogReducer = (state: ModalDialogState, action: any): ModalDialogState => {
    switch (action.type) {
        case types.OPEN_MODAL_DIALOG:
            return {
                ...state,
                shown_dialog: action.data
            };
        case types.CLOSE_MODAL_DIALOG:
            return {
                ...state,
                shown_dialog: null
            };
        default:
            return state;
    }
}

export const modalDialogReducer =  reduceReducers((state = initialDialogState) => state, showCloseDialogReducer);