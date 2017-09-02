import * as React from "react";
import CounterCard from "../common/CounterCard";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getDashboardSummary } from '../../actions/dashboardActions';
import { ApplicationState } from '../../applicationState';
import { DashboardPortfolioSummary } from '../../model/Models';

interface SummaryProps {
}

interface StateProps {
    summary: DashboardPortfolioSummary;
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
        getSummary: () => dispatch(getDashboardSummary())
    };
};

const mapStateToProps: MapStateToProps<StateProps, SummaryProps> = (state: ApplicationState) => {
    return {
        summary: state.dashboard.summary.value,
        working: state.dashboard.summary.working
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(DashboardSummary);