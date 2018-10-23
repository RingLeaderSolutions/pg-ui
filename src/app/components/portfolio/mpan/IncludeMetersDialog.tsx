import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType, AccountDetail, PortfolioDetails, HierarchyMpan, HierarchyMprn, decodeUtilityType } from '../../../model/Models';

import { retrieveAccountDetail } from '../../../actions/hierarchyActions';
import { includeMeters } from '../../../actions/meterActions';
import { Link } from "react-router-dom";
import asModalDialog, { ModalDialogProps } from "../../common/modal/AsModalDialog";
import { ModalDialogNames } from "../../common/modal/ModalDialogNames";
import { ModalHeader, ModalBody, ModalFooter, Button, Alert, Col, CustomInput, Row } from "reactstrap";
import { LoadingIndicator } from "../../common/LoadingIndicator";

export interface IncludeMetersDialogData {
    utility: UtilityType;
    portfolio: PortfolioDetails;
    includedMeters: string[];
}
interface IncludeMetersDialogProps extends ModalDialogProps<IncludeMetersDialogData> { }

interface StateProps {
    account: AccountDetail;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    includeMeters: (portfolioId: string, meters: string[]) => void;
}

interface IncludedMetersDialogState {
    includedMeters: string[];

    excludedMpans: HierarchyMpan[];
    excludedMprns: HierarchyMprn[];
}

class IncludeMetersDialog extends React.Component<IncludeMetersDialogProps & StateProps & DispatchProps, IncludedMetersDialogState> {
    constructor(props: IncludeMetersDialogProps & StateProps & DispatchProps) {
        super(props);
        this.state = {
            includedMeters: [],
            excludedMpans: [],
            excludedMprns: []
        }
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.data.portfolio.portfolio.accountId)
    }

    completeInclusion(){
        this.props.includeMeters(this.props.data.portfolio.portfolio.id, this.state.includedMeters);
        this.props.toggle();
    }

    componentWillReceiveProps(nextProps: IncludeMetersDialogProps & StateProps & DispatchProps){
        if(nextProps.account != null){
            if(nextProps.data.utility == UtilityType.Electricity){
                var excludedMpans =  this.getExcludedMpans(nextProps.account);
                this.setState({
                    ...this.state,
                    excludedMprns: [],
                    excludedMpans,
                    includedMeters: []
                });
            }
            else {
                var excludedMprns = this.getExcludedMprns(nextProps.account);
                this.setState({
                    ...this.state,
                    excludedMprns,
                    excludedMpans: [],
                    includedMeters: []
                });
            }
        }
    }

    handleChange(meter: string){
        if(this.state.includedMeters.indexOf(meter) < 0){
            this.setState({
                ...this.state,
                includedMeters: [...this.state.includedMeters, meter]
            });
            return;    
        }

        this.setState({
            ...this.state,
            includedMeters: this.state.includedMeters.filter(im => im != meter)
        });
    }

    getExcludedMpans(account: AccountDetail) : HierarchyMpan[]{
        var mpans = account.sites.SelectMany((s) => s.mpans);

        return mpans.filter(mp => this.props.data.includedMeters.indexOf(mp.mpanCore) < 0);
    }

    getExcludedMprns(account: AccountDetail) : HierarchyMprn[]{
        var mprns = account.sites.SelectMany((s) => s.mprns);

        return mprns.filter(mp => this.props.data.includedMeters.indexOf(mp.mprnCore) < 0);
    }

    includeAllMeters(){
        if(this.props.data.utility == UtilityType.Electricity){
            this.setState({
                ...this.state,
                includedMeters:  this.state.excludedMpans.map(em => em.mpanCore)
            });
            return;
        }
        
        this.setState({
            ...this.state,
            includedMeters: this.state.excludedMprns.map(em => em.mprnCore)
        });
    }

    includeNoMeters(){
        this.setState({
            ...this.state,
            includedMeters: []
        });
    }

    renderExcludedMpans(){
        var excludedMeters = this.state.excludedMpans.sort(
            (mp1: HierarchyMpan, mp2: HierarchyMpan) => {        
                if (mp1.mpanCore < mp2.mpanCore) return -1;
                if (mp1.mpanCore > mp2.mpanCore) return 1;
                return 0;
            });
            
        var meters = excludedMeters.map(em => {
            var isSelected = this.state.includedMeters.find(im => im == em.mpanCore) != null;
            var hhIndicator = em.meterType == "HH" ? (<i className="fa fa-clock ml-1"></i>) : null;

            return (
                <Col xs={6} key={em.mpanCore} className="d-flex align-items-center">
                    <CustomInput type="checkbox"
                                 id={`check-${em.mpanCore}`}
                                 checked={isSelected}
                                 onChange={() => this.handleChange(em.mpanCore)} 
                                 label={em.mpanCore}
                                 inline/>
                    {hhIndicator}
                </Col>);
        });

        return this.renderFullMetersDisplay(meters);
    }

    renderExcludedMprns(){
        var excludedMeters = this.state.excludedMprns.sort(
                (mp1: HierarchyMprn, mp2: HierarchyMprn) => {        
                    if (mp1.mprnCore < mp2.mprnCore) return -1;
                    if (mp1.mprnCore > mp2.mprnCore) return 1;
                    return 0;
                })

        var meters = excludedMeters.map(em => {
            var isSelected = this.state.includedMeters.find(im => im == em.mprnCore) != null;
            return (
                <Col xs={6} key={em.mprnCore}>
                    <CustomInput type="checkbox"
                                 id={`check-${em.mprnCore}`}
                                 checked={isSelected}
                                 onChange={() => this.handleChange(em.mprnCore)} 
                                 label={em.mprnCore}
                                 inline/>
                </Col>);
        });

        return this.renderFullMetersDisplay(meters);
    }

    renderFullMetersDisplay(meters: any[]){
        if(meters.length === 0){
            var lowerCaseUtility = decodeUtilityType(this.props.data.utility).toLowerCase();
            if(this.props.data.includedMeters.length === 0){
                return (
                    <Alert color="light">
                        <div className="d-flex align-items-center flex-column">
                            <i className="fas fa-info-circle mr-2"></i>
                            <p className="m-0 pt-2">This portfolio's account ({this.props.account.companyName}) doesn't contain any {lowerCaseUtility} meters to include.</p>
                            <p className="m-0 pt-1"><Link to={`/account/${this.props.account.id}`} onClick={() => this.props.toggle()}>Click here</Link> to visit the account where you can add some.</p>
                        </div>
                    </Alert>);
            }

            return (
                <Alert color="light">
                    <div className="d-flex align-items-center flex-column">
                        <i className="fas fa-info-circle mr-2"></i>
                        <p className="m-0 pt-2">You have already included all of the available {lowerCaseUtility} meters into this portfolio.</p>
                    </div>
                </Alert>);
        }

        return (
            <div>
                <Row noGutters>
                    {meters}
                </Row>
                <hr />
                <div className="d-flex">
                    <Button color="white" size="sm" onClick={() => this.includeAllMeters()}>
                        <i className="fa fa-check-double mr-1"></i> Select All
                    </Button>
                    <Button color="white" size="sm" className="ml-1"
                            onClick={() => this.includeNoMeters()}>
                        <i className="fa fa-times mr-1"></i> Select None
                    </Button>
                </div>
            </div>);
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<LoadingIndicator />);
        }

        var saveDisabled = this.state.includedMeters.length == 0;

        return (
            <div className="modal-content">
                <ModalHeader toggle={this.props.toggle}><i className="fas fa-folder-plus mr-2"></i>Include {decodeUtilityType(this.props.data.utility)} Meters</ModalHeader>
                <ModalBody>
                    {this.props.data.utility == UtilityType.Electricity ? this.renderExcludedMpans() : this.renderExcludedMprns()}
                </ModalBody>
                <ModalFooter>
                    <Button onClick={this.props.toggle}>
                        <i className="fas fa-times mr-1"></i>Cancel
                    </Button>
                    <Button color="accent" 
                            disabled={saveDisabled}
                            onClick={() => this.completeInclusion()}>
                        <i className="fas fa-folder-plus mr-1"></i>Save
                    </Button>
                </ModalFooter>
            </div>);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, IncludeMetersDialogProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),   
        includeMeters: (portfolioId: string, meters: string[]) => dispatch(includeMeters(portfolioId, meters))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, IncludeMetersDialogProps, ApplicationState> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};

export default asModalDialog(
{ 
    name: ModalDialogNames.IncludeMeters, 
    centered: true, 
    backdrop: true,
}, mapStateToProps, mapDispatchToProps)(IncludeMetersDialog)