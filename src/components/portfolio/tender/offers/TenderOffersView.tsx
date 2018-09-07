import * as React from "react";
import ErrorMessage from "../../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../../model/Models';
import Spinner from '../../../common/Spinner';

import { fetchTenderOffers } from '../../../../actions/tenderActions';
import { Tender } from "../../../../model/Tender";
import { selectTenderOffersTab } from "../../../../actions/viewActions";
import TenderOffersTable from "./TenderOffersTable";

interface TenderOffersViewProps {
    portfolio: Portfolio;
}

interface StateProps {
  details: PortfolioDetails;
  offers: Tender[];
  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface TenderOffersViewState {
    tenderMap: Map<number, Tender>;
}

interface DispatchProps {
    getTenderOffers: (portfolioId: string) => void;
    selectTenderOffersTab: (index: number) => void;
}

class TenderOffersView extends React.Component<TenderOffersViewProps & StateProps & DispatchProps, TenderOffersViewState> {
    constructor(){
        super();
        this.state = {
            tenderMap: new Map<number, Tender>()
        }
    }

    componentDidMount(){
        let portfolioId = this.props.portfolio.id;     
        this.props.getTenderOffers(portfolioId);
    }

    componentWillReceiveProps(nextProps: TenderOffersViewProps & StateProps & DispatchProps){
        if(nextProps.portfolio.id != this.props.portfolio.id){
            this.props.getTenderOffers(nextProps.portfolio.id);
        }

        var hh = nextProps.offers.find(o => o.halfHourly && o.utility == "ELECTRICITY");
        var nhh = nextProps.offers.find(o => !o.halfHourly && o.utility == "ELECTRICITY");
        var gas = nextProps.offers.find(o => o.utility == "GAS");

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
                    this.props.selectTenderOffersTab(key);
                    break;
                }
            }
        }
    }

    renderContent(content: any){
        return (
            <div className="content-offers">
                {content}
            </div>
        )
    }
    
    selectTab(index: number){
        this.props.selectTenderOffersTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTender(){
        var intendedTender = this.state.tenderMap.get(this.props.selectedTab);
        if(intendedTender == null){
            return (<ErrorMessage content="Error rendering this component" />)
        }

        return (<TenderOffersTable tender={intendedTender} />);
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
            <div className="content-offers">
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
        if(this.props.working || this.props.offers == null || this.props.details == null){
            var spinner = (<Spinner />);
            return this.renderContent(spinner);
        }
        if(this.props.offers.length == 0){
            var noTendersMessage = (<p>No tenders have been added for this portfolio yet. Visit the Tender tab to start the tendering process.</p>);
            return this.renderContent(noTendersMessage);
        }
        
        var offerTabs = this.renderTabs();
        return this.renderContent(offerTabs);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderOffersViewProps> = (dispatch) => {
    return {
        getTenderOffers: (portfolioId: string) => dispatch(fetchTenderOffers(portfolioId)),
        selectTenderOffersTab: (index: number) => dispatch(selectTenderOffersTab(index))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderOffersViewProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        offers: state.portfolio.tender.offers.value,
        working: state.portfolio.tender.offers.working || state.portfolio.details.working,
        error: state.portfolio.tender.offers.error,
        errorMessage: state.portfolio.tender.offers.errorMessage,
        selectedTab: state.view.portfolio.offers.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderOffersView);