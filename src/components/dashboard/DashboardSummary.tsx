import * as React from "react";
import Header from "../Header";
import CounterCard from "../common/CounterCard";
import Spinner from "../common/Spinner";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getPortfoliosSummary } from '../../actions/portfolioActions';
import { ApplicationState } from '../../applicationState';
import { PortfoliosSummary } from '../../model/Models';

interface SummaryProps {
}

interface StateProps {
    summary: PortfoliosSummary;
    working: boolean;
}

interface DispatchProps {
    getSummary: () => void;
}

class DashboardSummary extends React.Component<SummaryProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getSummary();
    }
    render() {
        var portfolioCount, siteCount, mpanCount = "";
        console.log(this.props.working);
        if(!this.props.working){
            portfolioCount = String(this.props.summary.portfolioCount);
            siteCount = String(this.props.summary.siteCount);
            mpanCount = String(this.props.summary.mpanCount);
        }
        
        return (
            <div className="uk-child-width-expand@s uk-text-center uk-grid" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                <CounterCard title={portfolioCount} loaded={!this.props.working} label="Total Portfolios" />
                <CounterCard title={siteCount} loaded={!this.props.working} label="Total Sites" />
                <CounterCard title={mpanCount} loaded={!this.props.working} label="Total MPANs" />
                <CounterCard title="TPI" label="Your Team" />
            </div>)
        }
    }

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, SummaryProps> = (dispatch) => {
    return {
        getSummary: () => dispatch(getPortfoliosSummary())
    };
};

const mapStateToProps: MapStateToProps<StateProps, SummaryProps> = (state: ApplicationState) => {
    return {
        summary: state.portfolio.summary,
        working: state.portfolio.summary_working
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);