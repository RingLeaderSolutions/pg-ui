import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import CreateElectricityTenderView from "./CreateElectricityTenderView";
import CreateGasTenderView from "./CreateGasTenderView";

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import TenderView from "./TenderView";

interface TenderSummaryProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  tenders: Tender[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getPortfolioTenders: (portfolioId: string) => void;
}

class TenderSummary extends React.Component<TenderSummaryProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getPortfolioTenders(portfolioId);
    }

    generateGasTender(){
        let tender = this.props.tenders.find(t => t.utility == "GAS");
        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Gas} />);
        }

        return (<CreateGasTenderView portfolioId={this.props.portfolio.id} />);
    }

    generateElectricityTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY");

        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
        }
        return (<CreateElectricityTenderView portfolioId={this.props.portfolio.id} />);
    }

    renderContent(content: any){
        return (
            <div className="content-tenders">
                {content}
            </div>
        )
    }
    
    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderContent(error);
        }
        if(this.props.working || this.props.tenders == null || this.props.details == null){
            var spinner = (<Spinner />);
            return this.renderContent(spinner);
        }
        if(this.props.details.requirements == null){
            var finishSetup = (<p>This portfolio isn't ready to tender yet. Please complete the necessary fields on the setup tab.</p>);
            return this.renderContent(finishSetup);
        }
        
        var gasTenders = this.props.details.requirements.gasRequired ? this.generateGasTender() : null;
        var elecTenders = this.props.details.requirements.electricityRequired ? this.generateElectricityTender() : null;
        var { tenders } = this.props;

        var content = (
            <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                <div>{elecTenders}</div>
                <div>{gasTenders}</div>
            </div>
        );
        return this.renderContent(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderSummaryProps> = (dispatch) => {
    return {
        getPortfolioTenders: (portfolioId: string) => dispatch(getPortfolioTenders(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderSummaryProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        tenders: state.portfolio.tender.tenders.value,
        working: state.portfolio.tender.tenders.working || state.portfolio.details.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderSummary);