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

interface DispatchProps {
    getTenderOffers: (portfolioId: string) => void;
    selectTenderOffersTab: (index: number) => void;
}

class TenderOffersView extends React.Component<TenderOffersViewProps & StateProps & DispatchProps, {}> {
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

        var map = new Map<number, Tender>();
        map.set(0, hh);
        map.set(1, nhh);
        map.set(2, gas);

        var intendedTender = map.get(this.props.selectedTab);
        if(intendedTender == null){
            for (var [key, value] of map.entries()){
                if(value){
                    console.log('resetting tab to ' + key)
                    this.props.selectTenderOffersTab(key);
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
        this.props.selectTenderOffersTab(index);
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    renderSelectedTender(){
        var hh = this.props.offers.find(o => o.halfHourly && o.utility == "ELECTRICITY");
        var nhh = this.props.offers.find(o => !o.halfHourly && o.utility == "ELECTRICITY");
        var gas = this.props.offers.find(o => o.utility == "GAS");

        var map = new Map<number, Tender>();
        map.set(0, hh);
        map.set(1, nhh);
        map.set(2, gas);

        var intendedTender = map.get(this.props.selectedTab);
        if(intendedTender == null){
            return (<ErrorMessage content="Error rendering this component" />)
        }

        return (<TenderOffersTable tender={intendedTender} />);
    }

    renderTabs(){
        var hasHH = this.props.offers.find(o => o.halfHourly && o.utility == "ELECTRICITY") != null;
        var hasNHH = this.props.offers.find(o => !o.halfHourly && o.utility == "ELECTRICITY") != null;
        var hasGas = this.props.offers.find(o => o.utility == "GAS") != null;
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
        if(this.props.working || this.props.offers == null || this.props.details == null){
            var spinner = (<Spinner />);
            return this.renderContent(spinner);
        }
        if(this.props.offers.length == 0){
            var noTendersMessage = (<p>No tenders have been created for this portfolio yet. Visit the Tender tab to start the tendering process.</p>);
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