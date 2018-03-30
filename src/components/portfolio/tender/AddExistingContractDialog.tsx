import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

import { addExistingContract } from '../../../actions/tenderActions';
import { Tender, TenderContract, TenderSupplier } from "../../../model/Tender";

interface AddExistingContractDialogProps {
    portfolioId: string;
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
    addExistingContract: (portfolioId: string, tenderId: string, contract: TenderContract) => void;
}

interface AddExistingContractState {
    contractStart: moment.Moment;
    contractEnd: moment.Moment;
}

class AddExistingContractDialog extends React.Component<AddExistingContractDialogProps & StateProps & DispatchProps, AddExistingContractState> {
    constructor(){
        super();
        this.state = {
            contractStart: moment(),
            contractEnd: moment()
        }

        this.handleContractStartChange = this.handleContractStartChange.bind(this);
        this.handleContractEndChange = this.handleContractEndChange.bind(this);
    }
    contractRef: HTMLInputElement;
    supplier: HTMLSelectElement;
    product: HTMLSelectElement;

    handleContractStartChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            contractStart: date
        });

        event.preventDefault();
    }

    handleContractEndChange(date: moment.Moment, event: React.SyntheticEvent<any>){
        this.setState({
            contractEnd: date
        });
        
        event.preventDefault();
    }

    addExistingContract(){
        var contract: TenderContract = {
            contractId: null,
            supplierId: this.supplier.value,
            accountId: null,
            contractStart: this.state.contractStart.format("YYYY-MM-DDTHH:mm:ss"),
            contractEnd: this.state.contractEnd.format("YYYY-MM-DDTHH:mm:ss"),
            product: this.product.value,
            reference: this.contractRef.value,
            utility: null,
            incumbent: true,
            uploaded: null,
            status: null,
            sheetCount: 0
        };
        this.props.addExistingContract(this.props.portfolioId, this.props.tender.tenderId, contract);
    }

    renderSupplierSelect(){
        var options = this.props.suppliers.map(s => {
                return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
        })

        return (
            <select className='uk-select' 
                ref={ref => this.supplier = ref}>
                <option value="" disabled>Select</option>
                {options}
            </select>
        );
    }

    render() {
        let { tender } = this.props;
        if(this.props.suppliers == null){
            return (<Spinner />);
        }
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Add existing contract</h2>
                </div>
                <div className="uk-modal-body">
                    <form>
                        <div className='uk-flex'>
                            <div className='uk-card uk-card-default uk-card-body uk-flex-1'>
                                <fieldset className='uk-fieldset'>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Contract Ref</label>
                                        <input className='uk-input' 
                                            ref={ref => this.contractRef = ref}/>
                                    </div>
                                    <div className='uk-margin'>
                                        <label className='uk-form-label'>Product</label>
                                        <select className='uk-select' 
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

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="contract-start-input">Contract Start</label>
                                        <div className="uk-form-controls">
                                            <DatePicker id="contract-start-input"
                                                        className="uk-input"
                                                        selected={this.state.contractStart}
                                                        onChange={this.handleContractStartChange}/>
                                        </div>
                                    </div>

                                    <div className="uk-margin">
                                        <label className="uk-form-label" data-for="contract-end-input">Contract End</label>
                                        <div className="uk-form-controls">
                                            <DatePicker id="contract-end-input"
                                                        className="uk-input"
                                                        selected={this.state.contractEnd}
                                                        onChange={this.handleContractEndChange}/>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                        
                    </form>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.addExistingContract()}>Add</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AddExistingContractDialogProps> = (dispatch) => {
    return {
        addExistingContract: (portfolioId: string, tenderId: string, contract: TenderContract) => dispatch(addExistingContract(portfolioId, tenderId, contract))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AddExistingContractDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.addExistingContract.working || state.portfolio.tender.suppliers.working,
        error: state.portfolio.tender.addExistingContract.error,
        errorMessage: state.portfolio.tender.addExistingContract.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AddExistingContractDialog);