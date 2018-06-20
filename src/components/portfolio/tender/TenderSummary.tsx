import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import CreateTenderView from "./CreateTenderView";

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender } from "../../../model/Tender";
import TenderView from "./TenderView";
import { selectPortfolioTenderTab } from "../../../actions/viewActions";

interface TenderSummaryProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  tenders: Tender[];
  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface DispatchProps {
    getPortfolioTenders: (portfolioId: string) => void;
    selectPortfolioTenderTab: (index: number) => void;
}

class TenderSummary extends React.Component<TenderSummaryProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getPortfolioTenders(portfolioId);
    }

    generateGasTender(){
        let tender = this.props.tenders.find(t => t.utility == "GAS");
        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Gas} />);
        }

        return (<CreateTenderView portfolioId={this.props.portfolio.id} utilityType={UtilityType.Gas} isHalfHourly={false} />);
    }

    generateHHTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY" && t.halfHourly);

        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
        }
        return (<CreateTenderView portfolioId={this.props.portfolio.id} utilityType={UtilityType.Electricity} isHalfHourly={true} />);
    }

    generateNHHTender(){
        let tender = this.props.tenders.find(t => t.utility == "ELECTRICITY" && !t.halfHourly);

        if(tender != null){
            return (<TenderView tender={tender} details={this.props.details} utility={UtilityType.Electricity} />);
        }
        return (<CreateTenderView portfolioId={this.props.portfolio.id} utilityType={UtilityType.Electricity} isHalfHourly={false} />);
    }

    renderContent(content: any){
        return (
            <div className="content-tenders">
                {content}
            </div>
        )
    }
    
    selectTab(index: number){
        this.props.selectPortfolioTenderTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTender(){
        switch(this.props.selectedTab){
            case 0:
                return this.generateHHTender();
            case 1:
                return this.generateNHHTender();
            case 2:
                return this.generateGasTender();
        }
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

        var content = (
            <div>
                <ul className="uk-tab">
                    <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href='#'>Electricity (HH)</a></li>
                    <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href='#'>Electricity (NHH)</a></li>
                    <li className={this.renderActiveTabStyle(2)} onClick={() => this.selectTab(2)}><a href='#'>Gas</a></li>
                </ul>
                <div>
                    {this.renderSelectedTender()}
                </div>
            </div>
        );
        return this.renderContent(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderSummaryProps> = (dispatch) => {
    return {
        getPortfolioTenders: (portfolioId: string) => dispatch(getPortfolioTenders(portfolioId)),
        selectPortfolioTenderTab: (index: number) => dispatch(selectPortfolioTenderTab(index))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderSummaryProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        tenders: state.portfolio.tender.tenders.value,
        working: state.portfolio.tender.tenders.working || state.portfolio.details.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage,
        selectedTab: state.view.portfolio.tender.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderSummary);