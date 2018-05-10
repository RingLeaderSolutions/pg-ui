import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import ErrorMessage from '../../common/ErrorMessage';
import Spinner from '../../common/Spinner';
import { CompanyInfo } from '../../../model/Models';

import { createAccountFromCompany } from '../../../actions/portfolioActions';

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;

    company: CompanyInfo;
  }
  
  interface DispatchProps {
    createAccountFromCompany: (company: CompanyInfo) => void;
  }

class AccountCreation extends React.Component<DispatchProps & StateProps, {}> {
    componentDidMount(){
        this.props.createAccountFromCompany(this.props.company);
    }

    render(){
        let frameContent;
        let creationInProgress = this.props.working;

        if(creationInProgress){
            frameContent = (<div><Spinner hasMargin={true} /></div>);
        }

        if(!creationInProgress && this.props.error){
            frameContent = (
                <ErrorMessage content={this.props.errorMessage} />
            )
        }

        return (
            <div>
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">New Prospect</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Creating portfolio (Step 1/2)...</p>
                        {frameContent}
                    </div>
                </div>
                <div className="uk-modal-footer"></div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        createAccountFromCompany: (company: CompanyInfo) => dispatch(createAccountFromCompany(company)),
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        working: state.portfolios.create.account.working,
        error: state.portfolios.create.account.error,
        errorMessage: state.portfolios.create.account.errorMessage,

        company: state.portfolios.create.company.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountCreation);