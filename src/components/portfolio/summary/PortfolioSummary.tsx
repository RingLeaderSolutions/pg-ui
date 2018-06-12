import * as React from "react";
import CounterCard from "../../common/CounterCard";
import { Portfolio, PortfolioDetails } from '../../../model/Models';
import PortfolioMeterStatus from "./PortfolioMeterStatus";
import PortfolioHistory from "./PortfolioHistory";
import UpdatePortfolioDialog from "../creation/UpdatePortfolioDialog";
import DeletePortfolioDialog from "../creation/DeletePortfolioDialog";

interface PortfolioSummaryProps {
    portfolio: Portfolio;
    detail: PortfolioDetails;
}
class PortfolioSummary extends React.Component<PortfolioSummaryProps, {}> {
    missingFieldText: string = "-";

    formatForDisplay(value: string){
        if(value == null || value == ""){
            return this.missingFieldText;
        }

        return value;
    }

    render() {
        var { portfolio, detail } = this.props;

        var salesLead = portfolio.salesLead == null ? this.missingFieldText : `${portfolio.salesLead.firstName} ${portfolio.salesLead.lastName}`;        
        var supportExec = portfolio.supportExec == null ? this.missingFieldText : `${portfolio.supportExec.firstName} ${portfolio.supportExec.lastName}`;

        return (
            <div className="content-inner-portfolio">
                <div className="uk-grid" data-uk-grid>
                    <div className="uk-width-expand@s"></div>
                    <div className="uk-width-auto@s">
                        <button className='uk-button uk-button-default uk-button-small' data-uk-toggle="target: #modal-edit-portfolio"><span data-uk-icon='icon: pencil' /> Edit portfolio</button>
                    </div>
                    <div className="uk-width-auto@s">
                        <button className='uk-button uk-button-danger uk-button-small' data-uk-toggle="target: #modal-delete-portfolio"><span data-uk-icon='icon: close' /> Delete portfolio</button>
                    </div>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={salesLead} label="Account Manager" small/>
                    <CounterCard title={supportExec} label="Tender Analyst" small/>
                    <CounterCard title={this.formatForDisplay(portfolio.creditRating)} label="Credit Score" small/>
                    <CounterCard title={String(portfolio.mpans)} label="Meters" small />
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <PortfolioMeterStatus portfolio={portfolio} />
                    <PortfolioHistory portfolio={portfolio} />
                </div>
                <div id="modal-edit-portfolio" data-uk-modal="center: true">
                    <UpdatePortfolioDialog portfolio={portfolio} detail={detail}/>
                </div>
                <div id="modal-delete-portfolio" data-uk-modal="center: true">
                    <DeletePortfolioDialog portfolioId={portfolio.id}/>
                </div>
            </div>)
    }
}

export default PortfolioSummary;