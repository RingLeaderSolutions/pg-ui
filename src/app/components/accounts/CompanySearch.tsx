import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import ErrorMessage from '../common/ErrorMessage';
import Spinner from '../common/Spinner';
import { CompanyInfo } from '../../model/Models';

import { searchCompany, clearCompany, selectCompany } from '../../actions/hierarchyActions';

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    company: CompanyInfo;
  }
  
  interface DispatchProps {
      searchCompany: (number: string) => void;
      clearCompany: () => void;
      continueOnboarding: () => void;
  }

interface CompanySearchState {
    registrationNumber: string;
}

class CompanySearch extends React.Component<DispatchProps & StateProps, CompanySearchState> {
    constructor(props: StateProps & DispatchProps) {
        super(props);
        this.state = {
            registrationNumber: ''
        }

        this.searchCompany = this.searchCompany.bind(this);
        this.clearCompany = this.clearCompany.bind(this);
        this.onboard = this.onboard.bind(this);
    }
    searchCompany(event: any) {
        event.preventDefault();

        const number = this.state.registrationNumber.trim();
        this.props.searchCompany(number);
    }

    clearCompany(event: any){
        event.preventDefault();
        this.props.clearCompany();
    }

    onboard(event: any){
        event.preventDefault();
        this.props.continueOnboarding();
    }

    updateRegistrationNumber(ev: any){
        var reg = ev.target.value;
        this.setState({
            ...this.state,
            registrationNumber: reg
        });
    }

    render(){
        let frameContent;
        let actionContent = (
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-margin-right" type="button" disabled><i className="fa fa-eraser uk-margin-small-right"></i>Clear search</button>
                <button className="uk-button uk-button-primary" type="button" disabled><i className="fa fa-arrow-circle-right uk-margin-small-right"></i>Continue</button>
            </div>
        );

        let searchInProgress = this.props.working;

        if(searchInProgress){
            frameContent = (<div><Spinner /></div>);
        }

        if(!searchInProgress && this.props.error){
            frameContent = (
                <ErrorMessage content={this.props.errorMessage} />
            )
        }

        let foundCompany = this.props.company;
        if(!searchInProgress && foundCompany){
            frameContent = (
                <div>
                    <div className="uk-grid uk-grid-small uk-child-width-1-2@s" data-uk-grid>
                        <div>Company Name</div>
                        <div>{foundCompany.companyName}</div>
                        <div>Registration Number</div>
                        <div>{foundCompany.companyNumber}</div>
                        <div>Status</div>
                        <div>{foundCompany.companyStatus}</div>
                        <div>Incorporation Date</div>
                        <div>{foundCompany.incorporationDate}</div>
                        <div>Registered Address</div>
                        <div>
                            <div>{foundCompany.addressLine1}</div>
                            <div>{foundCompany.addressLine2}</div>
                            <div>{foundCompany.postTown}</div>
                            <div>{foundCompany.county}</div>
                            <div>{foundCompany.countryOfOrigin}</div>
                            <div>{foundCompany.postcode}</div>
                        </div>
                    </div>
                    <hr />
                    <p>If this is the company you were looking for, click the <i>Continue</i> button below.</p>
                </div>
            );

            actionContent = (
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={this.clearCompany}><i className="fa fa-eraser uk-margin-small-right"></i>Clear search</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={this.onboard}><i className="fa fa-arrow-circle-right uk-margin-small-right"></i>Continue</button>
                </div>
            )
        }

        var canSearch = this.state.registrationNumber.length > 0;
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fa fa-search uk-margin-right"></i>Search Company</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Enter the company registration number and press the search button to find the prospect to onboard.</p>

                        <div className="uk-grid-small" data-uk-grid>
                            <div className="uk-width-expand@s">
                                <div className="uk-inline">
                                    <span className="uk-form-icon" data-uk-icon="icon: world"></span>
                                    <input id="registrationNumber" className="uk-input" type="input" placeholder="Registration Number" value={this.state.registrationNumber} onChange={e => this.updateRegistrationNumber(e)} />
                                </div>
                            </div>
                            <div className="uk-width-auto@s">
                                <button className="uk-button uk-button-primary" type="button" onClick={this.searchCompany} disabled={!canSearch}>
                                    <i className="fa fa-search uk-margin-small-right fa-lg"></i>
                                    Search
                                </button>
                            </div>
                        </div>

                        <hr />
                            {frameContent}
                    </div>
                </div>
                {actionContent}
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        searchCompany: (number: string) => dispatch(searchCompany(number)),
        clearCompany: () => dispatch(clearCompany()),
        continueOnboarding: () => dispatch(selectCompany())
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        working: state.hierarchy.create_account.company.working,
        error: state.hierarchy.create_account.company.error,
        errorMessage: state.hierarchy.create_account.company.errorMessage,
        company: state.hierarchy.create_account.company.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CompanySearch);