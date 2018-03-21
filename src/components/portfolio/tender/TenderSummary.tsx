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

interface State {
    tab: string
}


class TenderSummary extends React.Component<TenderSummaryProps & StateProps & DispatchProps, State> {
    constructor() {
        super();

        this.state = {
            tab: 'electricity'
        };
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

    generateHHTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY" && t.halfHourly);

        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
        }
        return (<CreateElectricityTenderView portfolioId={this.props.portfolio.id} isHalfHourly={true} />);
    }

    generateNHHTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY" && !t.halfHourly);

        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
        }
        return (<CreateElectricityTenderView portfolioId={this.props.portfolio.id} isHalfHourly={false} />);
    }

    renderContent(content: any){
        return (
            <div className="content-tenders">
                {content}
            </div>
        )
    }

    renderTenderTabs(){
        return (
            <ul data-uk-tab>
                <li className={this.state.tab === 'electricity-hh' ? 'uk-active' : null}>
                    <a href='#' onClick={() =>this.selectTab('electricity-hh')}>Electricity (HH)</a>
                </li>
                <li className={this.state.tab === 'electricity-nhh' ? 'uk-active' : null}>
                    <a href='#' onClick={() =>this.selectTab('electricity-nhh')}>Electricity (NHH)</a>
                </li>
                <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                    <a href='#' onClick={() =>this.selectTab('gas')}>Gas</a>
                </li>
            </ul>
        )
    }

    selectTab(tab:string){
        this.setState({
            tab: tab
        });
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
        if(this.props.details.portfolio.status != "tender"){
            var finishSetup = (<p>This portfolio isn't ready to tender yet. Please upload data for applicable meters and ensure portfolio setup is complete.</p>);
            return this.renderContent(finishSetup);
        }
        
        var gasTenders = this.generateGasTender();
        var hhTender = this.generateHHTender();
        var nhhTender = this.generateNHHTender();
        var { tenders } = this.props;

        var content = (
            <div>
                {this.renderTenderTabs()}
                <ul className='uk-switcher'>
                    <li className={this.state.tab === 'electricity-hh' ? 'uk-active' : null}>
                        {hhTender}
                    </li>
                    <li className={this.state.tab === 'electricity-nhh' ? 'uk-active' : null}>
                        {nhhTender}
                    </li>
                    <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                        {gasTenders}
                    </li>
                </ul>
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