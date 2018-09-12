import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';

import { updateAccountContract } from '../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../model/Tender";
import { closeModalDialog } from "../../actions/viewActions";

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
}

class UpdateContractDialog extends React.Component<UpdateContractDialogProps & StateProps & DispatchProps, UpdateContractDialogState> {
    constructor(props: UpdateContractDialogProps & StateProps & DispatchProps) {
        super();
        this.state = {
            contractRef: props.contract.reference,
            supplier: props.contract.supplierId,
            product: props.contract.product
        }
    }

    componentWillReceiveProps(nextProps: UpdateContractDialogProps & StateProps & DispatchProps){
        if(nextProps.contract != null) {
            this.setState({
                contractRef: nextProps.contract.reference,
                supplier: nextProps.contract.supplierId,
                product: nextProps.contract.product
            });
        }
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
        var options = this.props.suppliers.map(s => {
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

    render() {
        if(this.props.suppliers == null){
            return (<Spinner />);
        }
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Update existing contract</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <div className='uk-flex'>
                            <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                                <fieldset className='uk-fieldset'>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Contract Ref</label>
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
                            </div>
                        </div>
                        
                    </form>
                    <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom" data-uk-alert>
                        <p>Please note that changing the existing contract's supplier will clear any uploaded contract rates.</p>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.addExistingContract()}>Update</button>
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