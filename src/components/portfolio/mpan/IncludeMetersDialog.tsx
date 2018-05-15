import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { UtilityType, Portfolio, AccountDetail, HierarchyMpan, PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { FormEvent } from "react";
import * as moment from 'moment';
import DatePicker from 'react-datepicker';

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
    includedMeters: string[];
}

class IncludeMetersDialog extends React.Component<IncludeMetersDialogProps & StateProps & DispatchProps, IncludedMetersDialogState> {
    constructor() {
        super();
        this.state = {
            includedMeters: []
        }
    }

    componentDidMount(){
        this.props.retrieveAccountDetail(this.props.portfolio.portfolio.accountId)
    }
    completeInclusion(){
        this.props.includeMeters(this.props.portfolio.portfolio.id, this.state.includedMeters);
    }

    handleChange(meter: string){
        if(this.state.includedMeters.indexOf(meter) < 0){
            this.setState({
                includedMeters: [...this.state.includedMeters, meter]
            });
            return;    
        }

        this.setState({
            includedMeters: this.state.includedMeters.filter(im => im != meter)
        });
    }

    selectMany<TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] {
        return input.reduce((out, inx) => {
            out.push(...selectListFn(inx));
            return out;
        }, new Array<TOut>());
    }

    getExcludedMpans() : string[]{
        var mpans = this.selectMany(this.props.account.sites, (s) => s.mpans);
        var cores = mpans.map(mp => mp.mpanCore);

        return cores.filter(c => this.props.includedMeters.indexOf(c) < 0);
    }

    getExcludedMprns() : string[]{
        var mprns = this.selectMany(this.props.account.sites, (s) => s.mprns);
        var cores = mprns.map(mp => mp.mprnCore);

        return cores.filter(c => this.props.includedMeters.indexOf(c) < 0);
    }

    renderExcludedMeters(){
        var excludedMeters: string[];
        if(this.props.utility == UtilityType.Electricity){
            excludedMeters =  this.getExcludedMpans();
        }
        else {
            excludedMeters = this.getExcludedMprns();
        }

        var content = excludedMeters.map(em => {
            return (
                <div className="uk-margin" key={em}>
                    <label>
                        <input 
                            className='uk-checkbox'
                            type='checkbox' 
                            onChange={() => this.handleChange(em)}
                            /> {em}
                    </label>
                </div>
            )
        })

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