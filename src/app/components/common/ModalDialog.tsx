import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { closeModalDialog } from "../../actions/viewActions";

interface ModalDialogProps {
    dialogId: string;
    children?: any;
    onClose?: () => void;
    dialogClass?: string;
}

interface StateProps {
    openModal: string;
}

interface DispatchProps {
    closeDialog: () => void;
}

class ModalDialog extends React.Component<ModalDialogProps & StateProps & DispatchProps, {}> {
    close(){
        if(this.props.onClose){
            this.props.onClose();
        }
        this.props.closeDialog()
    }

    render() {
        var modalClass = this.props.dialogId == this.props.openModal ? `uk-modal uk-open uk-flex uk-flex-center uk-flex-middle` : "uk-modal";
        var dialogClass = `uk-modal-dialog ${this.props.dialogClass}`;
        return (
            <div className={modalClass}>
                <div className={dialogClass}>
                    <button className="uk-modal-close-default uk-close uk-icon" type="button" onClick={() => this.close()}>
                    <i className="fas fa-times-circle"></i>
                    </button>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, ModalDialogProps> = (dispatch) => {
    return {
        closeDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, ModalDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        openModal: state.view.modal.shown_dialog
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(ModalDialog);