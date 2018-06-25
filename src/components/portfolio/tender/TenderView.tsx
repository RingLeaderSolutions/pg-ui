import * as React from "react";
import { PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";

import { deleteTender } from '../../../actions/tenderActions';

import { Tender } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";
import TenderContractView from "./TenderContractView";
import TenderQuotesView from "./TenderQuotesView";
import UpdateTenderDialog from "./UpdateTenderDialog";
import TenderSupplierSelectDialog from "./TenderSupplierSelectDialog";
import ModalDialog from "../../common/ModalDialog";
import { openModalDialog } from "../../../actions/viewActions";

interface TenderViewProps {
    tender: Tender;
    utility: UtilityType;
    details: PortfolioDetails;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    deleteTender: (portfolioId: string, tenderId: string) => void;
    openModalDialog: (dialogId: string) => void;
}

class TenderView extends React.Component<TenderViewProps & StateProps & DispatchProps, {}> {
    deleteTender(){
        this.props.deleteTender(this.props.details.portfolio.id, this.props.tender.tenderId);
    }

    renderCard(content: any){
        return (
            <div className="uk-card uk-card-default uk-card-body">
                {content}
            </div>
        )
    }

    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderCard(error);
        }

        if(this.props.working){
            var spinner = (<Spinner hasMargin={true}/>);
            return this.renderCard(spinner);
        }

        var utilityDescription = this.props.utility == UtilityType.Gas ? "Gas" : "Electricity";

        var updateTenderDialogName = `update_tender_${this.props.tender.tenderId}`;
        var supplierModalId = `select_suppliers_${this.props.tender.tenderId}`;

        let { tenderTitle } = this.props.tender;

        var hasTitle = tenderTitle != null && tenderTitle.length > 0;
        var title = hasTitle ? (<h2>{tenderTitle}</h2>) : (<h2>{utilityDescription} Tender</h2>);
        var content = (
            <div>
                <div className="uk-grid" data-uk-grid>
                    <div>
                        {title}
                    </div>
                    <div className="uk-width-expand@s">
                        <button className="uk-button uk-button-default uk-button-small" type="button" onClick={() => this.props.openModalDialog(updateTenderDialogName)}>
                            <span data-uk-icon="icon: pencil" />
                        </button>
                    </div>
                    <div className="uk-width-1-5">
                        <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button"  onClick={() => this.props.openModalDialog(supplierModalId)}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: database" />
                            Assign Suppliers
                        </button>
                    </div>
                </div>

                <div className="uk-margin-small">
                    <TenderStatus tender={this.props.tender} utility={this.props.utility} details={this.props.details} />
                </div>

                <div className="uk-margin-small">
                    <TenderContractView tender={this.props.tender} portfolioId={this.props.details.portfolio.id}/>
                </div>
                
                <div className="uk-margin-small">
                    <TenderQuotesView tender={this.props.tender} />
                </div>

                
                {/* <div>
                    <button className="uk-button uk-button-danger uk-button-small" type="button" onClick={() => this.deleteTender()}>
                        <span className="uk-margin-small-right" data-uk-icon="icon: close" />
                        Cancel
                    </button>
                </div> */}

                <ModalDialog dialogId={updateTenderDialogName}>
                    <UpdateTenderDialog tender={this.props.tender} utilityDescription={utilityDescription} utility={this.props.utility}/>
                </ModalDialog>

                <ModalDialog dialogId={supplierModalId}>
                    <TenderSupplierSelectDialog assignedSuppliers={this.props.tender.assignedSuppliers} tenderId={this.props.tender.tenderId} utility={this.props.utility}/>
                </ModalDialog>
            </div>)

            return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderViewProps> = (dispatch) => {
    return {
        deleteTender: (portfolioId, tenderId) => dispatch(deleteTender(portfolioId, tenderId)),
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderViewProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.delete_tender.working,
        error: state.portfolio.tender.delete_tender.error,
        errorMessage: state.portfolio.tender.delete_tender.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderView);