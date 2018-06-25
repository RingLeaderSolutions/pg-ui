import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';

import { selectCompanySearchMethod, selectManualMethod, clearAccountCreation } from '../../actions/hierarchyActions';
import { AccountCreationStage } from "../../model/app/AccountCreationStage";
import CompanySearch from "./CompanySearch";
import CreateAccountDialog from "./CreateAccountDialog";
import { closeModalDialog } from "../../actions/viewActions";


interface NewAccountDialogProps {    
}

interface StateProps {
    stage: AccountCreationStage;
}

interface DispatchProps {
    selectCompanySearchMethod: () => void;
    selectManualMethod: () => void;
    clearAccountCreation: () => void;
    closeModalDialog: () => void;
}

class NewAccountDialog extends React.Component<NewAccountDialogProps & StateProps & DispatchProps, {}> {
    constructor() {
        super();
        
        this.selectCompanySearch = this.selectCompanySearch.bind(this);
        this.selectManualMethod = this.selectManualMethod.bind(this);
        this.finishCreation = this.finishCreation.bind(this);
    }

    selectCompanySearch(event: any){
        event.preventDefault();
        this.props.selectCompanySearchMethod();
    }

    selectManualMethod(event: any){
        event.preventDefault();
        this.props.selectManualMethod();
    }

    finishCreation() {
        this.props.clearAccountCreation();
        this.props.closeModalDialog();
    }

    render() {
        switch(this.props.stage){
            case AccountCreationStage.CompanySearch:
                return (
                    <div className="new-account-dialog">
                        <CompanySearch />
                    </div>);
            case AccountCreationStage.EnterDetail:
                return (
                    <div className="new-account-dialog">
                        <CreateAccountDialog />
                    </div>);
            case AccountCreationStage.Creation:
                return (
                    <div className="uk-modal-body new-account-dialog">
                        <Spinner />
                    </div>);
            case AccountCreationStage.Complete:
                return (
                    <div className="new-account-dialog">
                        <div className="uk-modal-header">
                            <h2 className="uk-modal-title">New Prospect</h2>
                        </div>
                        <div className="uk-modal-body">
                            Your account has been created! Click below to exit this screen.
                        </div>
                        <div className="uk-modal-footer uk-text-right">
                            <button className="uk-button uk-button-primary" type="button" onClick={this.finishCreation}>Continue</button>
                        </div>
                    </div>);
        };

        return (
            <div className="new-account-dialog">
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Create Account</h2>
                </div>
                <div className="uk-modal-body create-account-dialog">
                    <div className="uk-margin">
                        <p>Select a way to create your account:</p>
                        <div className="uk-card uk-card-default uk-card-hover" onClick={this.selectCompanySearch}>
                            <div className="uk-card-header">
                                <div className="uk-grid-small uk-flex-middle" data-uk-grid>
                                    <div className="uk-width-auto">
                                        <img className="uk-border-circle" width="40" height="40" src={require('../../images/companies-house.jpg')} />
                                    </div>
                                    <div className="uk-width-expand">
                                        <h3 className="uk-card-title">Company Search</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-card-body">
                                <p>Search Companies House to retrieve information about a company. Requires the company's registration number.</p>
                            </div>
                        </div>
                        <div className="uk-card uk-card-default uk-card-hover uk-margin" onClick={this.selectManualMethod}>
                            <div className="uk-card-header">
                                <div className="uk-grid-small uk-flex-middle" data-uk-grid>
                                    <div className="uk-width-auto">
                                        <img className="uk-border-circle" width="40" height="40" src={require('../../images/manual-icon.png')} />
                                    </div>
                                    <div className="uk-width-expand">
                                        <h3 className="uk-card-title">Manual</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="uk-card-body">
                                <p>Enter the company's details manually.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Cancel</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, NewAccountDialogProps> = (dispatch) => {
    return {
        selectCompanySearchMethod: () => dispatch(selectCompanySearchMethod()),
        selectManualMethod: () => dispatch(selectManualMethod()),
        clearAccountCreation: () => dispatch(clearAccountCreation()),
        closeModalDialog: () => dispatch(closeModalDialog())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, NewAccountDialogProps> = (state: ApplicationState) => {
    return {
        stage: state.hierarchy.create_account.stage.stage,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(NewAccountDialog);