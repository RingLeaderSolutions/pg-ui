import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { PortfolioDetails, 
         PortfolioRequirements,
         AccountCompanyStatusFlags,
         Account
} from '../../../model/Models';

import Spinner from '../../common/Spinner';

import { updateCompanyStatus, retrieveAccount } from '../../../actions/portfolioActions';

interface PortfolioCompanyStatusProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
  account: Account;
}

interface DispatchProps {
    updateCompanyStatus: (accountId: string, accountCompanyStatus: AccountCompanyStatusFlags) => void;
    retrieveAccount: (accountId: string) => void;
}

class PortfolioCompanyStatus extends React.Component<PortfolioCompanyStatusProps & StateProps & DispatchProps, {}> {
    constructor(){
        super();
        this.saveCompanyStatus = this.saveCompanyStatus.bind(this);
    }

    registeredCharity: HTMLInputElement;
    cclException: HTMLInputElement;
    vatStatus: HTMLInputElement;
    fitException: HTMLInputElement;

    componentDidMount(){
        let { accountId } = this.props.details.portfolio;
        this.props.retrieveAccount(accountId);
    }

    saveCompanyStatus(){
        var status: AccountCompanyStatusFlags = {
            hasCCLException: this.cclException.checked,
            isRegisteredCharity: this.registeredCharity.checked,
            isVATEligible: this.vatStatus.checked,
            hasFiTException: this.fitException.checked,
        };

        this.props.updateCompanyStatus(this.props.details.portfolio.accountId, status);
    }

    render() {
        let { account } = this.props;
        let cardContent = null;
        if(this.props.error){
            cardContent = (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            cardContent = (<Spinner hasMargin={true} />);
        }
        if(!this.props.working && !this.props.error && account != null){
            cardContent = (
                <form>
                    <fieldset className="uk-fieldset">
                        <h3>Company Status</h3>
                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" ref={ref => this.registeredCharity = ref} defaultChecked={account.isRegisteredCharity} /> Registered Charity</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" ref={ref => this.cclException = ref} defaultChecked={account.hasCCLException}/> CCL Exception</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" ref={ref => this.vatStatus = ref} defaultChecked={account.isVATEligible}/> VAT Status</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" ref={ref => this.fitException = ref} defaultChecked={account.hasFiTException}/> FiT Exception</label>
                        </div>
                        <div className="uk-margin-small uk-float-right">
                        <button className="uk-button uk-button-primary" type="button" onClick={this.saveCompanyStatus}>
                            <span className="uk-margin-small-right icon-standard-cursor"  data-uk-icon="icon: cog" />
                            Update
                        </button>
                        </div>
                    </fieldset>
                </form>);
        }

        return (
            <div className="uk-card uk-card-default uk-card-body">
                {cardContent}
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioCompanyStatusProps> = (dispatch) => {
    return {
        retrieveAccount: (accountId: string) => dispatch(retrieveAccount(accountId)),
        updateCompanyStatus: (accountId: string, accountCompanyStatus: AccountCompanyStatusFlags) => dispatch(updateCompanyStatus(accountId, accountCompanyStatus))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioCompanyStatusProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.account.working,
        error: state.portfolio.account.error,
        errorMessage: state.portfolio.account.errorMessage,

        account: state.portfolio.account.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioCompanyStatus);