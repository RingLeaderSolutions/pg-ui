import * as React from "react";
import Header from "../Header";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, MpanSummary } from '../../model/Models';
import Spinner from '../common/Spinner';

import { getPortfolioMpanSummary } from '../../actions/portfolioActions';

interface PortfolioMpanSummaryProps {
    portfolio: Portfolio;
}

interface StateProps {
  mpanSummary: MpanSummary[];
  working: boolean;
}

interface DispatchProps {
    getMpanSummary: (portfolioId: string) => void;
}

class PortfolioMpanSummary extends React.Component<PortfolioMpanSummaryProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){   
        var { portfolio } = this.props;
        if(this.props.portfolio != null){
            this.props.getMpanSummary(portfolio.id);        
        }
    }

    createSummaryTable(){
        var tableHeaders = this.props.mpanSummary.map(ms => {
            return (<th className="uk-text-center">{ms.stage}</th>)
        });

        var completeRow = this.props.mpanSummary.map(ms => {
            var cellClass = "uk-text-success";

            var complete = ms.completed;
            if(complete == 0){
                cellClass = "uk-text-danger";
            }

            return (<td className={cellClass}>{complete}</td>);
        });

        var incompleteRow = this.props.mpanSummary.map(ms => {
            var cellClass = "uk-text-danger";

            var incomplete = ms.incomplete;
            if(incomplete == 0){
                cellClass = "uk-text-success";
            }

            return (<td className={cellClass}>{incomplete}</td>);
        })

        return (
            <table className="uk-table uk-table-divider">
            <thead>
                <tr>
                    <th></th>
                    {tableHeaders}
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Incomplete</td>
                    {incompleteRow}
                </tr>
                <tr>
                    <td>Complete</td>
                    {completeRow}
                </tr>
            </tbody>
        </table>
        )
    }

    render() {
        var content = (<Spinner hasMargin={true}/>);
        if(!this.props.working && this.props.mpanSummary != null){
            content = this.createSummaryTable();
        }

        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h4>MPAN Status</h4>
                    {content}
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMpanSummaryProps> = (dispatch) => {
    return {
        getMpanSummary: (portfolioId: string) => dispatch(getPortfolioMpanSummary(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMpanSummaryProps> = (state: ApplicationState) => {
    return {
        mpanSummary: state.portfolio.portfolio_mpanSummary,
        working: state.portfolio.portfolio_mpanSummary_working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMpanSummary);