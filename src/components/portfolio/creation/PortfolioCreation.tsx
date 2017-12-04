import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import ErrorMessage from '../../common/ErrorMessage';
import Spinner from '../../common/Spinner';
import { CompanyInfo } from '../../../model/Models';

import { createPortfolio } from '../../../actions/portfolioActions';

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;

    company: CompanyInfo;
    accountId: string;
  }
  
  interface DispatchProps {
      createPortfolio: (accountId: string, company: CompanyInfo) => void;
  }

class PortfolioCreation extends React.Component<DispatchProps & StateProps, {}> {
    componentDidMount(){
        this.props.createPortfolio(this.props.accountId, this.props.company);
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
                        <p>Creating portfolio (Step 2/2)...</p>
                        {frameContent}
                    </div>
                </div>
                <div className="uk-modal-footer"></div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        createPortfolio: (accountId: string, company: CompanyInfo) => dispatch(createPortfolio(accountId, company)),
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        working: state.portfolios.create.portfolio.working,
        error: state.portfolios.create.portfolio.error,
        errorMessage: state.portfolios.create.portfolio.errorMessage,

        accountId: state.portfolios.create.account.value,
        company: state.portfolios.create.company.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioCreation);