import * as React from "react";
import Header from "../common/Header";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio } from '../../model/Models';
import Spinner from '../common/Spinner';

import PortfolioSummary from "./summary/PortfolioSummary";
import PortfolioUploads from "./upload/PortfolioUploads";

import { getSinglePortfolio } from '../../actions/portfolioActions';

interface PortfolioDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolio: Portfolio;
  working: boolean;
}

interface DispatchProps {
    getPortfolio: (portfolioId: string) => void;
}

class PortfolioDetail extends React.Component<PortfolioDetailProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        var portfolioId = this.props.location.pathname.split('/')[2];        
        this.props.getPortfolio(portfolioId);
    }

    render() {
        if(this.props.working || this.props.portfolio == null){
            return (<Spinner />);
        }
        var { portfolio } = this.props;
        var headerTitle = `Portfolios: ${portfolio.title}`;
        return (
            <div className="content-inner">
                <Header title={headerTitle} />
                <ul data-uk-tab>
                    <li className="uk-active"><a href="#">Summary</a></li>
                    <li><a href="#">MPANs</a></li>
                    <li><a href="#">Forecast</a></li>
                    <li><a href="#">Quotes</a></li>
                    <li><a href="#">Uploads</a></li>
                </ul>
                <ul className="uk-switcher">
                    <li><PortfolioSummary portfolio={portfolio}/></li>
                    <li>MPANs tab not yet built.</li>
                    <li>Forecast tab not yet built.</li>
                    <li>Quotes tab not yet built.</li>
                    <li><PortfolioUploads /></li>
                </ul>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioDetailProps> = (dispatch) => {
    return {
        getPortfolio: (portfolioId: string) => dispatch(getSinglePortfolio(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDetailProps> = (state: ApplicationState) => {
    return {
        portfolio: state.portfolio.selected.value,
        working: state.portfolio.selected.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail);