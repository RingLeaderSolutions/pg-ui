import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, Site, MpanDocument } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';

import { getPortfolioSiteMpans } from '../../../actions/portfolioActions';

interface PortfolioMetersProps {
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

class PortfolioMeters extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.getSitesAndMpans(this.props.portfolio.id);
        }
    }

    renderDocumentAction(document: MpanDocument, isTopline: boolean = false){
        if(document == null){
            return (<span data-uk-icon="icon: close" style={{ "color" : "red"}}/>);
        }
        var prefix = isTopline ? "topline" : "historical";

        var link = `/${prefix}/${document.documentId}`;
        return (
            <Link to={link}>
                <span data-uk-icon="icon: check"  style={{ "color" : "green"}}/>
            </Link>);
    }

    render() {
        if(this.props.working || this.props.sites == null){
            return (<Spinner />);
        }

        var content = this.props.sites.map((site,index) => {
            var mpanRows = site.mpans.map(mp => {
                return (
                    <tr key={mp.id}>
                        <td></td>
                        <td>{mp.mpanCore}</td>
                        <td className="uk-text-center">{this.renderDocumentAction(mp.proposedTopline, true)}</td>
                        <td className="uk-text-center">{this.renderDocumentAction(mp.currentTopline, true)}</td>
                        <td className="uk-text-center">{this.renderDocumentAction(mp.proposedHistorical)}</td>
                        <td className="uk-text-center">{this.renderDocumentAction(mp.currentHistorical)}</td>
                    </tr>
                );
                }
            );

            return (
                <tbody key={index}>
                    <tr>
                        <td colSpan={6}>{site.name}</td>
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
                                    <th className="uk-text-center">Topline (Proposed)</th>
                                    <th className="uk-text-center">Topline (Current)</th>
                                    <th className="uk-text-center">HH Data (Proposed)</th>
                                    <th className="uk-text-center">HH Data (Current)</th>
                                </tr>
                            </thead>
                            {content}
                        </table>
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMetersProps> = (dispatch) => {
    return {
        getSitesAndMpans: (portfolioId: string) => dispatch(getPortfolioSiteMpans(portfolioId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        sites: state.portfolio.sites.value,
        working: state.portfolio.sites.working,
        error: state.portfolio.sites.error,
        errorMessage: state.portfolio.sites.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);