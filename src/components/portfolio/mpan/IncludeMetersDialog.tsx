import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType, AccountDetail, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { retrieveAccountDetail } from '../../../actions/hierarchyActions';
import { includeMeters } from '../../../actions/meterActions';

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
}

interface IncludedMetersDialogState {
    excludedMeters: string[];
    includedMeters: string[];
}

class IncludeMetersDialog extends React.Component<IncludeMetersDialogProps & StateProps & DispatchProps, IncludedMetersDialogState> {
    constructor() {
        super();
        this.state = {
            includedMeters: [],
            excludedMeters: []
        }
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio.portfolio.accountId)
    }

    completeInclusion(){
        this.props.includeMeters(this.props.portfolio.portfolio.id, this.state.includedMeters);
    }

    componentWillReceiveProps(nextProps: IncludeMetersDialogProps & StateProps & DispatchProps){
        if(nextProps.account != null){
            var excludedMeters: string[];
            if(this.props.utility == UtilityType.Electricity){
                excludedMeters =  this.getExcludedMpans(nextProps.account);
            }
            else {
                excludedMeters = this.getExcludedMprns(nextProps.account);
            }

            this.setState({
                ...this.state,
                excludedMeters
            });
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

    selectMany<TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] {
        return input.reduce((out, inx) => {
            out.push(...selectListFn(inx));
            return out;
        }, new Array<TOut>());
    }

    getExcludedMpans(account: AccountDetail) : string[]{
        var mpans = this.selectMany(account.sites, (s) => s.mpans);
        var cores = mpans.map(mp => mp.mpanCore);

        return cores.filter(c => this.props.includedMeters.indexOf(c) < 0);
    }

    getExcludedMprns(account: AccountDetail) : string[]{
        var mprns = this.selectMany(account.sites, (s) => s.mprns);
        var cores = mprns.map(mp => mp.mprnCore);

        return cores.filter(c => this.props.includedMeters.indexOf(c) < 0);
    }

    includeAllMeters(){
        this.setState({
            ...this.state,
            includedMeters: this.state.excludedMeters
        });
    }

    includeNoMeters(){
        this.setState({
            ...this.state,
            includedMeters: []
        });
    }

    renderExcludedMeters(){
        var content = this.state.excludedMeters
        .sort(
            (str1: string, str2: string) => {        
                if (str1 < str2) return -1;
                if (str1 > str2) return 1;
                return 0;
            })
        .map(em => {
            var isSelected = this.state.includedMeters.find(im => im == em) != null;
            return (
                <div className="uk-margin" key={em}>
                    <label>
                        <input 
                            className='uk-checkbox'
                            type='checkbox' 
                            onChange={() => this.handleChange(em)}
                            checked={isSelected}
                            /> {em}
                    </label>
                </div>
            )
        });
        
        return (<div>{content}</div>);
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
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Include Meters</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                {this.renderExcludedMeters()}
                                <hr />
                                <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.includeAllMeters()} type="button">
                                    <span className="uk-margin-small-right" data-uk-icon="icon: check" /> Select All
                                </button>
                                <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.includeNoMeters()} type="button">
                                    <span className="uk-margin-small-right" data-uk-icon="icon: close" /> Select None
                                </button>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={() => this.completeInclusion()} disabled={saveDisabled}>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, IncludeMetersDialogProps> = (dispatch) => {
    return {
        retrieveAccountDetail: (accountId: string) => dispatch(retrieveAccountDetail(accountId)),   
        includeMeters: (portfolioId: string, meters: string[]) => dispatch(includeMeters(portfolioId, meters))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, IncludeMetersDialogProps> = (state: ApplicationState) => {
    return {
        account: state.hierarchy.selected.value,
        working: state.hierarchy.selected.working,
        error: state.hierarchy.selected.error,
        errorMessage: state.hierarchy.selected.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(IncludeMetersDialog);