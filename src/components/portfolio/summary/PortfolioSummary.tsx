import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import CounterCard from "../../common/CounterCard";
import { Portfolio, PortfolioDetails, User } from '../../../model/Models';
import PortfolioMeterStatus from "./PortfolioMeterStatus";
import DeletePortfolioDialog from "../creation/DeletePortfolioDialog";
import ModalDialog from "../../common/ModalDialog";
import { openModalDialog } from "../../../actions/viewActions";
import PortfolioUploads from "../upload/PortfolioUploads";

interface PortfolioSummaryProps {
    portfolio: Portfolio;
    detail: PortfolioDetails;
}

interface DispatchProps {
    openModalDialog: (dialogId: string) => void;
}

class PortfolioSummary extends React.Component<PortfolioSummaryProps & DispatchProps, {}> {
    missingFieldText: string = "-";

    formatForDisplay(value: string){
        if(value == null || value == ""){
            return this.missingFieldText;
        }

        return value;
    }

    renderUser(user: User){
        if(user == null){
            return (<h4><strong>-</strong></h4>)
        }

        return (
            <div className="uk-grid uk-grid-small">
                <div className="uk-width-expand" />
                <div className="uk-width-auto">
                    <div className="uk-grid uk-grid-small">
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <img className="avatar avatar-xlarge" src={user.avatarUrl} />
                        </div>
                        <div className="uk-width-auto uk-flex uk-flex-middle">
                            <h4><strong>{user.firstName} {user.lastName}</strong></h4>
                        </div>
                    </div>
                </div>
                <div className="uk-width-expand" />
            </div>
        )
    }

    render() {
        var { portfolio, detail } = this.props;

        var salesLead = this.renderUser(portfolio.salesLead);
        var supportExec = this.renderUser(portfolio.supportExec);

        return (
            <div className="content-inner-portfolio">
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s"></div>
                    <div className="uk-width-auto@s">
                        <button className='uk-button uk-button-danger uk-button-small' onClick={() => this.props.openModalDialog('delete_portfolio')}><i className="fas fa-trash uk-margin-small-right"></i> Delete portfolio</button>
                    </div>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={salesLead} label="Account Manager" small/>
                    <CounterCard content={supportExec} label="Tender Analyst" small/>
                    <CounterCard title={String(portfolio.mpans)} label="Included Meters" small />
                </div>
                <div className="uk-grid-match uk-text-center" data-uk-grid>
                    <div className="uk-width-auto">
                        <PortfolioMeterStatus portfolio={portfolio} />
                    </div>

                    
                    <div className="uk-width-expand">
                        <div className="uk-card uk-card-default uk-card-body">
                            <h4><i className="fa fa-file-upload uk-margin-small-right"></i>Uploads</h4>
                            <div className="portfolio-history">
                                <PortfolioUploads portfolio={portfolio}/>
                            </div>
                        </div>
                    </div>
                    {/* <PortfolioHistory portfolio={portfolio} /> */}
                </div>
                <ModalDialog dialogId="delete_portfolio">
                    <DeletePortfolioDialog portfolioId={portfolio.id}/>
                </ModalDialog>
            </div>)
    }
}


const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioSummaryProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
    };
};
  
export default connect(null, mapDispatchToProps)(PortfolioSummary);