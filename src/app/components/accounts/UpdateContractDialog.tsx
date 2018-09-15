import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';

import { updateAccountContract } from '../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../model/Tender";
import { closeModalDialog } from "../../actions/viewActions";
import { UtilityType } from "../../model/Models";
import { StringsAreNotNullOrEmpty } from "../../helpers/ValidationHelpers";

interface UpdateContractDialogProps {
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
    closeModalDialog: () => void;
}

interface UpdateContractDialogState {
    contractRef: string;
    supplier: string;
    product: string;
    eligibleSuppliers: TenderSupplier[];
}

class UpdateContractDialog extends React.Component<UpdateContractDialogProps & StateProps & DispatchProps, UpdateContractDialogState> {
    constructor(props: UpdateContractDialogProps & StateProps & DispatchProps) {
        super();

        var contractUtility = this.decodeUtility(props.contract.utility);
        var eligibleSuppliers = props.suppliers != null && props.suppliers.length > 0 ? this.getEligibleSuppliers(contractUtility, props.suppliers) : [];
        var selectedSupplier = this.getSelectedSupplierFromEligible(props.contract.supplierId, eligibleSuppliers);

        this.state = {
            contractRef: props.contract.reference,
            supplier: selectedSupplier,
            product: props.contract.product,
            eligibleSuppliers
        }
    }

    componentWillReceiveProps(nextProps: UpdateContractDialogProps & StateProps & DispatchProps){        
        if(nextProps.suppliers == null || nextProps.suppliers.length == 0) {
           return; 
        }

        var contractUtility = this.decodeUtility(nextProps.contract.utility);
        var eligibleSuppliers = this.getEligibleSuppliers(contractUtility, nextProps.suppliers);
        var newSelected = this.getSelectedSupplierFromEligible(this.state.supplier, eligibleSuppliers);

        this.setState({
            ...this.state,
            eligibleSuppliers,
            supplier: newSelected
        });
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

    addExistingContract(){
        var contract: TenderContract = {
            ...this.props.contract,
            
            supplierId: this.state.supplier,
            product: this.state.product,
            reference: this.state.contractRef
        };

        this.props.updateExistingContract(contract);
        this.props.closeModalDialog();
    }

    renderSupplierSelect(){
        var options = this.state.eligibleSuppliers
            .map(s => {
                return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
            })
            return (
                <select className='uk-select' 
                    value={this.state.supplier}
                    onChange={(e) => this.handleFormChange("supplier", e)}>
                    <option value="" disabled>Select</option>
                    {options}
                </select>
            );
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(): boolean {
        return StringsAreNotNullOrEmpty(this.state.contractRef,
            this.state.supplier,
             this.state.product);
    }

    render() {
        if(this.props.suppliers == null){
            return (<Spinner />);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-file-signature uk-margin-right"></i>Edit existing contract</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <fieldset className='uk-fieldset'>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Contract Reference</label>
                                <input className='uk-input' 
                                    value={this.state.contractRef}
                                    onChange={(e) => this.handleFormChange("contractRef", e)}/>
                            </div>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Product</label>
                                <select className='uk-select' 
                                    value={this.state.product}
                                    onChange={(e) => this.handleFormChange("product", e)}>
                                    <option value="" disabled>Select</option>
                                    <option>Fixed</option>
                                    <option>Flexi</option>
                                </select>
                            </div>
                            
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Supplier</label>
                                {this.renderSupplierSelect()}
                            </div>
                        </fieldset>
                    </form>
                    <div className="uk-alert uk-alert-warning uk-margin-small-bottom" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <p>Please be aware that changing an existing contract's supplier will clear any uploaded contract rates.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.addExistingContract()} disabled={!this.canSubmit()}><i className="fas fa-edit uk-margin-small-right"></i>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateContractDialogProps> = (dispatch) => {
    return {
        updateExistingContract: (contract: TenderContract) => dispatch(updateAccountContract(contract)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateContractDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateContractDialog);