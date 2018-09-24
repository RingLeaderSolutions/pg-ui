import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType, AccountDetail, PortfolioDetails, HierarchyMpan, HierarchyMprn, decodeUtilityType } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { retrieveAccountDetail } from '../../../actions/hierarchyActions';
import { includeMeters } from '../../../actions/meterActions';
import { selectMany } from "../../../helpers/listHelpers";
import { closeModalDialog } from "../../../actions/viewActions";
import { Link } from "react-router-dom";

interface IncludeMetersDialogProps {    
    utility: UtilityType;
    portfolio: PortfolioDetails;
    includedMeters: string[];
}

interface StateProps {
    account: AccountDetail;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    retrieveAccountDetail: (accountId: string) => void;
    includeMeters: (portfolioId: string, meters: string[]) => void;
    closeModalDialog: () => void;
}

interface IncludedMetersDialogState {
    includedMeters: string[];

    excludedMpans: HierarchyMpan[];
    excludedMprns: HierarchyMprn[];
}

class IncludeMetersDialog extends React.Component<IncludeMetersDialogProps & StateProps & DispatchProps, IncludedMetersDialogState> {
    constructor() {
        super();
        this.state = {
            includedMeters: [],
            excludedMpans: [],
            excludedMprns: []
        }
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio.portfolio.accountId)
    }

    completeInclusion(){
        this.props.includeMeters(this.props.portfolio.portfolio.id, this.state.includedMeters);
        this.props.closeModalDialog();
    }

    componentWillReceiveProps(nextProps: IncludeMetersDialogProps & StateProps & DispatchProps){
        if(nextProps.account != null){
            if(nextProps.utility == UtilityType.Electricity){
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
        var mpans = selectMany(account.sites, (s) => s.mpans);

        return mpans.filter(mp => this.props.includedMeters.indexOf(mp.mpanCore) < 0);
    }

    getExcludedMprns(account: AccountDetail) : HierarchyMprn[]{
        var mprns = selectMany(account.sites, (s) => s.mprns);

        return mprns.filter(mp => this.props.includedMeters.indexOf(mp.mprnCore) < 0);
    }

    includeAllMeters(){
        if(this.props.utility == UtilityType.Electricity){
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
            var hhIndicator = em.meterType == "HH" ? (<i className="fa fa-clock uk-margin-small-right" data-uk-tooltip="title: Half-hourly meter"></i>) : null;
            return (
                <div className="uk-width-1-2" key={em.mpanCore}>
                    <label>
                        <input 
                            className='uk-checkbox'
                            type='checkbox' 
                            onChange={() => this.handleChange(em.mpanCore)}
                            checked={isSelected}
                            /> {em.mpanCore} {hhIndicator}
                    </label>
                </div>
            )
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
                <div className="uk-width-1-2" key={em.mprnCore}>
                    <label>
                        <input 
                            className='uk-checkbox'
                            type='checkbox' 
                            onChange={() => this.handleChange(em.mprnCore)}
                            checked={isSelected}
                            /> {em.mprnCore}
                    </label>
                </div>
            )
        });

        return this.renderFullMetersDisplay(meters);
    }

    renderFullMetersDisplay(meters: any[]){
        if(meters.length == 0){
            var lowerCaseUtility = decodeUtilityType(this.props.utility).toLowerCase();
            if(this.props.includedMeters.length == 0){
                return (
                    <div className="uk-alert-warning uk-margin-small-bottom uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <div>
                                    <p>This portfolio's account ({this.props.account.companyName}) doesn't contain any {lowerCaseUtility} meters to include.</p>    
                                    <p><Link to={`/account/${this.props.account.id}`} onClick={() => this.props.closeModalDialog()}>Click here</Link> to visit the account where you can add some.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            return (
                <div className="uk-alert-success uk-margin-small-bottom uk-alert" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-info-circle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <p>You have already included all of the available {lowerCaseUtility} meters into this portfolio.</p>    
                            </div>
                        </div>
                    </div>
            )
        }

        return (
            <div className="uk-margin">
                <form>
                    <fieldset className="uk-fieldset">
                        <div className="include-meter-list" data-uk-grid>
                            {meters}
                        </div>
                        <hr />
                        <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.includeAllMeters()} type="button">
                            <i className="fa fa-check-double uk-margin-small-right"></i> Select All
                        </button>
                        <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.includeNoMeters()} type="button">
                            <i className="fa fa-times uk-margin-small-right fa-lg"></i> Select None
                        </button>
                    </fieldset>
                </form>
            </div>
        )
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.account == null){
            return (<Spinner />);
        }

        var saveDisabled = this.state.includedMeters.length == 0;
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title"><i className="fas fa-folder-plus uk-margin-right"></i>Include {decodeUtilityType(this.props.utility)} Meters</h2>
                </div>
                <div className="uk-modal-body">
                    {this.props.utility == UtilityType.Electricity ? this.renderExcludedMpans() : this.renderExcludedMprns()}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}><i className="fa fa-times uk-margin-small-right"></i>Cancel</button>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.completeInclusion()} disabled={saveDisabled}><i className="fas fa-folder-plus uk-margin-small-right"></i>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, IncludeMetersDialogProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),   
        includeMeters: (portfolioId: string, meters: string[]) => dispatch(includeMeters(portfolioId, meters)),
        closeModalDialog: () => dispatch(closeModalDialog())
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
  
export default connect(mapStateToProps, mapDispatchToProps)(IncludeMetersDialog);