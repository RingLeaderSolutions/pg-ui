import * as React from "react";

import asModalDialog, { ModalDialogProps } from "./AsModalDialog";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { ModalDialogNames } from "./ModalDialogNames";

export interface AlertConfirmDialogData {
    body: string;
    title: string;
    onConfirm: () => void;
    confirmText: string;
    confirmIcon: string;
    headerClass?: string;
    confirmButtonColor?: string;
}

interface AlertConfirmDialogProps extends ModalDialogProps<AlertConfirmDialogData> {}

class AlertConfirmDialog extends React.Component<AlertConfirmDialogProps> {
    confirmAndClose(){
        this.props.toggle();
        this.props.data.onConfirm();
    }

    render() {
        let { body, title, confirmText, confirmIcon, headerClass, confirmButtonColor } = this.props.data; 
        let confirmColor = confirmButtonColor || "accent";
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle} className={headerClass ? headerClass : ""}><i className="fas fa-exclamation-triangle mr-2"></i>{title}</ModalHeader>
                <ModalBody>
                    <p>{body}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" 
                            onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel    
                    </Button>
                    <Button color={confirmColor}
                            onClick={() => this.confirmAndClose()}>
                        <i className={`fas fa-${confirmIcon} mr-1`}></i>{confirmText}
                    </Button>
                </ModalFooter>
            </div>);
    }
}
  
export default asModalDialog(
{ 
    name: ModalDialogNames.AlertConfirm, 
    centered: true, 
    backdrop: true
})(AlertConfirmDialog)