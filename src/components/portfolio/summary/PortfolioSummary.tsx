import * as React from "react";
import Header from "../../common/Header";
import CounterCard from "../../common/CounterCard";
import { Portfolio } from '../../../model/Models';
import PortfolioMeterStatus from "./PortfolioMeterStatus";
import PortfolioHistory from "./PortfolioHistory";

interface PortfolioSummaryProps {
    portfolio: Portfolio
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
        var { portfolio } = this.props;

        var salesLead = portfolio.salesLead == null ? this.missingFieldText : `${portfolio.salesLead.firstName} ${portfolio.salesLead.lastName}`;        
        var supportExec = portfolio.supportExec == null ? this.missingFieldText : `${portfolio.supportExec.firstName} ${portfolio.supportExec.lastName}`;

        var client = this.missingFieldText, clientContact = this.missingFieldText;
        if(portfolio.client != null){
            client = portfolio.client.name;
            clientContact = portfolio.client.contact == null ? this.missingFieldText : `${portfolio.client.contact.firstName} ${portfolio.client.contact.lastName}`;
        }

        return (
            <div className="content-inner-portfolio">
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={client} label="Client" small/>
                    <CounterCard title={clientContact} label="Client Contact" small/>
                    <CounterCard title={salesLead} label="Sales Lead" small/>
                    <CounterCard title={supportExec} label="Support Executive" small/>
                    <CounterCard title={this.formatForDisplay(portfolio.creditRating)} label="Credit Check" small/>
                    <CounterCard title={this.formatForDisplay(portfolio.approvalStatus)} label="Approval Status" small/>
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <CounterCard title={this.formatForDisplay(portfolio.contractStart)} label="Contract Start" small/>
                    <CounterCard title={this.formatForDisplay(portfolio.contractEnd)} label="Contract End" small/>
                    <CounterCard title={this.missingFieldText} label="Consumption" small/>
                    <CounterCard title={this.missingFieldText} label="Upload Activity" small/>
                    <CounterCard title={String(portfolio.accounts)} label="Accounts" small/>
                    <CounterCard title={String(portfolio.mpans)} label="Meters" small />
                </div>
                <div className="uk-child-width-expand@s uk-grid-match uk-text-center" data-uk-grid>
                    <PortfolioMeterStatus portfolio={portfolio} />
                    <PortfolioHistory portfolio={portfolio} />
                </div>
            </div>)
    }
}

export default PortfolioSummary;