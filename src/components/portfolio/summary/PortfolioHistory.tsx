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
                    <tr key={h.id}>
                        <td>{time}</td>
                        <td>{h.category}</td>
                        <td>{h.entityType}</td>
                        <td>{h.description}</td>
                    </tr>
                );
        });

        return (
            <table className="uk-table uk-table-divider">
                <thead>
                    <tr>
                        <th className="uk-text-center">Time</th>
                        <th className="uk-text-center">Category</th>
                        <th className="uk-text-center">Type</th>
                        <th className="uk-text-center">Description</th>
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
                    <h4><span className="uk-margin-small-right" data-uk-icon="icon: history"></span>Change History</h4>
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
        history: state.portfolio.history.value,
        working: state.portfolio.history.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioHistory);