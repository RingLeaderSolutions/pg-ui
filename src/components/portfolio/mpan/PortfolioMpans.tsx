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
        return (
            <div className="content-inner-portfolio">
                {this.props.sites.map(site => {
                    return site.mpans.map(mp => {
                        return (<p key={mp.id}>{mp.mpanCore}</p>);
                    }
                    );
                })}
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