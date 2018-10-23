import * as types from '../../actions/actionTypes';
import { reduceReducers } from '../common';

export interface SingleDialogState {
    name: string;
    isOpen: boolean;
    data: any;
}

export interface ModalDialogState {
    dialogs: SingleDialogState[]
}

const initialDialogState : ModalDialogState = {
    dialogs: []
}

const modalActions = [types.OPEN_MODAL_DIALOG, types.CLOSE_MODAL_DIALOG, types.TOGGLE_MODAL_DIALOG];

const dialogReducer = (state: ModalDialogState, action: any): ModalDialogState => {

    let { type, dialog } = action;
    if(modalActions.indexOf(type) < 0) {
        return state;
    }

    if(!dialog || !dialog.name){
        throw new Error("Non-null `dialog` and `dialog.name` must be provided to correctly execute modal actions");
    }

    let dialogs = state.dialogs.slice();
    let dialogExists = dialogs.find(d => d.name == dialog.name) !== null;

    switch (type) {
        case types.OPEN_MODAL_DIALOG:
            if(dialogExists){
                // modify the existing dialog
                var newDialogs = dialogs.map(d => {
                    if(d.name !== dialog.name){
                        return d;
                    }

                    return {
                        ...d,
                        isOpen: true,
                        data: dialog.data
                    };
                })
            }

            // add a new dialog
            dialogs.splice(0, 0, {
                name: dialog.name,
                isOpen: true,
                data: dialog.data
            });

            return {
                ...state,
                dialogs
            };

        case types.CLOSE_MODAL_DIALOG:
            // we cannot close modals that have not been opened at least once
            if(!dialogExists){
                return state;
            }

            // modify the existing dialog
            var newDialogs = dialogs.map(d => {
                if(d.name !== dialog.name){
                    return d;
                }

                return {
                    ...d,
                    isOpen: false
                };
            });

            return {
                ...state,
                dialogs: newDialogs
            };

        case types.TOGGLE_MODAL_DIALOG:
            // in order to toggle, it must already have been "registered"
            if(!dialogExists){
                return state;
            }

            // modify the existing dialog
            var newDialogs = dialogs.map(d => {
                if(d.name !== dialog.name){
                    return d;
                }

                return {
                    ...d,
                    isOpen: !d.isOpen
                };
            });

            return {
                ...state,
                dialogs: newDialogs
            };
        default:
            return state;
    }
}

export const modalDialogReducer = reduceReducers((state = initialDialogState) => state, dialogReducer);