import * as React from "react";
import { UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { updateTenderSuppliers } from '../../../actions/tenderActions';
import { TenderSupplier } from "../../../model/Tender";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { ModalHeader, ModalBody, ModalFooter, Label, Button } from "reactstrap";

export interface ManageTenderSuppliersDialogData {
    tenderId: string;
    assignedSuppliers: TenderSupplier[];
    utility: UtilityType;
}

interface StateProps {
    suppliers: TenderSupplier[];    
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    updateTenderSuppliers: (tenderId: string, supplierIds: string[]) => void;
}

interface SupplierSelectState {
    selected: string[];
}

class ManageTenderSuppliersDialog extends React.Component<ModalDialogProps<ManageTenderSuppliersDialogData> & StateProps & DispatchProps, SupplierSelectState> {
    constructor(props: ModalDialogProps<ManageTenderSuppliersDialogData> & StateProps & DispatchProps) {
        super(props);
        var selected = props.data.assignedSuppliers.map(s => s.supplierId);
        this.state = {
            selected 
        }
    }


    saveSuppliers(){
        this.props.updateTenderSuppliers(this.props.data.tenderId, this.state.selected);
        this.props.toggle();
    }

    toggleSupplierAssignment(supplierId: string){
        if(this.state.selected.find(selectedId => selectedId == supplierId)){
            this.setState( {
                selected: this.state.selected.filter((sid) => sid != supplierId)
            })
        }
        else {
            this.setState({
                selected: [...this.state.selected, supplierId]
            })
        }
    }

    selectAllSuppliers(){
        var suppliers = this.getValidSuppliers();
        
        this.setState({
            ...this.state,
            selected: suppliers.map(s => s.supplierId)
        });
    }

    selectNoSuppliers(){
        this.setState({
            ...this.state,
            selected: []
        });
    }


    getValidSuppliers() : TenderSupplier[]{
        if(this.props.data.utility == UtilityType.Gas){
            return this.props.suppliers.filter(s => s.gasSupplier);
        }
        else {
            return this.props.suppliers.filter(s => s.electricitySupplier);
        }
    }

    renderModalContent(){
        
        var suppliers = this.getValidSuppliers().map(s => {
            var isSelected = this.state.selected.find(sid => sid == s.supplierId) != null;
            return (
                <tr key={s.supplierId}>
                    <td><img src={s.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/></td>
                    <td>{s.name}</td>
                    <td>{s.paymentTerms} days</td>
                    <td>
                        <div className="custom-toggle custom-control">
                            <input type="checkbox" id={`toggle-tender-supplier${s.supplierId}`} className="custom-control-input"
                                   checked={isSelected} 
                                   onChange={(e) => this.toggleSupplierAssignment(s.supplierId)} />
                            <Label className="custom-control-label" for={`toggle-tender-supplier${s.supplierId}`} />
                        </div>
                    </td>
                </tr>
            )
        });

        return (
            <div style={{height: '450px', overflowY: 'auto'}}>
                <table className="table table-borderless">
                    <thead className="border-bottom">
                        <tr>
                            <th></th>
                            <th>Supplier</th>
                            <th>Payment Terms</th>
                            <th>Included</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        if(this.props.working || this.props.suppliers == null){
            return (<LoadingIndicator />);
        }
        var content = this.renderModalContent();
        
        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-industry mr-2"></i>Select Suppliers</ModalHeader>
                <ModalBody>
                    {content}
                    <hr />
                    <div className="d-flex">
                        <Button color="white" size="sm" onClick={() => this.selectAllSuppliers()}>
                            <i className="fa fa-check-double mr-1"></i> Select All
                        </Button>
                        <Button color="white" size="sm" className="ml-1"
                                onClick={() => this.selectNoSuppliers()}>
                            <i className="fa fa-times mr-1"></i> Select None
                        </Button>
                    </div>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                        onClick={() => this.saveSuppliers()}>
                    <i className="material-icons mr-1">mode_edit</i>Save
                </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {            
        updateTenderSuppliers: (tenderId, supplierIds) => dispatch(updateTenderSuppliers(tenderId, supplierIds))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.suppliers.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default AsModalDialog<ManageTenderSuppliersDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.ManageTenderSuppliers, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(ManageTenderSuppliersDialog)