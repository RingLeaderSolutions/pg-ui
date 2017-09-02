import * as React from "react";
import Header from "../../common/Header";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioHistoryEntry } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import * as moment from 'moment';

import { getPortfolioHistory } from '../../../actions/portfolioActions';

interface PortfolioHistoryProps {
    portfolio: Portfolio;
}

interface StateProps {
  history: PortfolioHistoryEntry[];
  working: boolean;
}

interface DispatchProps {
    getPortfolioHistory: (portfolioId: string) => void;
}

class PortfolioHistory extends React.Component<PortfolioHistoryProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){   
        var { portfolio } = this.props;
        if(this.props.portfolio != null){
            this.props.getPortfolioHistory(portfolio.id);        
        }
    }

    createHistoryTable(){
        var historyRows = this.props.history
            .sort(
                (a, b) => {
                    if (a.created > b.created) return -1;
                    if (a.created < b.created) return 1;
                    return 0;
                })
            .map(h => {
                var time = moment.utc(h.created).local().fromNow();            
                return ( 
                    <tr>
                        <td>{time}</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                    </tr>
                );
        });

        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th className="uk-text-center">Time</th>
                        <th className="uk-text-center">Activity</th>
                        <th className="uk-text-center">Entries</th>
                        <th className="uk-text-center">Author</th>
                    </tr>
                </thead>
                <tbody>
                    {historyRows}
                </tbody>
            </table>
        );
    }

    render() {
        var content = (<Spinner hasMargin={true} />);
        if (!this.props.working && this.props.history != null) {
            content = this.createHistoryTable();
        }
        
        return (
            <div>
                <div className="uk-card uk-card-default uk-card-body">
                    <h4>Change History</h4>
                    <div className="portfolio-history">
                        {content}
                    </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioHistoryProps> = (dispatch) => {
    return {
        getPortfolioHistory: (portfolioId: string) => dispatch(getPortfolioHistory(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioHistoryProps> = (state: ApplicationState) => {
    return {
        history: state.portfolio.portfolio_history,
        working: state.portfolio.portfolio_history_working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioHistory);