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

interface TenderRecommendationsViewState {
    tenderMap: Map<number, Tender>;
}

interface DispatchProps {
    getTenderRecommendations: (portfolioId: string) => void;
    selectTenderRecommendationsTab: (index: number) => void;
}

class TenderRecommendationsView extends React.Component<TenderRecommendationsViewProps & StateProps & DispatchProps, TenderRecommendationsViewState> {
    constructor(){
        super();
        this.state = {
            tenderMap: new Map<number, Tender>()
        }
    }

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

        var tenderMap = new Map<number, Tender>();
        tenderMap.set(0, hh);
        tenderMap.set(1, nhh);
        tenderMap.set(2, gas);

        this.setState({
            tenderMap
        });

        var intendedTender = tenderMap.get(this.props.selectedTab);
        if(intendedTender == null){
            for (var [key, value] of tenderMap.entries()){
                if(value){
                    // reset the tab to the first one we find
                    this.props.selectTenderRecommendationsTab(key);
                    break;
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
        var intendedTender = this.state.tenderMap.get(this.props.selectedTab);
        if(intendedTender == null){
            return (<ErrorMessage content="Error rendering this component" />)
        }

        return (<TenderRecommendationsList tender={intendedTender}/>)
    }

    getTenderTabTitle(tender: Tender){
        switch(tender.utility){
            case "ELECTRICITY":
                var elecIcon = (<i className="fa fa-bolt uk-margin-small-right fa-lg"></i>);
                var clockIcon = (<i className="fa fa-clock uk-margin-small-right fa-lg"></i>);

                var title =  tender.halfHourly ? "Electricity (HH)" : "Electricity (NHH)";
                return (<div>{elecIcon}{tender.halfHourly ? clockIcon : null}{title}</div>);
            case "GAS":
                return (<div><i className="fa fa-fire uk-margin-small-right fa-lg"></i>Gas</div>);
        }
    }

    renderTabs(){
        var tabs = []
        for(let i = 0; i < 3; i++){
            let tender = this.state.tenderMap.get(i);

            if(tender != null) {
                let tab = (<li key={i} className={this.renderActiveTabStyle(i)} onClick={() => this.selectTab(i)}><a href='#'>{this.getTenderTabTitle(tender)}</a></li>);
                tabs.push(tab);
            }
        }

        return (
            <div className="content-tenders">
                <ul className="uk-tab">
                    {tabs}
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
            var noTendersMessage = (<p>No tenders have been added for this portfolio yet. Visit the Tender tab to start the tendering process.</p>);
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