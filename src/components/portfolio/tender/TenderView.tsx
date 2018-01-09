import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";
import TenderContractView from "./TenderContractView";

interface TenderViewProps {
    tender: Tender;
    utility: UtilityType;
    details: PortfolioDetails;
}

class TenderView extends React.Component<TenderViewProps, {}> { 
    render() {
        var utilityDescription = this.props.utility == UtilityType.Gas ? "Gas" : "Electricity";

        var hasQuotes = this.props.tender.quotes != null && this.props.tender.quotes.length > 0;
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <h2>{utilityDescription}</h2>

                <div className="uk-margin">
                    <TenderStatus tender={this.props.tender} utility={this.props.utility} details={this.props.details} />
                </div>
                
                <div className="uk-margin">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3>Quotes</h3>
                        <div>
                            {hasQuotes ? (<p>Quote display not yet built.</p>) : (<p>Not issued</p>)}
                        </div>
                    </div>
                </div>
                <div className="uk-margin">
                    <div className="uk-card uk-card-default uk-card-body">
                        <h3>Existing Contract</h3>
                        <TenderContractView tender={this.props.tender} />
                    </div>
                </div>
            </div>)
    }
}

export default TenderView;