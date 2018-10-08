import * as React from "react";
import ErrorMessage from "../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { AccountDetail } from '../../model/Models';
import Spinner from '../common/Spinner';
import * as moment from 'moment';

import { format } from 'currency-formatter';

import { openModalDialog } from "../../actions/viewActions";
import ModalDialog from "../common/ModalDialog";
import { getAccountContracts, getTenderSuppliers, fetchAccountContractRates, deleteAccountContract, createContractRenewal } from "../../actions/tenderActions";
import { TenderContract, TenderSupplier } from "../../model/Tender";
import { UtilityIcon, getWellFormattedUtilityName } from "../common/UtilityIcon";
import UpdateContractDialog from "./UpdateContractDialog";
import TenderBackingSheetsDialog from "../portfolio/tender/TenderBackingSheetsDialog";
import AddContractDialog from "./AddContractDialog";
import UploadContractRatesDialog from "./UploadContractRatesDialog";
import * as UIkit from 'uikit'; 
import RenewContractDialog from "./RenewContractDialog";

interface AccountContractsViewProps {
}

interface StateProps {
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
  contracts: TenderContract[];
  suppliers: TenderSupplier[];
}

interface DispatchProps {
    getAccountContracts: (accountId: string) => void;
    fetchAccountContractRates: (contractId: string) => void;
    deleteContract: (contractId: string) => void;
    openModalDialog: (dialogId: string) => void;
    getSuppliers: () => void;
}

class AccountContractsView extends React.Component<AccountContractsViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        if(this.props.suppliers == null){
            this.props.getSuppliers()
        }

        const account = this.props.account;
        if(account != null) { 
            this.props.getAccountContracts(account.id);
        }
    }

    fetchRatesAndOpenDialog(contractId: string){
        this.props.fetchAccountContractRates(contractId);
        this.props.openModalDialog("view_account_rates");
    }

    deleteContract(event: any, contract: TenderContract){
        event.stopPropagation();

        var preText = "";
        if(contract.activeTenderCount > 0){
            var tenderText = contract.activeTenderCount > 1 ? "tenders" : "tender";
            preText = `The "${contract.reference}" contract is currently being used in ${contract.activeTenderCount} active ${tenderText}.<br/> `;
        }
        
        var confirmText = `${preText}Are you sure you want to delete this contract?`;
        UIkit.modal.confirm(confirmText).then(
            () => {
                this.props.deleteContract(contract.contractId); 
            }
        );
    }

    renderActionList(contract: TenderContract, hasContractRates: boolean){
        var options = [];
        var divider = (key: number) => (<li key={key} className="uk-nav-divider"></li>);
        
        var edit = (
            <li key="ec"><a href="#" onClick={() => this.props.openModalDialog(`edit_contract_${contract.contractId}`)}>
                <i className="fas fa-edit uk-margin-small-right"></i>
                Edit
            </a></li>);
        
        var upload = (
            <li key="ur"><a href="#" onClick={() => this.props.openModalDialog(`upload_rates_${contract.contractId}`)}>
                <i className="fas fa-file-upload uk-margin-small-right"></i>
                Upload Contract Rates
            </a></li>);

        options.push(edit, divider(1), upload, divider(2))
        
        if(hasContractRates){
            var viewRates = (
                <li key="vc"><a href="#" onClick={() => this.fetchRatesAndOpenDialog(contract.contractId)}>
                    <i className="fa fa-pound-sign uk-margin-small-right"></i>
                    View Contract Rates
                </a></li>);
            options.push(viewRates, divider(3));
        }
        
        var renewContract = (
            <li key="rc"><a href="#" onClick={(ev) => this.props.openModalDialog(`renew_contract_${contract.contractId}`)}>
                <i className="fas fa-redo uk-margin-small-right"></i>
                Renew
            </a></li>);

        var deleteContract = (
            <li key="dc"><a href="#" onClick={(ev) => this.deleteContract(ev, contract)}>
                <i className="fas fa-trash uk-margin-small-right"></i>
                Delete
            </a></li>);
            
        options.push(renewContract, divider(4), deleteContract);

        return options;
    }

    getStatusRowColor(status: string) : string {
        switch(status.toLowerCase()){
            case "active":
                return "#f0fcf0";
            case "pending":
                return "#fcf6f0"
            default:
                return "#ffffff";
        }
    }

    renderStatusIcon(status: string){
        switch(status.toLowerCase()){
            case "expired":
                return (<i style={{color: '#c21807'}} data-uk-tooltip="title:This contract has expired." className="fas fa-clock"></i>);
            case "active":
                return (<i style={{color: '#006400'}} data-uk-tooltip="title:This contract is active." className="fas fa-check-circle"></i>);
            case "pending":
                return (<i style={{color: '#ffa500'}} data-uk-tooltip="title:This contract is pending." className="fas fa-hourglass-half"></i>);
            default:
                return (<i style={{color: '#c21807'}} data-uk-tooltip="title: Unknown status" className="fas fa-question-circle"></i>)
        }
    }

    renderContractsRows(){
        return this.props.contracts.map(c => {
            var hasContractRates = c.sheetCount > 0;
            var supplier = this.props.suppliers.find(su => su.supplierId == c.supplierId);
            var supplierImage = supplier == null ? "Unknown" : (<img data-uk-tooltip={`title:${supplier.name}`} src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);
            var created = moment.utc(c.uploaded).local();
            
            var rowBackground = this.getStatusRowColor(c.status);
            return (
                <tr key={c.contractId} className="uk-table-middle" style={{background: rowBackground}}>
                    <td>
                        <div className="uk-grid uk-grid-collapse">
                            <div className="uk-grid-auto uk-flex uk-flex-middle">
                                {this.renderStatusIcon(c.status)}
                            </div>
                            <div className="uk-grid-auto uk-flex uk-flex-middle">
                                {!hasContractRates ? 
                                        (<i style={{color: '#ffa500'}} data-uk-tooltip="title:This existing contract's rates have not yet been uploaded and processed." className="fas fa-exclamation-triangle uk-margin-left"></i>) : 
                                        (<i style={{color: '#006400'}} data-uk-tooltip={`title:This existing contract's rates have been successfully processed.`} className="fas fa-pound-sign uk-margin-left"></i>)}
                            </div>
                        </div>
                    </td>
                    <td>{c.reference}</td>
                    <td>{supplierImage}</td>
                    <td className="uk-text-center"><UtilityIcon utility={c.utility} isHalfHourlyElectricity={c.isHalfHourly} /></td>
                    <td>{c.product}</td>
                    <td>{c.contractStart != null ? moment(c.contractStart).format("DD/MM/YYYY") : "-"}</td>
                    <td>{c.contractEnd != null ? moment(c.contractEnd).format("DD/MM/YYYY") : "-"}</td>
                    <td>{hasContractRates ? format(c.totalIncCCL, { locale: 'en-GB'}) : "-"}</td>
                    <td>{hasContractRates ? `${c.averagePPU.toFixed(4)}p` : "-"}</td>
                    <td data-uk-tooltip={`title:${created.format("DD/MM/YYYY HH:mm:ss")}`}>{created.fromNow()}</td>
                    <td>
                        <div>
                            <div className="uk-inline">
                                <button className="uk-button uk-button-default borderless-button" type="button">
                                    <i className="fa fa-ellipsis-v"></i>
                                </button>
                                <div data-uk-dropdown="pos:bottom-justify;mode:click">
                                    <ul className="uk-nav uk-dropdown-nav">
                                        {this.renderActionList(c, hasContractRates)}
                                    </ul>
                                </div>
                            </div>
                        
                        <ModalDialog dialogId={`upload_rates_${c.contractId}`}>
                            <UploadContractRatesDialog contract={c} supplier={supplier}/>
                        </ModalDialog>

                        <ModalDialog dialogId={`edit_contract_${c.contractId}`}>
                            <UpdateContractDialog contract={c} />
                        </ModalDialog>

                        <RenewContractDialog dialogId={`renew_contract_${c.contractId}`} contract={c} />
                        </div>
                    </td>
                </tr>
            )
        })
    }

    renderContractsTable(){
        return (
            <table className="uk-table uk-table-divider">
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Reference</th>
                    <th>Supplier</th>
                    <th>Utility</th>
                    <th>Product</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Total inc CCL</th>
                    <th>APPU</th>
                    <th>Created</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {this.renderContractsRows()}
            </tbody>
        </table>)
    }

    renderNoContractsWarning(){
        return (
            <div className="uk-alert-default uk-margin-right uk-alert" data-uk-alert>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                    <div className="uk-width-auto uk-flex uk-flex-middle">
                        <i className="fas fa-info-circle uk-margin-small-right"></i>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-middle">
                        <p>No existing contracts have been provided for this account yet. Click on the button above to get started.</p>    
                    </div>
                </div>
            </div>);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null || this.props.contracts == null){
            return (<Spinner />);
        }
        
        const hasContracts = this.props.contracts.length > 0;
        return (
            <div>
                <p className="uk-text-right">
                    <button className='uk-button uk-button-primary uk-margin-small-right' onClick={() => this.props.openModalDialog('add_contract')}><i className="fa fa-plus-circle uk-margin-small-right"></i>Add Existing Contract</button>
                </p>
                <hr/>
                {hasContracts ? this.renderContractsTable() : this.renderNoContractsWarning()}
                <ModalDialog dialogId={`view_account_rates`} dialogClass="backing-sheet-modal">
                    <TenderBackingSheetsDialog />
                </ModalDialog>

                <ModalDialog dialogId="add_contract">
                    <AddContractDialog accountId={this.props.account.id} />
                </ModalDialog>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountContractsViewProps> = (dispatch) => {
    return {
        getAccountContracts: (accountId: string) => dispatch(getAccountContracts(accountId)),
        fetchAccountContractRates: (contractId: string) => dispatch(fetchAccountContractRates(contractId)),
        deleteContract: (contractId: string) => dispatch(deleteAccountContract(contractId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId)),
        getSuppliers: () => dispatch(getTenderSuppliers())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountContractsViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working || state.hierarchy.selected_contracts.working || state.suppliers.working,
        error: state.hierarchy.selected.error || state.hierarchy.selected_contracts.error || state.suppliers.error,
        errorMessage: state.hierarchy.selected.errorMessage || state.hierarchy.selected_contracts.errorMessage || state.suppliers.errorMessage,
        contracts: state.hierarchy.selected_contracts.value,
        suppliers: state.suppliers.value,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountContractsView);