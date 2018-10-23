import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import * as cn from "classnames";
import { createAccountContract } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../../model/Tender";
import { getWellFormattedUtilityType } from "../../common/UtilityIcon";
import { UtilityType } from "../../../model/Models";
import { Strings } from "../../../helpers/Utils";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { Button, ModalHeader, ModalBody, Form, Row, Col, Card, CardBody, FormGroup, Label, Input, CustomInput, ModalFooter } from "reactstrap";
import { LoadingIndicator } from "../../common/LoadingIndicator";

export interface AddExistingContractDialogData {
    accountId: string;
}

interface AddExistingContractDialogProps extends ModalDialogProps<AddExistingContractDialogData> { }

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    addExistingContract: (accountId: string, contract: TenderContract) => void;
}

interface AddExistingContractDialogState {
    contractRef: string;
    supplier: string;
    eligibleSuppliers: TenderSupplier[];
    product: string;
    utility: UtilityType;
    isHalfHourly: boolean;
}

class AddExistingContractDialog extends React.Component<AddExistingContractDialogProps & StateProps & DispatchProps, AddExistingContractDialogState> {
    constructor(props: AddExistingContractDialogProps & StateProps & DispatchProps) {
        super(props);
        
        var eligibleSuppliers = props.suppliers != null && props.suppliers.length > 0 ? this.getEligibleSuppliers(UtilityType.Electricity, props.suppliers) : [];
        this.state = {
            contractRef: "",
            supplier: "",
            product: "",
            utility: UtilityType.Electricity,
            eligibleSuppliers,
            isHalfHourly: true
        }
    }

    componentWillReceiveProps(nextProps: AddExistingContractDialogProps & StateProps & DispatchProps){
        if(nextProps.suppliers != null && nextProps.suppliers.length > 0){
            var eligibleSuppliers = this.getEligibleSuppliers(this.state.utility, nextProps.suppliers);
            var newSelected = this.getSelectedSupplierFromEligible(this.state.supplier, eligibleSuppliers);

            this.setState({
                ...this.state,
                eligibleSuppliers,
                supplier: newSelected
            })
        }
    }

    getSelectedSupplierFromEligible(selectedSupplierId: string, eligibleSuppliers: TenderSupplier[]){
        var existsInEligible = eligibleSuppliers.find(s => s.supplierId == selectedSupplierId);
        return existsInEligible == null ? "" : selectedSupplierId;
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

    addExistingContract(){
        let halfHourly = this.state.utility == UtilityType.Electricity ? this.state.isHalfHourly : false;
        var utilityString = getWellFormattedUtilityType(this.state.utility).toLowerCase();
        var contract: TenderContract = {
            contractId: null,
            supplierId: String(this.state.supplier),
            accountId: this.props.data.accountId,
            product: this.state.product,
            reference: this.state.contractRef,
            contractStart: null,
            contractEnd: null,
            utility: utilityString,
            incumbent: true,
            uploaded: null,
            status: null,
            activeTenderCount: 0,
            sheetCount: 0,
            halfHourly
        };
        this.props.addExistingContract(this.props.data.accountId, contract);
        this.props.toggle();
    }

    toggleUtility(utility: UtilityType){
        if(this.state.utility == utility){
            return;
        }

        var eligibleSuppliers = this.getEligibleSuppliers(utility, this.props.suppliers);
        var newSelected = this.getSelectedSupplierFromEligible(this.state.supplier, eligibleSuppliers);

        this.setState({
            ...this.state,
            utility,
            eligibleSuppliers,
            supplier: newSelected
        });
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        this.handleChange(attribute, event.target.value);
    }

    handleChange(attribute: string, value: any): void {
        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(): boolean {
        return Strings.AreNotNullOrEmpty(this.state.contractRef,
             this.state.supplier,
              this.state.product) 
            && this.state.utility != null;
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
            <ModalHeader toggle={this.props.toggle}><i className="fas fa-file-signature mr-1"></i>Add Existing Contract</ModalHeader>
            <ModalBody>
                <Form>
                    <p className="mb-1">Please choose which utility that the existing contract covers:</p>
                    <Row noGutters className="pb-2">
                        <Col xs={6} className="pr-1">
                            <Card className="card-small" style={{cursor: "pointer"}} onClick={() => this.toggleUtility(UtilityType.Electricity)}>
                                <CardBody className={cn("d-flex align-items-center", { "bg-primary text-white" : this.state.utility == UtilityType.Electricity })}>
                                    <h4 className={cn("flex-grow-1 mb-0", { "text-white" : this.state.utility == UtilityType.Electricity })}><i className="fas fa-bolt mr-2"></i>Electricity</h4>
                                    {this.state.utility === UtilityType.Electricity && (<i className="fas fa-check-circle fa-lg mx-1" />)}
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={6} className="pl-1">
                            <Card className="card-small" style={{cursor: "pointer"}} onClick={() => this.toggleUtility(UtilityType.Gas)}>
                                <CardBody className={cn("d-flex align-items-center", { "bg-primary text-white" : this.state.utility == UtilityType.Gas })}>
                                    <h4  className={cn("flex-grow-1 mb-0", { "text-white" : this.state.utility == UtilityType.Gas })}><i className="fas fa-fire mr-2"></i>Gas</h4>
                                    {this.state.utility === UtilityType.Gas && (<i className="fas fa-check-circle fa-lg mx-1" />)}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {this.state.utility === UtilityType.Electricity && (
                        <Row noGutters className="pb-2">
                            <Col xs={6} className="pr-1">
                                <Card className="card-small" style={{cursor: "pointer"}} onClick={() => this.handleChange("isHalfHourly", true)}>
                                    <CardBody className={cn("d-flex align-items-center", { "bg-primary text-white" : this.state.isHalfHourly })}>
                                        <h6 className={cn("flex-grow-1 mb-0", { "text-white" : this.state.isHalfHourly})}>Half-hourly</h6>
                                        {this.state.isHalfHourly && (<i className="fas fa-check-circle fa-lg mx-1" />)}
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col xs={6} className="pl-1">
                                <Card className="card-small" style={{cursor: "pointer"}} onClick={() => this.handleChange("isHalfHourly", false)}>
                                    <CardBody className={cn("d-flex align-items-center", { "bg-primary text-white" : !this.state.isHalfHourly })}>
                                        <h6 className={cn("flex-grow-1 mb-0", { "text-white" : !this.state.isHalfHourly})}>Non Half-hourly</h6>
                                        {!this.state.isHalfHourly && (<i className="fas fa-check-circle fa-lg mx-1" />)}
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>)}

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
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button onClick={this.props.toggle}>
                    <i className="fas fa-times mr-1"></i>Cancel
                </Button>
                <Button color="accent" 
                        disabled={!this.canSubmit()}
                        onClick={() => this.addExistingContract()}>
                    <i className="fas fa-plus-circle mr-1"></i>Add
                </Button>
            </ModalFooter>
        </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AddExistingContractDialogProps> = (dispatch) => {
    return {
        addExistingContract: (accountId: string, contract: TenderContract) => dispatch(createAccountContract(accountId, contract)),
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AddExistingContractDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default asModalDialog(
{ 
    name: ModalDialogNames.CreateAccountContract, 
    centered: true, 
    backdrop: true
}, mapStateToProps, mapDispatchToProps)(AddExistingContractDialog)