import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { AccountDetail } from '../../../model/Models';
import * as moment from 'moment';

import { format } from 'currency-formatter';

import { getAccountContracts, getTenderSuppliers, fetchAccountContractRates, deleteAccountContract } from "../../../actions/tenderActions";
import { TenderContract, TenderSupplier } from "../../../model/Tender";
import { UtilityIcon } from "../../common/UtilityIcon";
import UpdateContractDialog, { UpdateContractDialogData } from "./UpdateContractDialog";
import ContractRatesDialog from "../../portfolio/tender/ContractRatesDialog";
import AddContractDialog, { AddExistingContractDialogData } from "./AddContractDialog";
import UploadContractRatesDialog, { UploadContractRatesDialogData } from "./UploadContractRatesDialog";
import RenewContractDialog, { RenewContractDialogData } from "./RenewContractDialog";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import { DropdownItem, Button, UncontrolledDropdown, DropdownToggle, Row, DropdownMenu, UncontrolledTooltip, Col, Alert, Card, CardHeader, CardBody } from "reactstrap";
import * as cn from "classnames";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { openDialog, openAlertConfirmDialog } from "../../../actions/viewActions";
import { AlertConfirmDialogData } from "../../common/modal/AlertConfirmDialog";
interface AccountContractsViewProps {
}

interface StateProps {
  account: AccountDetail;
  working: boolean;
  error: boolean;
  errorMessage: string;
  contracts: TenderContract[];
  suppliers: TenderSupplier[];
}

interface DispatchProps {
    getAccountContracts: (accountId: string) => void;
    fetchAccountContractRates: (contractId: string) => void;
    deleteContract: (contractId: string) => void;
    getSuppliers: () => void;

    openAlertConfirmDialog: (data: AlertConfirmDialogData) => void;
    openAddExistingContractDialog: (data: AddExistingContractDialogData) => void;
    openUpdateContractDialog: (data: UpdateContractDialogData) => void;
    openUploadContractRatesDialog: (data: UploadContractRatesDialogData) => void;
    openRenewAccountContractDialog: (data: RenewContractDialogData) => void;
    openContractRatesDialog: () => void;
}

class AccountContractsView extends React.Component<AccountContractsViewProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        if(this.props.suppliers == null){
            this.props.getSuppliers()
        }

        const account = this.props.account;
        if(account != null) { 
            this.props.getAccountContracts(account.id);
        }
    }

    fetchRatesAndOpenDialog(contractId: string){
        this.props.fetchAccountContractRates(contractId);
        this.props.openContractRatesDialog();
    }

    confirmDeleteContract(contract: TenderContract){
        var preText = "";
        if(contract.activeTenderCount > 0){
            var tenderText = contract.activeTenderCount > 1 ? "tenders" : "tender";
            preText = `The "${contract.reference}" contract is currently being used in ${contract.activeTenderCount} active ${tenderText}.`;
        }
        
        var confirmText = `${preText}Are you sure you want to delete this contract?`;
        this.props.openAlertConfirmDialog({
            title: "Confirm",
            body: confirmText,
            confirmText: "Yes",
            confirmIcon: "check",
            onConfirm: () => this.props.deleteContract(contract.contractId)
        });
    }

    getStatusRowColor(status: string) : string {
        switch(status.toLowerCase()){
            case "active":
                return "#f0fcf0";
            case "pending":
                return "#fcf6f0"
            default:
                return "#ffffff";
        }
    }

    renderStatusIcon(contract: TenderContract){
        let { contractId, status } = contract;
        let icon, tooltip, color = "";
        switch(status.toLowerCase()){
            case "expired":
                icon = "clock";
                tooltip = "This contract has expired.";
                color = "danger";
                break;
            case "active":
                icon = "check-circle";
                tooltip = "This contract is active.";
                color = "success";
                break;
            case "pending":
                icon = "hourglass-half";
                tooltip = "This contract is pending.";
                color = "warning";
                break;
            default:
                icon = "question-circle";
                tooltip ="Unknown status";
                color = "danger";
                break;
        }

        return (
            <div>
                <i id={`status-icon-${contractId}`} className={`fas fa-${icon} text-${color}`}></i>
                <UncontrolledTooltip target={`status-icon-${contractId}`} placement="bottom">
                    <strong>{tooltip}</strong>
                </UncontrolledTooltip>
            </div>
        )
    }

    renderContractsRows(){
        return this.props.contracts.map(c => {
            var hasContractRates = c.sheetCount > 0;
            var supplier = this.props.suppliers.find(su => su.supplierId == c.supplierId);
            var supplierImage = supplier == null ? "Unknown" : (<img src={supplier.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/>);
            var created = moment.utc(c.uploaded).local();
            
            var rowBackground = this.getStatusRowColor(c.status);
            return (
                <tr key={c.contractId} style={{background: rowBackground}}>
                    <td className="align-middle">
                        <div className="d-flex">
                            {this.renderStatusIcon(c)}
                            <div>
                                <i className={cn("ml-1 fas", { "fa-exclamation-triangle text-danger" : !hasContractRates, "fa-pound-sign text-success" : hasContractRates })} 
                                    id={`contract-rates-indicator-${c.contractId}`}/>
                                <UncontrolledTooltip target={`contract-rates-indicator-${c.contractId}`} placement="bottom">
                                    <strong>{hasContractRates ? "This existing contract's rates have been successfully processed" : "This existing contract's rates have not yet been uploaded and processed."}</strong>
                                </UncontrolledTooltip>
                            </div>
                        </div>
                    </td>
                    <td className="align-middle">{c.reference}</td>
                    <td className="align-middle">{supplierImage}</td>
                    <td className="align-middle text-center"><UtilityIcon utility={c.utility} isHalfHourlyElectricity={c.halfHourly} /></td>
                    <td className="align-middle">{c.product}</td>
                    <td className="align-middle">{c.contractStart != null ? moment(c.contractStart).format("DD/MM/YYYY") : "-"}</td>
                    <td className="align-middle">{c.contractEnd != null ? moment(c.contractEnd).format("DD/MM/YYYY") : "-"}</td>
                    <td className="align-middle">{hasContractRates ? format(c.totalExCCL, { locale: 'en-GB'}) : "-"}</td>
                    <td className="align-middle">{hasContractRates ? `${c.averagePPU.toFixed(4)}p` : "-"}</td>
                    <td className="align-middle">
                        <div>
                            <p className="m-0" id={`contract-created-${c.contractId}`}>{created.fromNow()}</p>
                            <UncontrolledTooltip target={`contract-created-${c.contractId}`} placement="bottom">
                                <strong>{created.format("DD/MM/YYYY HH:mm:ss")}</strong>
                            </UncontrolledTooltip>
                        </div>
                    </td>
                    <td className="align-middle">
                        <UncontrolledDropdown>
                            <DropdownToggle color="white" caret>
                                <i className="material-icons text-secondary mr-1">edit</i>
                                <span className="mr-1">Actions</span>
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem href="#"
                                    onClick={() => this.props.openUpdateContractDialog({ contract: c })}>
                                    <span><i className="material-icons mr-1 text-secondary">edit</i>Edit</span>
                                </DropdownItem>
                                <DropdownItem href="#"
                                    onClick={() => this.props.openUploadContractRatesDialog({ contract: c, supplier })}>
                                    <span><i className="fas fa-file-upload mr-2 text-secondary"></i>{!hasContractRates ? "Upload" : "Replace"} Contract Rates</span>
                                </DropdownItem>
                                {hasContractRates && (<DropdownItem href="#" onClick={() => this.fetchRatesAndOpenDialog(c.contractId)}>
                                    <span><i className="fas fa-pound-sign mr-2 text-success" />View Rates</span>
                                </DropdownItem>)}
                                <DropdownItem href="#"
                                    onClick={() => this.props.openRenewAccountContractDialog({ contract: c })}>
                                    <span><i className="fas fa-redo mr-2 text-accent"></i>Renew</span>
                                </DropdownItem>
                                <DropdownItem divider />
                                <DropdownItem href="#" onClick={() => this.confirmDeleteContract(c)}>
                                    <span className="text-danger"><i className="fas fa-trash-alt mr-1 text-danger" />Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </td>
                </tr>
            )
        })
    }

    renderContractsTable(){
        return (
            <div style={{overflowX: "auto", overflow: 'visible'}}>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Status</th>
                            <th>Reference</th>
                            <th>Supplier</th>
                            <th>Utility</th>
                            <th>Product</th>
                            <th>Start</th>
                            <th>End</th>
                            <th>Contract Value</th>
                            <th>APPU</th>
                            <th>Created</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderContractsRows()}
                    </tbody>
            </table>
        </div>)
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null || this.props.contracts == null){
            return (<LoadingIndicator />);
        }
        
        const hasContracts = this.props.contracts.length > 0;

        return (
            <div className="w-100 px-3 py-3">
            <Row noGutters>
                <Col className="d-flex justify-content-center justify-content-md-start align-items-center">
                    <Button color="accent" id="add-existing-contract-button"
                        onClick={() => this.props.openAddExistingContractDialog({ accountId: this.props.account.id })}>
                        <i className="fas fa-plus-circle mr-1"></i>
                         Add Existing Contract
                    </Button>
                    <UncontrolledTooltip target="add-existing-contract-button" placement="bottom">
                        <strong>Add an active contract that covers meters held under this account</strong>
                    </UncontrolledTooltip>
                </Col>
            </Row>
            
            <Card className="card-small h-100 mt-3">
                <CardHeader className="border-bottom px-3 py-2">
                    <h6 className="m-0"><i className="fas fa-file-signature mr-1"></i>Existing Contracts</h6>    
                </CardHeader>
                <CardBody className="p-2">
                    {hasContracts ? this.renderContractsTable() : (
                        <Alert color="light">
                            <div className="d-flex align-items-center flex-column">
                                <i className="fas fa-exclamation-triangle mr-2"></i>
                                <p className="m-0 pt-2">No existing contracts have been provided for this account yet.</p>
                                <p className="m-0 pt-1">Click on the button above to get started!</p>
                            </div>
                        </Alert>)}
                </CardBody>
            </Card>
            <AddContractDialog />
            <UpdateContractDialog />
            <RenewContractDialog />
            <ContractRatesDialog />
            <UploadContractRatesDialog />
        </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountContractsViewProps> = (dispatch) => {
    return {
        getAccountContracts: (accountId: string) => dispatch(getAccountContracts(accountId)),
        fetchAccountContractRates: (contractId: string) => dispatch(fetchAccountContractRates(contractId)),
        deleteContract: (contractId: string) => dispatch(deleteAccountContract(contractId)),
        getSuppliers: () => dispatch(getTenderSuppliers()),

        openAlertConfirmDialog: (data: AlertConfirmDialogData) => dispatch(openAlertConfirmDialog(data)),
        openAddExistingContractDialog: (data: AddExistingContractDialogData) => dispatch(openDialog(ModalDialogNames.CreateAccountContract, data)),
        openUpdateContractDialog: (data: UpdateContractDialogData) => dispatch(openDialog(ModalDialogNames.UpdateAccountContract, data)),
        openUploadContractRatesDialog: (data: UploadContractRatesDialogData) => dispatch(openDialog(ModalDialogNames.UploadAccountContractRates, data)),
        openRenewAccountContractDialog: (data: RenewContractDialogData) => dispatch(openDialog(ModalDialogNames.RenewAccountContract, data)),
        openContractRatesDialog: () => dispatch(openDialog(ModalDialogNames.ContractRates))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountContractsViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working || state.hierarchy.selected_contracts.working || state.suppliers.working,
        error: state.hierarchy.selected.error || state.hierarchy.selected_contracts.error || state.suppliers.error,
        errorMessage: state.hierarchy.selected.errorMessage || state.hierarchy.selected_contracts.errorMessage || state.suppliers.errorMessage,
        contracts: state.hierarchy.selected_contracts.value,
        suppliers: state.suppliers.value,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountContractsView);