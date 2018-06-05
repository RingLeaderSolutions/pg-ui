import * as React from "react";
import { Link } from "react-router-dom";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { retrieveAccounts } from '../../actions/hierarchyActions';
import { ApplicationState } from '../../applicationState';
import Header from "../common/Header";
import ErrorMessage from "../common/ErrorMessage";
import { Account } from '../../model/Models';
import Spinner from '../common/Spinner';
import NewAccountDialog from "./NewAccountDialog";

interface AccountsProps extends RouteComponentProps<void> {
}

interface StateProps {
  accounts: Account[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
  retrieveAccounts: () => void;
}

class Accounts extends React.Component<AccountsProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.retrieveAccounts();
    }

    renderBooleanValue(value: boolean){
        if(value){
            return (<span data-uk-icon="icon: check"></span>)
        }
        return (<span data-uk-icon="icon: close"></span>)        
    }
    render() {
        var tableContent;
        
        if(this.props.error){
            tableContent = (<tr><td colSpan={9}><ErrorMessage content={this.props.errorMessage}/></td></tr>);
        }
        else if(this.props.working){
            tableContent =  (<tr><td colSpan={9}><Spinner /></td></tr>);
        }
        else if(this.props.accounts == null || this.props.accounts.length == 0){
            tableContent =  (<tr><td colSpan={9}><p className="table-warning">There are no accounts. Create one using the button above!</p></td></tr>)
        }
        else {
            tableContent = this.props.accounts
            .sort(
                (acc1: Account, acc2: Account) => {        
                    if (acc1.companyName < acc2.companyName) return -1;
                    if (acc1.companyName > acc2.companyName) return 1;
                    return 0;
                })
            .map(account => {
                var link = { pathname: `/account/${account.id}`, state: { accountId: account.id }};

                return (
                    <tr key={account.id}>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.companyName}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.companyRegistrationNumber}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.countryOfOrigin}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.postcode}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.incorporationDate}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.companyStatus}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{account.creditRating}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{this.renderBooleanValue(account.isRegisteredCharity)}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{this.renderBooleanValue(account.hasCCLException)}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{this.renderBooleanValue(account.isVATEligible)}</Link></td>
                        <td className="uk-table-link"><Link to={link} className="uk-link-reset">{this.renderBooleanValue(account.hasFiTException)}</Link></td>
                    </tr>
                );
            });
        }

        return (
            <div className="content-inner">
                <Header title="Accounts" />
                <div className="content-accounts">
                    <div className="table-accounts">
                        <div className="search-accounts">
                            <form className="uk-search uk-search-default">
                                <span data-uk-search-icon="search"></span>
                                <input className="uk-search-input" type="search" placeholder="Search..." disabled/>
                            </form>
                            <div className="actions-accounts">
                                <button className="uk-button uk-button-primary" data-uk-toggle="target: #modal-new-account">
                                    <span className="uk-margin-small-right" data-uk-icon="plus-circle"></span>
                                    New account
                                </button>
                            </div>
                        </div>
                        <div className="container-table-accounts">
                            <table className="uk-table uk-table-divider uk-table-hover">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Reg No.</th>
                                        <th>Country</th>
                                        <th>Postcode</th>
                                        <th>Incorporation Date</th>
                                        <th>Status</th>
                                        <th>Credit Rating</th>
                                        <th>Reg Charity</th>
                                        <th>CCL Exception</th>
                                        <th>VAT Eligible</th>
                                        <th>FiT Exception</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableContent}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div id="modal-new-account" data-uk-modal="center: true">
                    <NewAccountDialog />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountsProps> = (dispatch) => {
  return {
    retrieveAccounts: () => dispatch(retrieveAccounts()),
  };
};

const mapStateToProps: MapStateToProps<StateProps, AccountsProps> = (state: ApplicationState) => {
  return {
    accounts: state.hierarchy.accounts.value,
    working: state.hierarchy.accounts.working,
    error: state.hierarchy.accounts.error,
    errorMessage: state.hierarchy.accounts.errorMessage
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);