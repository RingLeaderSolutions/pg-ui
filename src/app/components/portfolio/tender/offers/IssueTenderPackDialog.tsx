import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../../applicationState';
import ErrorMessage from "../../../common/ErrorMessage";
import * as moment from 'moment';

import { issueTenderPack, fetchTenderIssuanceEmail } from '../../../../actions/tenderActions';
import { Tender, TenderSupplier, TenderIssuanceEmail } from "../../../../model/Tender";
import AsModalDialog, { ModalDialogProps } from "../../../common/modal/AsModalDialog";
import { LoadingIndicator } from "../../../common/LoadingIndicator";
import TenderDeadlineWarning from "../warnings/TenderDeadlineWarning";
import { ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Navbar, Nav, NavItem, NavLink, Col, Row, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";
import { ModalDialogNames } from "../../../common/modal/ModalDialogNames";

export interface IssueTenderPackDialogData {
    tender: Tender;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
    email: TenderIssuanceEmail;    
}
  
interface DispatchProps {
    fetchIssuanceEmail: (tenderId: string) => void;
    issueTenderPack: (tenderId: string, subject: string, body: string) => void;
}

interface IssueTenderPackDialogState {
    deadline: moment.Moment;
    deadlinePassed: boolean;
    subject: string;
    body: string;
}

class IssueTenderPackDialog extends React.Component<ModalDialogProps<IssueTenderPackDialogData> & StateProps & DispatchProps, IssueTenderPackDialogState> {
    constructor(props: ModalDialogProps<IssueTenderPackDialogData> & StateProps & DispatchProps) {
        super(props);
        this.state = {
            deadline: null,
            deadlinePassed: false,
            subject: props.email == null ? "" : props.email.subject,
            body: props.email == null ? "" : props.email.body
        }
    }

    static getDerivedStateFromProps(props: ModalDialogProps<IssueTenderPackDialogData> & StateProps & DispatchProps, state: IssueTenderPackDialogState) : IssueTenderPackDialogState {
        let dialogEmpty = state.subject.IsNullOrWhitespace() || state.body.IsNullOrWhitespace();
        if(!props.email || !dialogEmpty){
            return null;
        }

        return {
            ...state,
            subject: props.email.subject,
            body: props.email.body
        }
    }

    componentDidMount(){
        let { tender } = this.props.data;

        let deadline = moment(tender.deadline);
        let deadlinePassed = moment().diff(deadline, 'hours') > 0;
        
        if(!deadlinePassed){
            this.props.fetchIssuanceEmail(tender.tenderId);
        }
        
        this.setState({
            ...this.state,
            deadline,
            deadlinePassed
        });
    }

    issueTenderPacks() {
        this.props.issueTenderPack(this.props.data.tender.tenderId, this.state.subject, this.state.body);
        this.props.toggle();
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>){
        var value = event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    renderIssuePackForm(){
        return (
            <Form>
                <FormGroup>
                    <Label for="issue-packs-email-subject">Subject</Label>
                    <Input id="issue-packs-email-subject"
                            value={this.state.subject}
                            onChange={(e) => this.handleFormChange("subject", e)} />
                </FormGroup>

                <FormGroup>
                    <Label for="issue-packs-email-body">Body</Label>
                    <Input id="issue-packs-email-body"
                        type="textarea"
                        value={this.state.body}
                        onChange={(e) => this.handleFormChange("body", e)}
                        style={{height: '300px'}}/>
                </FormGroup>
            </Form>);
    }

    render() {
        if(this.props.working || !this.props.suppliers || !this.props.email){
            return (<LoadingIndicator />);
        }
        else if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage}/>);
        }
        
        let { deadlinePassed, deadline } = this.state;

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-envelope mr-2"></i>Issue Requirements Packs</ModalHeader>
                <ModalBody>
                    {deadlinePassed ? (<TenderDeadlineWarning deadline={deadline} />) : this.renderIssuePackForm()}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    {!deadlinePassed && (<Button color="accent" 
                        onClick={() => this.issueTenderPacks()}>
                        <i className="material-icons mr-1">send</i>Issue
                    </Button>)}
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        fetchIssuanceEmail: (tenderId: string) => dispatch(fetchTenderIssuanceEmail(tenderId)),
        issueTenderPack: (tenderId: string, subject: string, body: string) => dispatch(issueTenderPack(tenderId, subject, body))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        email: state.portfolio.tender.issuance_email.value,
        working: state.portfolio.tender.issue_pack.working || state.portfolio.tender.issuance_email.working,
        error: state.portfolio.tender.issue_pack.error || state.portfolio.tender.issuance_email.error,
        errorMessage: state.portfolio.tender.issue_pack.errorMessage || state.portfolio.tender.issuance_email.errorMessage
    };
};
  
export default AsModalDialog<IssueTenderPackDialogData, StateProps, DispatchProps>(
{ 
    name: ModalDialogNames.IssueTenderPack, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(IssueTenderPackDialog)
