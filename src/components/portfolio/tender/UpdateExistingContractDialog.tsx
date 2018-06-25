import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';

import { updateExistingContract } from '../../../actions/tenderActions';
import { TenderContract, TenderSupplier } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";

interface UpdateExistingContractDialogProps {
    portfolioId: string;
    tenderId: string;
    existingContract: TenderContract;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    updateExistingContract: (portfolioId: string, tenderId: string, contract: TenderContract) => void;
    closeModalDialog: () => void;
}

class UpdateExistingContractDialog extends React.Component<UpdateExistingContractDialogProps & StateProps & DispatchProps, {}> {


    contractRef: HTMLInputElement;
    supplier: HTMLSelectElement;
    product: HTMLSelectElement;

    addExistingContract(){
        var contract: TenderContract = {
            contractId: this.props.existingContract.contractId,
            supplierId: this.supplier.value,
            accountId: this.props.existingContract.accountId,
            product: this.product.value,
            reference: this.contractRef.value,
            utility: this.props.existingContract.utility,
            incumbent: this.props.existingContract.incumbent,
            uploaded: this.props.existingContract.uploaded,
            status: this.props.existingContract.status,
            sheetCount: this.props.existingContract.sheetCount
        };
        this.props.updateExistingContract(this.props.portfolioId, this.props.tenderId, contract);
        this.props.closeModalDialog();
    }

    renderSupplierSelect(){
        var options = this.props.suppliers.map(s => {
                return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
        })

        return (
            <select className='uk-select' 
                defaultValue={this.props.existingContract.supplierId}
                ref={ref => this.supplier = ref}>
                <option value="" disabled>Select</option>
                {options}
            </select>
        );
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
                                            defaultValue={this.props.existingContract.reference}
                                            ref={ref => this.contractRef = ref}/>
                                    </div>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Product</label>
                                        <select className='uk-select' 
                                            defaultValue={this.props.existingContract.product}
                                            ref={ref => this.product = ref}>
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

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UpdateExistingContractDialogProps> = (dispatch) => {
    return {
        updateExistingContract: (portfolioId: string, tenderId: string, contract: TenderContract) => dispatch(updateExistingContract(portfolioId, tenderId, contract)),
        closeModalDialog: () => dispatch(closeModalDialog()) 
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UpdateExistingContractDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.portfolio.tender.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UpdateExistingContractDialog);