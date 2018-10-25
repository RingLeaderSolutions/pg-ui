import * as React from "react";
import { ModalProps, Modal } from "reactstrap";
import { MapDispatchToPropsFunction, connect, MapStateToProps, Dispatch } from 'react-redux';
import { ApplicationState } from "../../../applicationState";
import { toggleModalDialog } from "../../../actions/viewActions";

/* Helper interface, used by components which use the below AsModalDialog HOC */
export interface ModalDialogProps<TData = {}> extends ModalDialogDispatchProps, ModalDialogStateProps<TData>, ModalDialogOwnProps { }

/* Modal props that dispatch an action that will update state */
interface ModalDialogDispatchProps {
    toggle: () => void;
}

/* Modal props that are linked to and managed by application state */
interface ModalDialogStateProps<T> {
    isOpen: boolean;
    data: T;
}

/* Modal props that are exposed to the parent component and can be called by the modal itself */
interface ModalDialogOwnProps {
    onClosed?: () => void;
    onOpened?: () => void;
}

export interface ModalDialogSettings extends ModalProps {
    name: string;
}

/* Higher Order Component (HOC) for managing a modal dialog and ensuring it is appropriately connected to our application state  */
export default function AsModalDialog<TModalData = {}, TStateProps = {}, TDispatchProps = {}, TOwnProps = {}>(
        settings: ModalDialogSettings, 
        mapComponentStateToProps?: MapStateToProps<TStateProps, TOwnProps, ApplicationState>, 
        mapComponentDispatchToProps?: MapDispatchToPropsFunction<TDispatchProps, TOwnProps>){

    const { name } = settings;

    return (WrappedComponent: React.ComponentType<ModalDialogProps<TModalData> & TDispatchProps & TStateProps>) => {
        const ReduxReactstrapModalContainer = (props: ModalDialogProps<TModalData>) => {
            return (
                <Modal {...settings} isOpen={props.isOpen}>
                    <WrappedComponent {...props} />
                </Modal>
            );
        };

        const mapStateToProps: MapStateToProps<TStateProps & ModalDialogStateProps<TModalData>, TOwnProps, ApplicationState> = (state: ApplicationState, ownProps: TOwnProps) => {
            let componentStateProps: TStateProps;
            if(mapComponentStateToProps){
                componentStateProps = mapComponentStateToProps(state, ownProps);
            }

            if(!state.view.modal){
                throw new Error("Encountered an attempt to render a Modal dialog prior to application state initialization");
            }

            // if we don't find a reference to this modal in the application state, it should default to hidden
            const modal = state.view.modal.dialogs.find(d => d.name == name);
            if(!modal){
                return Object.assign({ isOpen: false, data: {}}, componentStateProps);
            }

            // if we do find a reference, rely on state to determine its visibility and data
            return Object.assign({ isOpen: modal.isOpen, data: modal.data }, componentStateProps);
        }

        const mapDispatchToProps: MapDispatchToPropsFunction<TDispatchProps & ModalDialogDispatchProps, TOwnProps & ModalDialogOwnProps> = (dispatch: Dispatch<any>, props: TOwnProps & ModalDialogOwnProps) => {
            let componentDispatchProps: TDispatchProps;
            if(mapComponentDispatchToProps){
                componentDispatchProps = mapComponentDispatchToProps(dispatch, props)
            }

            return Object.assign({
                toggle: () => { dispatch(toggleModalDialog(name)); },
                onOpened: () => { props.onOpened && props.onOpened(); },
                onClosed: () => { props.onClosed && props.onClosed(); }
            }, componentDispatchProps);
        }

        return connect(mapStateToProps, mapDispatchToProps)(ReduxReactstrapModalContainer);
    }
}