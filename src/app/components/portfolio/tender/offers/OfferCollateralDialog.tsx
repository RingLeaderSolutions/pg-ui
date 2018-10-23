import * as React from "react";

import { TenderQuoteCollateral } from "../../../../model/Tender";
import asModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";
import { ModalFooter, Button, ModalHeader, ModalBody } from "reactstrap";
import { IsNullOrEmpty } from "../../../../helpers/extensions/ArrayExtensions";

export interface OfferCollateralDialogData {
    collateral: TenderQuoteCollateral[];
}

interface OfferCollateralDialogProps extends ModalDialogProps<OfferCollateralDialogData> {}
 
class OfferCollateralDialog extends React.Component<OfferCollateralDialogProps, {}> {
    renderTableContent(){
        return this.props.data.collateral.map(p => {
            var fileName = p.documentBlobId.substring(p.documentBlobId.lastIndexOf('/') + 1)

            return (
                <tr key={p.collateralId}>
                    <td>{fileName}</td>
                    <td>
                        <Button color="white" className="mx-auto"
                                href={p.documentBlobId} target="_blank">
                            <i className="far fa-eye"></i>
                        </Button>
                    </td>
                </tr>
            )
        });
    }

    render() {
        var hasCollateral = !IsNullOrEmpty(this.props.data.collateral);

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-folder-open mr-2"></i>Offer Collateral</ModalHeader>
                <ModalBody>
                    { hasCollateral ? (
                        <table className="table table-borderless">
                        <thead className="border-bottom">
                            <tr>
                                <th>Document Name</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderTableContent()}
                        </tbody>
                    </table>
                    ) : (<p className="m-0">This quote does not have any collateral.</p>)}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Close
                    </Button>
                </ModalFooter>
            </div>);
    }
}

export default asModalDialog(
{ 
    name: ModalDialogNames.ViewOfferCollateral, 
    centered: true, 
    backdrop: true,
})(OfferCollateralDialog)