import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';

import { createAccountContract } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";
import { getWellFormattedUtilityType } from "../../common/UtilityIcon";
import { UtilityType } from "../../../model/Models";
import { Strings } from "../../../helpers/Utils";

interface AddExistingContractDialogProps {
    accountId: string;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    addExistingContract: (accountId: string, contract: TenderContract) => void;
    closeModalDialog: () => void;
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
        super();
        
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
        let isHalfHourly = this.state.utility == UtilityType.Electricity ? this.state.isHalfHourly : false;
        var utilityString = getWellFormattedUtilityType(this.state.utility).toLowerCase();
        var contract: TenderContract = {
            contractId: null,
            supplierId: String(this.state.supplier),
            accountId: this.props.accountId,
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
            isHalfHourly
        };
        this.props.addExistingContract(this.props.accountId, contract);
        this.props.closeModalDialog();
    }

    renderSupplierSelect(){
        var options = this.state.eligibleSuppliers.map(s => {
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

    getSelectedUtilityCardClass(utility: UtilityType){
        if(this.state.utility == utility){
            return "uk-card-primary";
        }

        return "uk-card-default";
    }

    renderCheckIfMatches<T>(checkedValue: T, actualValue: T, useLargeIcon: boolean = true): JSX.Element {
        if(checkedValue == actualValue) {
            return (<i className={`fas fa-check-circle${useLargeIcon ? ' fa-lg' : ''}`} style={{color: '#ffffff'}}/>);
        }
        return null;
    }

    getSelectedClassIfMatches<T>(activeValue: T, actualValue: T): string {
        if(actualValue == activeValue){
            return "uk-card-primary";
        }
        return "uk-card-default";
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
            return (<Spinner />);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-file-signature uk-margin-right"></i>Add existing contract</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <fieldset className='uk-fieldset'>
                            <p>Please choose which utility that the existing contract covers:</p>
                            <div className="uk-grid uk-grid-small">
                                <div className="uk-width-1-2">
                                    <div className={`uk-card uk-card-small ${this.getSelectedClassIfMatches(UtilityType.Electricity, this.state.utility)} uk-card-hover uk-card-body`} onClick={() => this.toggleUtility(UtilityType.Electricity)} style={{cursor: 'pointer'}}>
                                        <div className="uk-grid uk-grid-collapse">
                                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                                <h4><i className="fas fa-bolt uk-margin-right fa-lg"></i>Electricity</h4>
                                            </div>
                                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                                {this.renderCheckIfMatches(UtilityType.Electricity, this.state.utility)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="uk-width-1-2">
                                    <div className={`uk-card uk-card-small ${this.getSelectedClassIfMatches(UtilityType.Gas, this.state.utility)} uk-card-hover uk-card-body`} onClick={() => this.toggleUtility(UtilityType.Gas)} style={{cursor: 'pointer'}}>
                                        <div className="uk-grid uk-grid-collapse">
                                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                                <h4><i className="fas fa-fire uk-margin-right fa-lg"></i>Gas</h4>
                                            </div>
                                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                            {this.renderCheckIfMatches(UtilityType.Gas, this.state.utility)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { this.state.utility == UtilityType.Electricity && 
                            <div className="uk-margin">
                                <label className='uk-form-label'>Meter Type</label>
                                <div className="uk-grid uk-grid-small">
                                    <div className="uk-width-1-2">
                                        <div className={`uk-card uk-card-small ${this.getSelectedClassIfMatches(true, this.state.isHalfHourly)} uk-card-body`} onClick={() => this.handleChange("isHalfHourly", true)} style={{cursor: 'pointer', padding: '10px 20px'}}>
                                            <div className="uk-grid uk-grid-collapse">
                                                <div className="uk-width-expand uk-flex uk-flex-middle">
                                                    <h5><i className="fas fa-clock uk-margin-right"></i>Half-Hourly</h5>
                                                </div>
                                                <div className="uk-width-auto uk-flex uk-flex-middle">
                                                    {this.renderCheckIfMatches(true, this.state.isHalfHourly, false)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="uk-width-1-2">
                                        <div className={`uk-card uk-card-small ${this.getSelectedClassIfMatches(false, this.state.isHalfHourly)} uk-card-body`} onClick={() => this.handleChange("isHalfHourly", false)} style={{cursor: 'pointer', padding: '10px 20px'}}>
                                            <div className="uk-grid uk-grid-collapse">
                                                <div className="uk-width-expand uk-flex uk-flex-middle">
                                                    <h5><i className="fas fa-times uk-margin-right"></i>Non Half-hourly</h5>
                                                </div>
                                                <div className="uk-width-auto uk-flex uk-flex-middle">
                                                    {this.renderCheckIfMatches(false, this.state.isHalfHourly, false)}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> }

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
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button"  onClick={() => this.props.closeModalDialog()}><i className="fas fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.addExistingContract()} disabled={!this.canSubmit()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Add</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AddExistingContractDialogProps> = (dispatch) => {
    return {
        addExistingContract: (accountId: string, contract: TenderContract) => dispatch(createAccountContract(accountId, contract)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
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
  
export default connect(mapStateToProps, mapDispatchToProps)(AddExistingContractDialog);