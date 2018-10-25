import * as React from "react";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { updateAccountContract } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../../model/Tender";
import { UtilityType } from "../../../model/Models";
import { Strings } from "../../../helpers/Utils";
import AsModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { Button, ModalHeader, ModalBody, Form, FormGroup, Label, Input, CustomInput, ModalFooter } from "reactstrap";

export interface UpdateContractDialogData {
    contract: TenderContract;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    updateExistingContract: (contract: TenderContract) => void;
}

interface UpdateContractDialogState {
    contractRef: string;
    supplier: string;
    product: string;
    eligibleSuppliers: TenderSupplier[];
}

class UpdateContractDialog extends React.Component<ModalDialogProps<UpdateContractDialogData> & StateProps & DispatchProps, UpdateContractDialogState> {
    constructor(props: ModalDialogProps<UpdateContractDialogData> & StateProps & DispatchProps) {
        super(props);

        let { contract } = props.data;
        var contractUtility = this.decodeUtility(contract.utility);
        var eligibleSuppliers = props.suppliers != null && props.suppliers.length > 0 ? this.getEligibleSuppliers(contractUtility, props.suppliers) : [];
        var selectedSupplier = this.getSelectedSupplierFromEligible(contract.supplierId, eligibleSuppliers);

        this.state = {
            contractRef: contract.reference || '',
            supplier: selectedSupplier,
            product: contract.product || '',
            eligibleSuppliers
        }
    }

    decodeUtility(utility: string){
        switch(utility.toLowerCase()){
            case "electricity":
                return UtilityType.Electricity;
            case "gas":
                return UtilityType.Gas;
            default:
                throw new RangeError(`No valid UtilityType for utility [${utility}]`);
        }
    }

    getEligibleSuppliers(utility: UtilityType, suppliers: TenderSupplier[]){
        switch(utility){
            case UtilityType.Electricity:
                return suppliers.filter(s => s.electricitySupplier);
            case UtilityType.Gas:
                return suppliers.filter(s => s.gasSupplier);
            default:
                console.log("Unknown utility type: " + {utility});
                return [];
        }
    }

    getSelectedSupplierFromEligible(selectedSupplierId: string, eligibleSuppliers: TenderSupplier[]){
        var existsInEligible = eligibleSuppliers.find(s => s.supplierId == selectedSupplierId);
        return existsInEligible == null ? "" : selectedSupplierId;
    }

    updateExistingContract(){
        var contract: TenderContract = {
            ...this.props.data.contract,
            
            supplierId: this.state.supplier,
            product: this.state.product,
            reference: this.state.contractRef
        };

        this.props.updateExistingContract(contract);
        this.props.toggle();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(): boolean {
        return Strings.AreNotNullOrEmpty(this.state.contractRef,
            this.state.supplier,
             this.state.product);
    }

    render() {
        if(this.props.suppliers == null){
            return (<LoadingIndicator />);
        }

        let supplierOptions = this.state.eligibleSuppliers.map(s => {
            return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
        });

        return (
            <div className="modal-content">
            <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-signature mr-1"></i>Edit existing contract</ModalHeader>
            <ModalBody>
                <Form>
                   

                    <FormGroup>
                        <Label for="add-contract-ref">Contract Reference</Label>
                        <Input id="add-contract-ref"
                                value={this.state.contractRef}
                                onChange={(e) => this.handleFormChange("contractRef", e)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="add-contract-product">Product</Label>
                        <CustomInput type="select" name="add-contract-product-picker" id="add-contract-product"
                                value={this.state.product}
                                onChange={(e) => this.handleFormChange("product", e)}>
                            <option value="" disabled>Select</option>
                            <option>Fixed</option>
                            <option>Flexi</option>
                        </CustomInput>
                    </FormGroup>   
                    <FormGroup>
                        <Label for="add-contract-supplier">Supplier</Label>
                        <CustomInput type="select" name="add-contract-supplier-picker" id="add-contract-supplier"
                                value={this.state.supplier}
                                onChange={(e) => this.handleFormChange("supplier", e)}>
                            <option value="" disabled>Supplier</option>
                            {supplierOptions}
                        </CustomInput>
                    </FormGroup>         
                    <p className="mb-0">Please be aware that changing an existing contract's supplier will clear any uploaded contract rates.</p>
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button onClick={this.props.toggle}>
                    <i className="fas fa-times mr-1"></i>Cancel
                </Button>
                <Button color="accent" 
                        disabled={!this.canSubmit()}
                        onClick={() => this.updateExistingContract()}>
                    <i className="material-icons mr-1">edit</i>Save
                </Button>
            </ModalFooter>
        </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        updateExistingContract: (contract: TenderContract) => dispatch(updateAccountContract(contract))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default AsModalDialog<UpdateContractDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.UpdateAccountContract, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(UpdateContractDialog)