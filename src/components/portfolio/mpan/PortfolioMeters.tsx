import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MeterPortfolio, Mpan, MeterType } from '../../../model/Meter';
import Spinner from '../../common/Spinner';
import { Link } from 'react-router-dom';

import GasMeterTable from './GasMeterTable';
import ElectricityMeterTable from './ElectricityMeterTable';

import { getMeters, fetchMeterConsumption } from '../../../actions/meterActions';
import MeterConsumptionDialog from "./MeterConsumptionDialog";

interface PortfolioMetersProps {
    portfolio: Portfolio;
}

interface StateProps {
    details: PortfolioDetails;
    meterPortfolio: MeterPortfolio;
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
    getMeters: (portfolioId: string) => void;
    fetchMeterConsumption: (portfolioId: string) => void;
}

interface State {
    tab: string
}

class PortfolioMeters extends React.Component<PortfolioMetersProps & StateProps & DispatchProps, State> {
    constructor() {
        super();

        this.state = {
            tab: 'electricity'
        };
    }

    loadConsumption(){
        this.props.fetchMeterConsumption(this.props.portfolio.id);        
    }

    componentDidMount(){
        if(this.props.portfolio != null){
            this.props.getMeters(this.props.portfolio.id);
        }
    }

    selectTab(tab:string){
        this.setState({
            tab: tab
        });
    }

    render() {
        if(this.props.working || this.props.meterPortfolio == null){
            return (<Spinner />);
        }

        return (
            <div>
                <div>
                    <p className='uk-text-right'>
                        <button className='uk-button uk-button-default uk-button-small uk-margin-small-right view-consumption-button' data-uk-toggle="target: #modal-view-consumption" onClick={() => this.loadConsumption()}><span data-uk-icon='icon: list' /> View Meter Consumption</button>                
                    </p>
                </div>

                <div className='uk-flex uk-flex-column portfolio-meters'>
                    <div className="uk-overflow-auto">
                        <ul data-uk-tab>
                            <li className={this.state.tab === 'electricity' ? 'uk-active' : null}>
                                <a href='#' onClick={() =>this.selectTab('electricity')}>Electricity</a>
                            </li>
                            <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                                <a href='#' onClick={() =>this.selectTab('gas')}>Gas</a>
                            </li>
                        </ul>
                        <ul className='uk-switcher'>
                            <li className={this.state.tab === 'electricity' ? 'uk-active' : null}>
                                <ElectricityMeterTable meterPortfolio={this.props.meterPortfolio} portfolio={this.props.portfolio} details={this.props.details}/>
                            </li>
                            <li className={this.state.tab === 'gas' ? 'uk-active' : null}>
                                <GasMeterTable meterPortfolio={this.props.meterPortfolio} portfolio={this.props.portfolio} details={this.props.details}/>
                            </li>
                        </ul>
                    </div>
                </div>
                <div id="modal-view-consumption" data-uk-modal="center: true">
                    <MeterConsumptionDialog />
                </div>
            </div>
        );
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMetersProps> = (dispatch) => {
    return {
        getMeters: (portfolioId: string) => dispatch(getMeters(portfolioId)),
        fetchMeterConsumption: (portfolioId: string) => dispatch(fetchMeterConsumption(portfolioId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioMetersProps> = (state: ApplicationState) => {
    return {
        details: state.portfolio.details.value,
        
        meterPortfolio: state.meters.all.value,
        working: state.meters.all.working,
        error: state.meters.all.error,
        errorMessage: state.meters.all.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMeters);