import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

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
        return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Gas} />);
    }

    generateElectricityTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY");
        return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.tenders == null || this.props.details == null){
            return (<Spinner />);
        }
        
        var gasTenders = this.props.details.requirements.gasRequired ? this.generateGasTender() : null;
        var elecTenders = this.props.details.requirements.electricityRequired ? this.generateElectricityTender() : null;
        var { tenders } = this.props;
        return (
            <div className="content-tenders">
                <div className="uk-grid uk-child-width-expand@s uk-grid-match" data-uk-grid>
                    <div>{elecTenders}</div>
                    <div>{gasTenders}</div>
                </div>
            </div>)
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
        working: state.portfolio.tender.tenders.working && state.portfolio.details.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderSummary);