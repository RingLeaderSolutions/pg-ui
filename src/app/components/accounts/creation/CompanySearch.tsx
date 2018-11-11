import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import ErrorMessage from '../../common/ErrorMessage';
import { CompanyInfo } from '../../../model/Models';

import { searchCompany, clearCompany, selectCompany, clearAccountCreation } from '../../../actions/hierarchyActions';
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { ModalHeader, ModalBody, Form, InputGroup, InputGroupAddon, InputGroupText, Input, Button, ModalFooter } from "reactstrap";
import CopyToClipboard = require("react-copy-to-clipboard");

interface CompanySearchProps {
    toggle: () => void;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    company: CompanyInfo;
    companySummaryText: string;
}
  
interface DispatchProps {
    searchCompany: (number: string) => void;
    clearCompany: () => void;
    continueOnboarding: () => void;
    clearAccountCreation: () => void;
}

interface CompanySearchState {
    registrationNumber: string;
}

class CompanySearch extends React.Component<CompanySearchProps & DispatchProps & StateProps, CompanySearchState> {
    constructor(props: CompanySearchProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            registrationNumber: ''
        }
    }

    searchCompany() {
        const number = this.state.registrationNumber.trim();
        this.props.searchCompany(number);
    }

    updateRegistrationNumber(ev: any){
        var reg = ev.target.value;
        this.setState({
            ...this.state,
            registrationNumber: reg
        });
    }

    close(){
        this.props.clearAccountCreation();
        this.props.toggle();
    }

    copyCompanyDetail() : void {

    }

    render(){
        let searchInProgress = this.props.working;

        var canSearch = this.state.registrationNumber.length > 0;

        let foundCompany = this.props.company;
        let hasSearchError = !searchInProgress && this.props.error;
        let hasSearchResult = !searchInProgress && !this.props.error && foundCompany != null;

        return (
            <div className="modal-content">
                <ModalHeader toggle={() => this.close()}><i className="fas fa-search mr-2"></i>Search Company</ModalHeader>
                <ModalBody>
                    <p>Enter the company registration number and press the search button.</p>
                    <Form>
                        <div className="d-flex">
                            <div className="flex-grow-1 pr-2">
                                <InputGroup className="input-group-seamless">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="fas fa-building"></i>
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input id="search-company-reg-number"
                                    value={this.state.registrationNumber} 
                                    onChange={e => this.updateRegistrationNumber(e)} />
                                </InputGroup>
                            </div>
                                <Button color="white" 
                                    onClick={() => this.searchCompany()} 
                                    disabled={!canSearch}>
                                <i className="fas fa-search mr-1"></i>Search
                            </Button>
                        </div>
                        <hr />
                        {searchInProgress && (
                            <LoadingIndicator text="Searching..." minHeight={200} />
                        )}
                        {hasSearchError && (
                            <ErrorMessage content={this.props.errorMessage} />
                        )}
                        {hasSearchResult && (
                            <div>
                                <p className="float-right mb-0">
                                    <CopyToClipboard text={this.props.companySummaryText}>
                                        <Button outline size="sm" color="primary" className="text-right" onClick={() => this.copyCompanyDetail()}>
                                            <i className="far fa-copy mr-1" />Copy
                                        </Button>
                                    </CopyToClipboard>
                                </p>
                                <div>
                                    <div className="text-small">Company Name</div>
                                    <div className="pl-3">{foundCompany.companyName}</div>
                                    <div className="text-small">Registration Number</div>
                                    <div className="pl-3">{foundCompany.companyNumber}</div>
                                    <div className="text-small">Status</div>
                                    <div className="pl-3">{foundCompany.companyStatus}</div>
                                    <div className="text-small">Incorporation Date</div>
                                    <div className="pl-3">{foundCompany.incorporationDate}</div>
                                    <div className="text-small">Registered Address</div>
                                    <div className="pl-3">
                                        <div>{foundCompany.addressLine1}</div>
                                        <div>{foundCompany.addressLine2}</div>
                                        <div>{foundCompany.postTown}</div>
                                        <div>{foundCompany.county}</div>
                                        <div>{foundCompany.countryOfOrigin}</div>
                                        <div>{foundCompany.postcode}</div>
                                    </div>
                                </div>
                            <hr />
                            <p className="mb-0">If this is the company you were looking for, click the <i>Continue</i> button below.</p>
                            </div>
                        )}
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={() => this.props.clearCompany()}
                            disabled={!hasSearchResult}>
                        <i className="fas fa-eraser mr-1"></i>Clear search
                    </Button>
                    <Button color="accent" 
                            onClick={() => this.props.continueOnboarding()}
                            disabled={!hasSearchResult}>
                        <i className="fas fa-arrow-circle-right mr-1"></i>Continue
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        searchCompany: (number: string) => dispatch(searchCompany(number)),
        clearCompany: () => dispatch(clearCompany()),
        continueOnboarding: () => dispatch(selectCompany()),
        clearAccountCreation: () => dispatch(clearAccountCreation())
    }
}

const mapStateToProps: MapStateToProps<StateProps, CompanySearchProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.hierarchy.create_account.company.working,
        error: state.hierarchy.create_account.company.error,
        errorMessage: state.hierarchy.create_account.company.errorMessage,
        company: state.hierarchy.create_account.company.value,
        companySummaryText: state.hierarchy.create_account.company.companySummaryText
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CompanySearch);