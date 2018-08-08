import * as React from "react";
import ErrorMessage from "../../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../../model/Models';
import Spinner from '../../../common/Spinner';

import { fetchTenderRecommendations } from '../../../../actions/tenderActions';
import { Tender } from "../../../../model/Tender";
import { selectTenderRecommendationsTab } from "../../../../actions/viewActions";
import TenderRecommendationsList from "./TenderRecommendationsList";

interface TenderRecommendationsViewProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  recommendations: Tender[];
  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface DispatchProps {
    getTenderRecommendations: (portfolioId: string) => void;
    selectTenderRecommendationsTab: (index: number) => void;
}

class TenderRecommendationsView extends React.Component<TenderRecommendationsViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getTenderRecommendations(portfolioId);
    }

    componentWillReceiveProps(nextProps: TenderRecommendationsViewProps & StateProps & DispatchProps){
        if(nextProps.portfolio.id != this.props.portfolio.id){
            this.props.getTenderRecommendations(nextProps.portfolio.id);
        }

        var hh = nextProps.recommendations.find(o => o.halfHourly && o.utility == "ELECTRICITY");
        var nhh = nextProps.recommendations.find(o => !o.halfHourly && o.utility == "ELECTRICITY");
        var gas = nextProps.recommendations.find(o => o.utility == "GAS");

        var map = new Map<number, Tender>();
        map.set(0, hh);
        map.set(1, nhh);
        map.set(2, gas);

        var intendedTender = map.get(this.props.selectedTab);
        if(intendedTender == null){
            for (var [key, value] of map.entries()){
                if(value){
                    console.log('resetting tab to ' + key)
                    this.props.selectTenderRecommendationsTab(key);
                }
            }
        }
    }

    renderContent(content: any){
        return (
            <div className="content-tenders">
                {content}
            </div>
        )
    }
    
    selectTab(index: number){
        this.props.selectTenderRecommendationsTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTender(){
        var hh = this.props.recommendations.find(o => o.halfHourly && o.utility == "ELECTRICITY");
        var nhh = this.props.recommendations.find(o => !o.halfHourly && o.utility == "ELECTRICITY");
        var gas = this.props.recommendations.find(o => o.utility == "GAS");

        var map = new Map<number, Tender>();
        map.set(0, hh);
        map.set(1, nhh);
        map.set(2, gas);

        var intendedTender = map.get(this.props.selectedTab);
        if(intendedTender == null){
            return (<ErrorMessage content="Error rendering this component" />)
        }

        return (<TenderRecommendationsList tender={intendedTender}/>)
    }

    renderTabs(){
        var hasHH = this.props.recommendations.find(o => o.halfHourly && o.utility == "ELECTRICITY") != null;
        var hasNHH = this.props.recommendations.find(o => !o.halfHourly && o.utility == "ELECTRICITY") != null;
        var hasGas = this.props.recommendations.find(o => o.utility == "GAS") != null;
        return (
            <div className="content-tenders">
                <ul className="uk-tab">
                    {hasHH ? <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href='#'>Electricity (HH)</a></li> : null}
                    {hasNHH ? <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href='#'>Electricity (NHH)</a></li> : null}
                    {hasGas ? <li className={this.renderActiveTabStyle(2)} onClick={() => this.selectTab(2)}><a href='#'>Gas</a></li> : null}
                </ul>
                <div>
                    {this.renderSelectedTender()}
                </div>
            </div>
        )
    }

    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderContent(error);
        }
        if(this.props.working || this.props.recommendations == null || this.props.details == null){
            var spinner = (<Spinner />);
            return this.renderContent(spinner);
        }
        if(this.props.recommendations.length == 0){
            var noTendersMessage = (<p>No tenders have been created for this portfolio yet. Visit the Tender tab to start the tendering process.</p>);
            return this.renderContent(noTendersMessage);
        }
        
        return this.renderContent(this.renderTabs());
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderRecommendationsViewProps> = (dispatch) => {
    return {
        getTenderRecommendations: (portfolioId: string) => dispatch(fetchTenderRecommendations(portfolioId)),
        selectTenderRecommendationsTab: (index: number) => dispatch(selectTenderRecommendationsTab(index))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderRecommendationsViewProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        recommendations: state.portfolio.tender.recommendations.value,
        working: state.portfolio.tender.recommendations.working || state.portfolio.details.working,
        error: state.portfolio.tender.recommendations.error,
        errorMessage: state.portfolio.tender.recommendations.errorMessage,
        selectedTab: state.view.portfolio.recommendations.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderRecommendationsView);