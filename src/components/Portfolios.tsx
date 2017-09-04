import * as React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { getAllPortfolios } from '../actions/portfolioActions';
import { ApplicationState } from '../applicationState';
import Header from "./common/Header";
import ErrorMessage from "./common/ErrorMessage";
import { Portfolio } from '../model/Models';
import NewPortfolioDialog from './portfolio/NewPortfolioDialog';
import Spinner from './common/Spinner';

interface PortfoliosProps extends RouteComponentProps<void> {
}

interface StateProps {
  portfolios: Portfolio[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
  getPortfolios: () => void;
}

class Portfolios extends React.Component<PortfoliosProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getPortfolios();
    }

    render() {
        var tableContent;
        
        if(this.props.error){
            tableContent = (<tr><td colSpan={9}><ErrorMessage errorMessage={this.props.errorMessage}/></td></tr>);
        }
        else if(this.props.working){
            tableContent =  (<tr><td colSpan={9}><Spinner /></td></tr>);
        }
        else if(this.props.portfolios == null || this.props.portfolios.length == 0){
            tableContent =  (<tr><td colSpan={9}><p className="table-warning">There are no portfolios for this team yet. You can create one using the "New Portfolio" button above!</p></td></tr>)
        }
        else {
            tableContent = this.props.portfolios.map(portfolio => {
                var link = { pathname: `/portfolio/${portfolio.id}`, state: { portfolioId: portfolio.id }};
                var hasSalesLead = portfolio.salesLead != null;
                var hasSupportOwner = portfolio.supportExec != null;
                var noUser = (<p style={ { margin: '0px' } }>None</p>);

                var salesLead = hasSalesLead ? 
                    (<div className="user">
                        <img className="avatar" src={portfolio.salesLead.avatarUrl} />
                        <p>{portfolio.salesLead.firstName} {portfolio.salesLead.lastName}</p>
                    </div>) : noUser;

                var supportOwner = hasSupportOwner ? 
                    (<div className="user">
                        <img className="avatar" src={portfolio.supportExec.avatarUrl} />
                        <p>{portfolio.supportExec.firstName} {portfolio.supportExec.lastName}</p>
                    </div>) : noUser;

                return (
                    <tr key={portfolio.id}>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.title}</Link></td>
                        <td className="uk-table-link">
                            <Link to={link} className="uk-link-reset">
                                {/* <div className="circle circle-orange" />< */}
                                {portfolio.status}
                            </Link>
                        </td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{salesLead}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{supportOwner}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.contractStart}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.contractEnd}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.accounts}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.sites}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{portfolio.mpans}</Link></td>
                    </tr>
                );
            });
        }

        return (
            <div className="content-inner">
                <Header title="Portfolios" />
                <div className="content-portfolios">
                    <div className="filters-portfolios">
                        <ul className="uk-tab-right" data-uk-tab>
                            <li><a>All Portfolios</a></li>
                            <li><a><div className="circle circle-grey" /><p>Qualified</p></a></li>
                            <li><a><div className="circle circle-blue" /><p>Indicative Pricing Only</p></a></li>
                            <li><a><div className="circle circle-orange" /><p>Proposal</p></a></li>
                            <li><a><div className="circle circle-green" /><p>Priced</p></a></li>
                        </ul>
                    </div>
                    <div className="table-portfolios">
                        <div className="search-portfolios">
                            <form className="uk-search uk-search-default">
                                {/*<span className="uk-search-icon-flip" data-uk-search-icon></span>*/}
                                <input className="uk-search-input" type="search" placeholder="Search..." />
                            </form>
                            <div className="actions-portfolios">
                                <button className="uk-button uk-button-primary" data-uk-toggle="target: #modal-new-portfolio">New portfolio</button>
                            </div>
                        </div>
                        <div className="container-table-portfolios">
                            <table className="uk-table uk-table-divider uk-table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Status</th>
                                        <th>Sales Lead</th>
                                        <th>Support Executive</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Accounts</th>
                                        <th>Sites</th>
                                        <th>MPANs</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div id="modal-new-portfolio" data-uk-modal="center: true">
                    <NewPortfolioDialog />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfoliosProps> = (dispatch) => {
  return {
    getPortfolios: () => dispatch(getAllPortfolios())
  };
};

const mapStateToProps: MapStateToProps<StateProps, PortfoliosProps> = (state: ApplicationState) => {
  return {
    portfolios: state.portfolios.value,
    working: state.portfolios.working,
    error: state.portfolios.error,
    errorMessage: state.portfolios.errorMessage
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolios);