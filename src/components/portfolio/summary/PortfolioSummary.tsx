import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

import CounterCard from "../../common/CounterCard";
import { Portfolio, PortfolioDetails, User } from '../../../model/Models';
import PortfolioMeterStatus from "./PortfolioMeterStatus";
import PortfolioHistory from "./PortfolioHistory";
import UpdatePortfolioDialog from "../creation/UpdatePortfolioDialog";
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
            <div className="uk-grid-small" data-uk-grid>
                <div className="uk-width-1-4" />
                <div className="uk-width-expand">
                    <div className="uk-grid-small" data-uk-grid>
                        <div className="uk-width-auto">
                            <img className="avatar avatar-xlarge" src={user.avatarUrl} />
                    
                        </div>
                        <div className="uk-width-expand">
                            <h4 className="uk-margin-small-top"><strong>{user.firstName} {user.lastName}</strong></h4>
                        </div>
                    </div>
                </div>
                <div className="uk-width-1-4" />
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
                        <button className='uk-button uk-button-default uk-button-small' onClick={() => this.props.openModalDialog('update_portfolio')}><span data-uk-icon='icon: pencil' /> Edit portfolio</button>
                    </div>
                    <div className="uk-width-auto@s">
                        <button className='uk-button uk-button-danger uk-button-small' onClick={() => this.props.openModalDialog('delete_portfolio')}><span data-uk-icon='icon: close' /> Delete portfolio</button>
                    </div>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard content={salesLead} label="Account Manager" small/>
                    <CounterCard content={supportExec} label="Tender Analyst" small/>
                    <CounterCard title={String(portfolio.mpans)} label="Included Meters" small />
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <PortfolioMeterStatus portfolio={portfolio} />
                    <div>
                        <div className="uk-card uk-card-default uk-card-body">
                            <h4><span className="uk-margin-small-right" data-uk-icon="icon: cloud-upload"></span>Uploads</h4>
                            <div className="portfolio-history">
                                <PortfolioUploads portfolio={portfolio}/>
                            </div>
                        </div>
                    </div>
                    {/* <PortfolioHistory portfolio={portfolio} /> */}
                </div>
                <ModalDialog dialogId="update_portfolio">
                    <UpdatePortfolioDialog portfolio={portfolio} detail={detail}/>
                </ModalDialog>
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