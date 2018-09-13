import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { fetchContractBackingSheets } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderBackingSheetsDialog from './TenderBackingSheetsDialog';
import Spinner from "../../common/Spinner";
import { format } from 'currency-formatter';
import ModalDialog from "../../common/ModalDialog";
import { openModalDialog } from "../../../actions/viewActions";
import { Link } from "react-router-dom";
import { PortfolioSummary } from "../../../model/PortfolioDetails";

interface TenderContractViewProps {
    tender: Tender;
    portfolio: PortfolioSummary;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}

interface DispatchProps {
    fetchContractBackingSheets: (tenderId: string, contractId: string) => void;
    openModalDialog: (dialogId: string) => void;
}

class TenderContractView extends React.Component<TenderContractViewProps & DispatchProps & StateProps, {}> { 
    renderContractInfo(){
        var { existingContract } = this.props.tender;
        var existingSupplier = this.props.suppliers.find(s => s.supplierId == existingContract.supplierId);
        var supplierLogo = existingSupplier == null ? "Unknown" : (<img src={existingSupplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);

        var appu = `${existingContract.averagePPU.toFixed(4)}p`;
        return (
            <div className="uk-grid uk-margin-small-left uk-margin-small-right uk-grid-match" data-uk-grid>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.reference}</p>
                    <p className="uk-text-meta uk-margin-small">Reference</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{supplierLogo}</p>
                    <p className="uk-text-meta uk-margin-small">Supplier</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{existingContract.product}</p>
                    <p className="uk-text-meta uk-margin-small">Product</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{format(existingContract.totalIncCCL, { locale: 'en-GB'})}</p>
                    <p className="uk-text-meta uk-margin-small">Contract Value</p>
                </div>
                <div className="uk-card uk-card-default uk-card-small uk-card-body uk-width-1-5 uk-text-center">
                    <p className="uk-text-bold uk-margin-small">{appu}</p>
                    <p className="uk-text-meta uk-margin-small">Avg Pence Per Unit</p>
                </div>
            </div>
        )
    }

    fetchRatesAndOpenDialog(){
        let contractId = this.props.tender.existingContract.contractId;
        this.props.fetchContractBackingSheets(this.props.tender.tenderId, contractId);
        this.props.openModalDialog("view_tender_contract_rates");
    }
   
    render() {
        if(this.props.working){
            return (<Spinner />);
        }

        var cardContent = null;
        var titleContent = null;
        if(this.props.tender.existingContract == null){
            cardContent = (
                <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom uk-text-center" data-uk-alert>
                    <p><i className="fas fa-exclamation-triangle uk-margin-small-right"></i>We couldn't match this portfolio's included meters to a valid existing contract on its account.</p>
                    <p><Link to={`/account/${this.props.portfolio.accountId}`}>Click here</Link> to visit the account where you can add a valid contract.</p>
                </div>
            );
        }
        else {
            var hasContractRates = this.props.tender.existingContract.sheetCount > 0;
            var warningMessage = null;
            
            if(!hasContractRates){
                warningMessage = (
                    <div className="uk-alert-warning uk-margin-small-top uk-margin-small-bottom uk-text-center" data-uk-alert>
                        <p><i className="fas fa-exclamation-triangle uk-margin-small-right"></i>This contract does not yet have any rates associated with it.</p>
                        <p><Link to={`/account/${this.props.tender.existingContract.accountId}`}>Click here</Link> to visit the account where you can upload some.</p>
                    </div>);
            }
            else {
                titleContent = (<button className='uk-button uk-button-default uk-button-small' onClick={() => this.fetchRatesAndOpenDialog()}><i className="fa fa-pound-sign uk-margin-small-right"></i>View Contract Rates</button>);
            }

            cardContent = (<div>{this.renderContractInfo()}{warningMessage}</div>);
        }

        return (
            <div className="uk-card uk-card-small uk-card-default uk-card-body">
                <div className="uk-grid uk-grid-small">
                    <div className="uk-width-expand">
                        <h3 className="uk-margin-left"><i className="fas fa-file-signature uk-margin-small-right"></i>Existing Contract</h3>
                    </div>
                    <div className="uk-width-auto">
                        {titleContent}
                    </div>
                </div>
                <div className="uk-margin">
                    {cardContent}
                </div>
                <ModalDialog dialogId="view_tender_contract_rates" dialogClass="backing-sheet-modal">
                    <TenderBackingSheetsDialog />
                </ModalDialog>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderContractViewProps> = (dispatch) => {
    return {
        fetchContractBackingSheets: (tenderId: string, contractId: string) => dispatch(fetchContractBackingSheets(tenderId, contractId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderContractViewProps> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderContractView);