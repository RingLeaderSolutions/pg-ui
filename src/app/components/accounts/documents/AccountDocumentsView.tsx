import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { AccountDetail, AccountDocument } from '../../../model/Models';
import * as moment from 'moment';

import { fetchAccountDocumentation } from '../../../actions/hierarchyActions';
import UploadAccountDocumentDialog, { UploadAccountDocumentDialogData } from "./UploadAccountDocumentDialog";
import { openDialog } from "../../../actions/viewActions";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { Col, Card, CardBody, Button, Alert, Row } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";

interface AccountDocumentsViewProps {
    account: AccountDetail;
}

interface StateProps {
  documentation: AccountDocument[];
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    fetchAccountDocumentation: (accountId: string) => void;
    openUploadAccountDocumentDialog: (data: UploadAccountDocumentDialogData) => void;
}

class AccountDocumentsView extends React.Component<AccountDocumentsViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.fetchAccountDocumentation(this.props.account.id);
    }

    renderDocumentsTable(){
        return (
            <div className="d-flex flex-wrap w-100">
                {this.props.documentation
                        .map((c) => this.renderDocumentCard(c))}
            </div>);
    }

    renderDocumentCard(d: AccountDocument): JSX.Element {
        var received = moment.utc(d.received).local().fromNow();     
        var expiry = moment.utc(d.expiry).local().format("DD/MM/YYYY");    
        return (
            <Col md={6} sm={12} className="mb-4" key={d.id}>
                <Card className="card-small h-100">
                    <CardBody>
                        <div className="text-center">
                            <h4>{d.documentType == "loa" ? <span>Letter of Authority</span>: <span>Document</span>}</h4>
                            <p className="d-block text-lightweight mb-1 mt-2 text-nowrap"><i className="fa fa-file-upload text-primary mr-2"></i><strong>Uploaded:</strong> {received}</p>
                            <p className="d-block text-lightweight mb-3 text-nowrap"><i className="fa fa-stopwatch text-orange mr-2"></i><strong>Expires:</strong> {expiry}</p>
                            <Button color="accent" outline className="btn-grey-outline"
                                    href={d.blobFileName}>
                                <i className="fas fa-download mr-2"></i>Download
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </Col>);
    }

    renderNoDocumentsWarning(){
        return (
            <Alert color="light">
                <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    No documents have yet been uploaded and associated with this account. Click on the Upload Document button above to get started.
                </div>
            </Alert>);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<LoadingIndicator />);
        }

        var hasDocumentation = this.props.documentation != null && this.props.documentation.length > 0;
        return (
            <div className="w-100 p-3">
                <Row className="d-flex" noGutters>
                    <Button color="accent"
                            onClick={() => this.props.openUploadAccountDocumentDialog({ accountId: this.props.account.id })}>
                        <i className="fas fa-file-upload mr-2"></i>
                        Upload Document
                    </Button>
                </Row>
                <Row noGutters className="mt-3">
                    {hasDocumentation ? this.renderDocumentsTable() : this.renderNoDocumentsWarning()}
                </Row>
                <UploadAccountDocumentDialog />
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountDocumentsViewProps> = (dispatch) => {
    return {
        fetchAccountDocumentation: (accountId: string) => dispatch(fetchAccountDocumentation(accountId)),
        openUploadAccountDocumentDialog: (data: UploadAccountDocumentDialogData) => dispatch(openDialog(ModalDialogNames.UploadAccountDocument, data))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountDocumentsViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        documentation: state.hierarchy.selected_documentation.value,
        working: state.hierarchy.selected_documentation.working,
        error: state.hierarchy.selected_documentation.error,
        errorMessage: state.hierarchy.selected_documentation.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountDocumentsView);