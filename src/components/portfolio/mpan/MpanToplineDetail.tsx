import * as React from "react";
import Header from "../../common/Header";
import CounterCard from "../../common/CounterCard";
import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { MpanTopline, Portfolio, DocumentGroup } from '../../../model/Models';
import Spinner from '../../common/Spinner';

import { getMpanTopline } from '../../../actions/portfolioActions';

import * as moment from 'moment';

interface MpanToplineDetailProps extends RouteComponentProps<void> {
}

interface StateProps {
  topline: MpanTopline;
  working: boolean;
  error: boolean;
  errorMessage: string;
  portfolio: Portfolio;
}

interface DispatchProps {
    getTopline: (toplineId: string) => void;
}

class MpanToplineDetail extends React.Component<MpanToplineDetailProps & StateProps & DispatchProps, {}> {
    agentOptions: string[] = ["EELC","EMEB","ETCL","GUCL","HYDE","IPNL","LENG","LOND","MANW","MIDE","NEED","NORW","SEEB","SOUT","SPOW","SWAE","SWEB","UKDC","YELG",
    "DASL","SSIL","UDMS"];
    retrievalMethods: string[] = [ "Visual", "Manual", "Not Known", "Unmetered", "Remote"];
    componentDidMount(){
        var toplineId = this.props.location.pathname.split('/')[2];        
        this.props.getTopline(toplineId);
    }

    returnToPortfolio(){
        if(this.props.portfolio){
            this.props.history.push(`/portfolio/${this.props.portfolio.id}`);            
        }
        else {
            this.props.history.push(`/portfolios`);                        
        }
    }

    parseRetrievalMethod(){
        var firstChar = this.props.topline.retrievalMethod.substr(0, 1);
        
        var retrievalMethod;
        this.retrievalMethods.forEach(element => {
            if(element.substr(0, 1) == firstChar){
                retrievalMethod = element;
                return;
            }
        });

        return retrievalMethod;
    }

    createOption(value: string, index: number){
        return (<option key={index}>{value}</option>);
    }

    render() {
        var { topline } = this.props;
        if(this.props.working || topline == null){
            return (<Spinner />);
        }

        var group = topline.group == DocumentGroup.Proposed ? "Proposed" : "Current";
        var headerTitle = `${group} MPAN Topline: ${topline.mpanCore}`;

        var creatorName = topline.creator == null ? "Unknown" : `${topline.creator.firstName} ${topline.creator.lastName}`;
        var creationTime = moment.utc(topline.created).local().fromNow();   

        var agentOptions = this.agentOptions.map((o, index) => this.createOption(o, index));
        var retrievalOptions = this.retrievalMethods.map((o, index) => this.createOption(o, index));

        var retrievalMethod = this.parseRetrievalMethod();

        return (
            <div className="content-inner-portfolio">
                <Header title={headerTitle} />
                <div className="content-topline">
                    <button className="uk-button uk-button-default uk-button-small" onClick={() => this.returnToPortfolio()}><span data-uk-icon="icon: reply" />  Return to portfolio</button>
                    <div className="uk-child-width-expand@s uk-text-center uk-grid uk-margin-top" data-uk-grid data-uk-height-match="target: > div > .uk-card">
                        <CounterCard title={creatorName}
                                    error={this.props.error} 
                                    errorMessage={this.props.errorMessage}
                                    loaded={!this.props.working} 
                                    label="Uploader" 
                                    small />

                        <CounterCard title={creationTime} 
                                    error={this.props.error} 
                                    errorMessage={this.props.errorMessage}
                                    loaded={!this.props.working} 
                                    label="Uploaded"
                                    small />
                                    
                        <CounterCard title={group} 
                                    label="Status" 
                                    error={this.props.error} 
                                    errorMessage={this.props.errorMessage}
                                    loaded={!this.props.working} 
                                    small />
                    </div>
                    <h3>Data</h3>
                    <form className="uk-grid" data-uk-grid>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="input-mpan-core">MPAN Core</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" id="input-mpan-core" type="text" defaultValue={this.props.topline.mpanCore} />
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="select-meter-type">Meter Type</label>
                            <div className="uk-form-controls">
                                <select className="uk-select" id="select-meter-type" defaultValue={this.props.topline.meterType}>
                                    <option>HH</option>
                                </select>
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="checkbox-new-connection">New connection</label>
                            <div className="uk-form-controls">
                                <input className="uk-checkbox" id="checkbox-new-connection" type="checkbox" checked={this.props.topline.newConnection} />
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="checkbox-change-tenancy">COT</label>
                            <div className="uk-form-controls">
                                <input className="uk-checkbox" id="checkbox-change-tenancy" type="checkbox" checked={this.props.topline.cot} />
                            </div>
                        </div>

                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="input-meter-timeswitch">Meter Timeswitch Code</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" id="input-meter-timeswitch" type="text" defaultValue={this.props.topline.mtc} />
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="input-llf">LLF</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" id="input-llf" type="text" defaultValue={this.props.topline.llf} />
                            </div>
                        </div>

                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="input-profile-class">Profile Class</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" id="input-profile-class" type="text" defaultValue={this.props.topline.profileClass} />
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="select-retrieval-method">Retrieval Method</label>
                            <div className="uk-form-controls">
                                <select className="uk-select" id="select-retrieval-method" defaultValue={retrievalMethod}>
                                    {retrievalOptions}
                                </select>
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="select-gsp">GSP Group</label>
                            <div className="uk-form-controls">
                                <select className="uk-select" id="select-gsp" defaultValue={this.props.topline.gspGroup}>
                                    <option>_A</option>
                                    <option>_B</option>
                                    <option>_C</option>
                                    <option>_D</option>
                                    <option>_E</option>
                                    <option>_G</option>
                                    <option>_H</option>
                                    <option>_J</option>
                                    <option>_K</option>
                                    <option>_L</option>
                                    <option>_M</option>
                                    <option>_N</option>
                                    <option>_P</option>
                                </select>
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="input-measurement-class">Measurement Class</label>
                            <div className="uk-form-controls">
                                <input className="uk-input" id="input-measurement-class" type="text" defaultValue={this.props.topline.measurementClass} />
                            </div>
                        </div>
                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="select-energisation">Energisation</label>
                            <div className="uk-form-controls">
                                <select className="uk-select" id="select-energisation" defaultValue={this.props.topline.energisation}>
                                    <option>Energised</option>
                                    <option>De-energised</option>
                                </select>
                            </div>
                        </div>

                        <div className="uk-width-1-6@s">
                            <label className="uk-form-label" data-for="select-voltage">Voltage</label>
                            <div className="uk-form-controls">
                                <select className="uk-select" id="select-voltage" defaultValue={this.props.topline.voltage}>
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Extra High</option>
                                </select>
                            </div>
                        </div>

                        <div className="uk-width-1-2">
                            <div className="uk-card uk-card-default uk-card-body">
                                <h4>Agents</h4>

                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="select-da">Energisation</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="select-da" defaultValue={this.props.topline.da}>
                                            {agentOptions}
                                        </select>
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="select-dc">Energisation</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="select-dc" defaultValue={this.props.topline.dc}>
                                            {agentOptions}                                        
                                        </select>
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <label className="uk-form-label" data-for="select-mo">Energisation</label>
                                    <div className="uk-form-controls">
                                        <select className="uk-select" id="select-mo" defaultValue={this.props.topline.mo}>
                                            {agentOptions}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="uk-width-1-2">
                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="select-connection">Connection</label>
                                <div className="uk-form-controls">
                                    <select className="uk-select" id="select-connection" defaultValue={this.props.topline.connection}>
                                        <option>Network</option>
                                        <option>Substation</option>
                                    </select>
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <label>
                                        <input className="uk-checkbox" id="checkbox-duos-fixed" type="checkbox" checked={this.props.topline.duosFixed} /> DUoS Fixed Charges</label>
                                </div>
                            </div>

                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="input-eac">EAC</label>
                                <div className="uk-form-controls">
                                    <input className="uk-input" id="input-eac" type="text" defaultValue={this.props.topline.eac} disabled />
                                </div>
                            </div>

                            <div className="uk-margin">
                                <label className="uk-form-label" data-for="input-ssc">SSC</label>
                                <div className="uk-form-controls">
                                    <input className="uk-input" id="input-ssc" type="text" defaultValue={this.props.topline.ssc} disabled />
                                </div>
                            </div>
                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <label><input className="uk-checkbox" id="checkbox-mop" type="checkbox" /> MOP in place</label>
                                </div>
                            </div>

                            <div className="uk-margin">
                                <div className="uk-form-controls">
                                    <label><input className="uk-checkbox" id="checkbox-dcda" type="checkbox" /> DC/DA contract in place</label>
                                </div>
                            </div>
                        </div>

                        <div className="uk-width-1-4">
                            
                        </div>

                        <div className="uk-width-1-1 topline-actions uk-text-right">
                            <button className="uk-button uk-button-primary" onClick={() => this.returnToPortfolio()}><span data-uk-icon="icon: check" /> Validate</button>
                            <button className="uk-button uk-button-secondary uk-margin-left" onClick={() => this.returnToPortfolio()}><span data-uk-icon="icon: close" /> Cancel</button>                                                        
                        </div>
                    </form>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, MpanToplineDetailProps> = (dispatch) => {
    return {
        getTopline: (toplineId: string) => dispatch(getMpanTopline(toplineId))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, MpanToplineDetailProps> = (state: ApplicationState) => {
    return {
        topline: state.portfolio.topline.value,
        working: state.portfolio.topline.working,
        error: state.portfolio.topline.error,
        errorMessage: state.portfolio.topline.errorMessage,
        portfolio: state.portfolio.selected.value
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(MpanToplineDetail);