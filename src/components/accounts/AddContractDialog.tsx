import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';

import { createAccountContract } from '../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../model/Tender";
import { closeModalDialog } from "../../actions/viewActions";

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
    supplier: number;
    product: string;
    utility: string;
}

class AddExistingContractDialog extends React.Component<AddExistingContractDialogProps & StateProps & DispatchProps, AddExistingContractDialogState> {
    constructor(props: AddExistingContractDialogProps & StateProps & DispatchProps) {
        super();
        this.state = {
            contractRef: "",
            supplier: 0,
            product: "",
            utility: "electricity"
        }
    }

    addExistingContract(){
        var contract: TenderContract = {
            contractId: null,
            supplierId: String(this.state.supplier),
            accountId: this.props.accountId,
            product: this.state.product,
            reference: this.state.contractRef,
            contractStart: null,
            contractEnd: null,
            utility: this.state.utility,
            incumbent: true,
            uploaded: null,
            status: null,
            activeTenderCount: 0,
            sheetCount: 0
        };
        this.props.addExistingContract(this.props.accountId, contract);
        this.props.closeModalDialog();
    }

    renderSupplierSelect(){
        var options = this.props.suppliers.map(s => {
                return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
        })

        return (
            <select className='uk-select' 
                value={this.state.supplier}
                onChange={(e) => this.handleFormChange("supplier", e)}>
                <option value={0} disabled>Select</option>
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

    render() {
        if(this.props.suppliers == null){
            return (<Spinner />);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-file-contract uk-margin-right"></i>Add existing contract</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <fieldset className='uk-fieldset'>
                            <div className='uk-margin'>
                                <label className='uk-form-label'>Utility</label>
                                <select className='uk-select' 
                                    value={this.state.utility}
                                    onChange={(e) => this.handleFormChange("utility", e)}>
                                    <option value="" disabled>Select</option>
                                    <option value="electricity">Electricity</option>
                                    <option value="gas">Gas</option>
                                </select>
                            </div>

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
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.addExistingContract()}><i className="fas fa-plus-circle uk-margin-small-right"></i>Add</button>
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
  
const mapStateToProps: MapStateToProps<StateProps, AddExistingContractDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AddExistingContractDialog);