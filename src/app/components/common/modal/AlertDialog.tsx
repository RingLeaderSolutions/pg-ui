import * as React from "react";

import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

interface AlertDialogData {
    body: string;
    title: string;
}

class AlertDialog extends React.Component<ModalDialogProps<AlertDialogData>> {
    render() {
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-exclamation-triangle mr-2"></i>{this.props.data.title}</ModalHeader>
                <ModalBody>
                    <p>{this.props.data.body}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" 
                            onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>OK    
                    </Button>
                </ModalFooter>
            </div>);
    }
}
  
export default AsModalDialog<AlertDialogData>(
{ 
    name: ModalDialogNames.Alert, 
    centered: true, 
    backdrop: true
})(AlertDialog)