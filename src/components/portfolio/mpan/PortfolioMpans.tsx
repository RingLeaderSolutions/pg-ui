import * as React from "react";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, Site } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { getPortfolioSiteMpans } from '../../../actions/portfolioActions';

interface PortfolioMpansProps {
    portfolio: Portfolio;
}

interface StateProps {
  sites: Site[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    getSitesAndMpans: (portfolioId: string) => void;
}

class PortfolioMpans extends React.Component<PortfolioMpansProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.getSitesAndMpans(this.props.portfolio.id);
        }
    }

    render() {
        if(this.props.working || this.props.portfolio == null){
            return (<Spinner />);
        }
        var content = this.props.sites.map(site => {
            var mpanRows = site.mpans.map(mp => {
                return (
                    <tr>
                        <td></td>
                        <td>{mp.mpanCore}</td>
                        <td></td>
                        <td></td>
                    </tr>
                );
                }
            );

            return(<tbody>
                    <tr>
                        <td colSpan={4}>{site.name}</td>
                    </tr>
                    {mpanRows}
                </tbody>)
        });

        return (
            <div className="content-inner-portfolio">
                <div className="table-mpans">
                    <div className="search-mpans">
                        <form className="uk-search uk-search-default">
                            <span data-uk-search-icon="search"></span>
                            <input className="uk-search-input" type="search" placeholder="Search..." />
                        </form>
                    </div>
                    <div>
                        <table className="uk-table uk-table-divider">
                            <thead>
                                <tr>
                                    <th>Site</th>
                                    <th>Mpan Core</th>
                                    <th>Topline</th>
                                    <th>HH Data</th>
                                </tr>
                            </thead>
                            {content}
                        </table>
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMpansProps> = (dispatch) => {
    return {
        getSitesAndMpans: (portfolioId: string) => dispatch(getPortfolioSiteMpans(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMpansProps> = (state: ApplicationState) => {
    return {
        sites: state.portfolio.sites.value,
        working: state.portfolio.sites.working,
        error: state.portfolio.sites.error,
        errorMessage: state.portfolio.sites.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMpans);