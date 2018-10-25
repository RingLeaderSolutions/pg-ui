import * as React from "react";
import { ModalProps, Modal } from "reactstrap";
import { MapDispatchToPropsFunction, connect, MapStateToProps, Dispatch } from 'react-redux';
import { ApplicationState } from "../../../applicationState";
import { toggleModalDialog } from "../../../actions/viewActions";

export interface ModalDialogProps<T = {}> {
    data?: T;
    toggle?: () => void;
    onClosed?: () => void;
    onOpened?: () => void;
    isOpen?: boolean;
}

export interface ModalDialogSettings extends ModalProps {
    name: string;
}

/* Higher Order Component (HOC) for managing a modal dialog and ensuring it is appropriately connected to our application state  */
export default function asModalDialog<TModalProps extends ModalDialogProps<any>, TStateProps = {}, TDispatchProps = {}>(
        settings: ModalDialogSettings, 
        mapComponentStateToProps?: MapStateToProps<any, TModalProps, ApplicationState>, 
        mapComponentDispatchToProps?: MapDispatchToPropsFunction<any, TModalProps>){

    const { name } = settings;

    return (WrappedComponent: React.ComponentType<TModalProps & TDispatchProps & TStateProps>) => {
        const ReduxReactstrapModalContainer = (props: TModalProps) => {
            return (
                <Modal {...settings} isOpen={props.isOpen}>
                    <WrappedComponent {...props} />
                </Modal>
            );
        };

        const mapStateToProps = (state: ApplicationState, ownProps: TModalProps) => {
            let props = {};
            if(mapComponentStateToProps){
                props = mapComponentStateToProps(state, ownProps);
            }

            if(state.view.modal !== undefined){
                let modal = state.view.modal.dialogs.find(d => d.name == name);
                if(modal === null || modal === undefined){
                    return { isOpen: false, data: {}};
                }

                const isOpen = modal && modal.isOpen;
                const data = modal ? modal.data : undefined;
                return { isOpen, data, ...props };
            }

            return { isOpen: false, data: {}};
        }

        const mapDispatchToProps = (dispatch: Dispatch<any>, props: TModalProps) => {
            var componentDispatchProps = {};
            if(mapComponentDispatchToProps){
                componentDispatchProps = mapComponentDispatchToProps(dispatch, props)
            }

            return ({
                ...componentDispatchProps,
                toggle: () => { dispatch(toggleModalDialog(name)); },
                onOpened: () => { props.onOpened && props.onOpened(); },
                onClosed: () => { props.onClosed && props.onClosed(); }
            });
        }

        return connect(mapStateToProps, mapDispatchToProps)(ReduxReactstrapModalContainer);
    }
}