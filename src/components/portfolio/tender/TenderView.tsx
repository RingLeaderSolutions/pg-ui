import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";

import { getPortfolioTenders, deleteTender } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";
import TenderContractView from "./TenderContractView";
import TenderQuotesView from "./TenderQuotesView";
import UpdateTenderDialog from "./UpdateTenderDialog";

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
}

class TenderView extends React.Component<TenderViewProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

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

        var updateTenderDialogName = `modal-update-tender-${utilityDescription}`;
        var showUpdateDialogClass = `target: #${updateTenderDialogName}`;

        let { tenderTitle } = this.props.tender;

        var hasTitle = tenderTitle != null && tenderTitle.length > 0;
        var title = hasTitle ? (<h2>{tenderTitle}</h2>) : (<h2>{utilityDescription} Tender</h2>);
        var content = (
            <div>
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s">
                        {title}
                    </div>
                    <div className="uk-width-1-6">
                        <button className="uk-button uk-button-default uk-button-small uk-align-right" type="button" data-uk-toggle={showUpdateDialogClass}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: pencil" />
                            Edit
                        </button>
                    </div>
                </div>

                <div className="uk-margin uk-margin-large-top">
                    <TenderStatus tender={this.props.tender} utility={this.props.utility} details={this.props.details} />
                </div>
                
                <div className="uk-margin">
                    <TenderQuotesView tender={this.props.tender} />
                </div>

                <div className="uk-margin">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3>Existing Contract</h3>
                        <TenderContractView tender={this.props.tender} portfolioId={this.props.details.portfolio.id}/>
                    </div>
                </div>
                <div>
                    <button className="uk-button uk-button-danger uk-button-small uk-align-right" type="button" onClick={() => this.deleteTender()}>
                        <span className="uk-margin-small-right" data-uk-icon="icon: close" />
                        Cancel
                    </button>
                </div>

                <div id={updateTenderDialogName} data-uk-modal="center: true">
                    <UpdateTenderDialog tender={this.props.tender} utilityDescription={utilityDescription} utility={this.props.utility}/>
                </div>
            </div>)

            return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderViewProps> = (dispatch) => {
    return {
        deleteTender: (portfolioId, tenderId) => dispatch(deleteTender(portfolioId, tenderId))
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