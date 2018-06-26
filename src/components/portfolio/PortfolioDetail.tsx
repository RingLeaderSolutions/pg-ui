import * as React from "react";
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, PortfolioDetails, ApplicationTab } from '../../model/Models';
import Spinner from '../common/Spinner';

import PortfolioSummary from "./summary/PortfolioSummary";
import PortfolioUploads from "./upload/PortfolioUploads";
import PortfolioMeters from "./mpan/PortfolioMeters";

import { getSinglePortfolio, getPortfolioDetails } from '../../actions/portfolioActions';
import TenderSummary from "./tender/TenderSummary";
import { Link } from "react-router-dom";
import { selectPortfolioTab } from "../../actions/viewActions";
import { selectApplicationTab } from "../../actions/viewActions";

interface PortfolioDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolio: Portfolio;
  detail: PortfolioDetails;
  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface DispatchProps {
    getPortfolio: (portfolioId: string) => void;
    getPortfolioDetails: (portfolioId: string) => void;
    selectPortfolioTab: (index: number) => void;
    selectApplicationTab: (tab: ApplicationTab) => void;
}

class PortfolioDetail extends React.Component<PortfolioDetailProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.selectApplicationTab(ApplicationTab.Portfolios);
        var portfolioId = this.props.location.pathname.split('/')[2];        
        this.props.getPortfolio(portfolioId);
        this.props.getPortfolioDetails(portfolioId);
    }

    selectTab(index: number){
        this.props.selectPortfolioTab(index);
    }

    renderContent(){
        var { portfolio, detail, selectedTab } = this.props;

        switch(selectedTab){
            case 0:
                return (<PortfolioSummary portfolio={portfolio} detail={detail}/>);
            case 1:
                return (<PortfolioMeters portfolio={portfolio}/>);
            case 2:
                return (<TenderSummary portfolio={portfolio}/>);
            case 3:
                return (<PortfolioUploads portfolio={portfolio} />);
        }
    }

    renderActiveTabStyle(index: number){
        return this.props.selectedTab == index ? "uk-active" : null;
    }

    render() {
        
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.portfolio == null){
            return (<Spinner />);
        }
        console.log('portfoliodetail rendered for ' + this.props.portfolio.id);
        var { portfolio, detail } = this.props;
        var headerTitle = `Portfolio: ${portfolio.title}`;
        var accountLink = `/account/${detail.portfolio.accountId}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle}>
                    <Link to={accountLink}><button className='uk-button uk-button-default uk-button-small'><span data-uk-icon='icon: link' /> Jump to Account</button></Link>
                </Header>
                <ul className="uk-tab">
                    <li className={this.renderActiveTabStyle(0)} onClick={() => this.selectTab(0)}><a href="#">Summary</a></li>
                    <li className={this.renderActiveTabStyle(1)} onClick={() => this.selectTab(1)}><a href="#">Meters</a></li>
                    <li className={this.renderActiveTabStyle(2)} onClick={() => this.selectTab(2)}><a href="#">Tenders</a></li>
                    <li className={this.renderActiveTabStyle(3)} onClick={() => this.selectTab(3)}><a href="#">Uploads</a></li>
                </ul>
            
                <div className="restrict-height-hack">
                    {this.renderContent()}
                </div>
                {/* <ul className="uk-switcher restrict-height-hack">
                    <li><PortfolioSummary portfolio={portfolio} detail={detail}/></li>
                    <li className="restrict-height-hack"><PortfolioMeters portfolio={portfolio}/></li>
                    <li><TenderSummary portfolio={portfolio}/></li>
                    <li><PortfolioUploads portfolio={portfolio} /></li>
                </ul> */}
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioDetailProps> = (dispatch) => {
    return {
        getPortfolio: (portfolioId: string) => dispatch(getSinglePortfolio(portfolioId)),   
        getPortfolioDetails: (portfolioId: string) => dispatch(getPortfolioDetails(portfolioId)),
        selectPortfolioTab: (index: number) => dispatch(selectPortfolioTab(index)),
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDetailProps> = (state: ApplicationState) => {
    return {
        portfolio: state.portfolio.selected.value,
        detail: state.portfolio.details.value,
        working: state.portfolio.selected.working || state.portfolio.details.working,
        error: state.portfolio.selected.error || state.portfolio.details.error,
        errorMessage: state.portfolio.selected.errorMessage || state.portfolio.details.errorMessage,

        selectedTab: state.view.portfolio.selectedIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail);