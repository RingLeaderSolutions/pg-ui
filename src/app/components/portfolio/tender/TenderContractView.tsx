import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { fetchContractBackingSheets } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import ContractRatesDialog from './ContractRatesDialog';
import Spinner from "../../common/Spinner";
import { format } from 'currency-formatter';
import { PortfolioSummary } from "../../../model/PortfolioDetails";
import { Col, Row, Card, CardBody, CardHeader, Button, Alert } from "reactstrap";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { openDialog, redirectToAccount } from "../../../actions/viewActions";

interface TenderContractViewProps {
    tender: Tender;
    portfolio: PortfolioSummary;
}

interface StateProps {
    suppliers: TenderSupplier[];
    working: boolean;
}

interface DispatchProps {
    fetchContractBackingSheets: (tenderId: string, contractId: string) => void;
    openContractRatesDialog: () => void;
    redirectToAccountContracts: (accountId: string) => void;
}

class TenderContractView extends React.Component<TenderContractViewProps & DispatchProps & StateProps, {}> { 
    renderContractInfo(){
        var { existingContract } = this.props.tender;
        var existingSupplier = this.props.suppliers.find(s => s.supplierId == existingContract.supplierId);
        var supplierLogo = existingSupplier == null ? "Unknown" : (<img src={existingSupplier.logoUri} style={{ maxWidth: "88px", maxHeight: "50px"}}/>);

        var appu = `${existingContract.averagePPU.toFixed(4)}p`;
        return (
            <Row className="p-2 d-flex align-items-stretch flex-grow-1" noGutters>
                <Col lg xs={4} className="d-flex flex-column justify-content-center text-center px-1 mt-md-0 mt-sm-3">
                    <h4 className="m-0">{existingContract.reference}</h4>
                    <div className="text-light pt-1"><i className="fas fa-tag text-accent mr-1"></i>Reference</div>
                </Col>
                <Col lg xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                    <h4 className="m-0">{supplierLogo}</h4>
                    <div className="text-light pt-1"><i className="fas fa-industry mr-1"></i>Supplier</div>
                </Col>
                <Col lg xs={4} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                    <h4 className="m-0">{existingContract.product}</h4>
                    <div className="text-light pt-1"><i className="fas fa-cube mr-1 text-primary"></i>Product</div>
                </Col>
                <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                    <h4 className="m-0">{format(existingContract.totalExCCL, { locale: 'en-GB'})}</h4>
                    <div className="text-light pt-1"><i className="fas fa-money-check-alt mr-1 text-indigo"></i>Contract Value</div>
                </Col>
                <Col lg xs={6} className="d-flex flex-column justify-content-center text-center border-left px-1 mt-md-0 mt-sm-3">
                    <h5 className="m-0">{appu}</h5>
                    <div className="text-light pt-1"><i className="fas fa-coins mr-1 text-warning mr-2"></i>Avg. Pence Per Unit</div>
                </Col>
            </Row>
        )
    }

    fetchRatesAndOpenDialog(){
        let contractId = this.props.tender.existingContract.contractId;
        this.props.fetchContractBackingSheets(this.props.tender.tenderId, contractId);
        this.props.openContractRatesDialog();
    }
   
    render() {
        if(this.props.working){
            return (<Spinner />);
        }

        var cardContent = null;
        var viewRatesButton = null;
        if(this.props.tender.existingContract == null){
            cardContent = (
                <Alert color="orange" className="mb-0">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        <div>
                            <p className="m-0 pl-3">
                                We couldn't match this portfolio's included meters to a valid existing contract on its account.
                            </p>
                            <p className="mt-1 mb-0 pl-3">
                                <Button color="secondary" onClick={() => this.props.redirectToAccountContracts(this.props.portfolio.accountId)}><i className="fas fa-building mr-1"></i>Click here</Button> to visit the account and add one.
                            </p>
                        </div>
                    </div>
                </Alert>
            );
        }
        else {
            var hasContractRates = this.props.tender.existingContract.sheetCount > 0;
            var warningMessage = null;
            
            if(!hasContractRates){
                warningMessage = (
                    <Alert color="orange" className="mb-0">
                    <div className="d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle mr-2"></i>
                        <div>
                            <p className="m-0 pl-3">
                            This contract does not yet have any rates associated with it.
                            </p>
                            <p className="mt-1 mb-0 pl-3">
                                <Button color="secondary" onClick={() => this.props.redirectToAccountContracts(this.props.portfolio.accountId)}><i className="fas fa-building mr-2"></i>Click here</Button> to visit the account where you can upload some.
                            </p>
                        </div>
                    </div>
                </Alert>);
            }
            else {
                viewRatesButton = (<Button color="accent" outline className="btn-grey-outline" size="small" onClick={() => this.fetchRatesAndOpenDialog()}><i className="fa fa-pound-sign mr-2"></i>View Contract Rates</Button>);
            }

            cardContent = (<div>{warningMessage}{this.renderContractInfo()}</div>);
        }

        return (
            <div className="px-3">
                <Row>
                <Col sm={12} className="mb-3">
                    <Card className="card-small h-100">
                        <CardHeader className="border-bottom pl-3 pr-2 py-2">
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                        <h6 className="m-0"><i className="fas fa-file-signature mr-1"></i>Existing Contract</h6>
                                    </div>
                                    {viewRatesButton}
                                </div>
                        </CardHeader>
                        <CardBody className="p-0 d-flex flex-column">
                            {cardContent}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <ContractRatesDialog />
        </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderContractViewProps> = (dispatch) => {
    return {
        fetchContractBackingSheets: (tenderId: string, contractId: string) => dispatch(fetchContractBackingSheets(tenderId, contractId)),
        openContractRatesDialog: () => dispatch(openDialog(ModalDialogNames.ContractRates)),

        redirectToAccountContracts: (accountId: string) => dispatch(redirectToAccount(accountId, "contracts")),
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderContractViewProps, ApplicationState> = (state: ApplicationState) => {
    return {
        suppliers: state.suppliers.value,
        working: state.suppliers.working
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderContractView);