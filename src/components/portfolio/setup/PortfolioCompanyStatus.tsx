import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';

import { PortfolioDetails, 
         PortfolioRequirements,
       //PortfolioCompanyStatus
} from '../../../model/Models';

import Spinner from '../../common/Spinner';

//import { updateCompanyStatus } from '../../../actions/portfolioActions';

interface PortfolioCompanyStatusProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    //updateCompanyStatus: (status: PortfolioCompanyStatus) => void;
}

class PortfolioCompanyStatus extends React.Component<PortfolioCompanyStatusProps & StateProps & DispatchProps, {}> {
    constructor(){
        super();
        this.saveCompanyStatus = this.saveCompanyStatus.bind(this);
    }
    saveCompanyStatus(){
        //this.updateCompanyStatus();
    }
    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            return (<Spinner />);
        }
        var { details } = this.props;
        return (
            <div className="uk-card uk-card-default uk-card-body">
                <form>
                    <fieldset className="uk-fieldset">
                        <h3>Company Status</h3>
                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" checked /> Registered Charity</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" /> CCL Exception</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" /> VAT Status</label>
                        </div>

                        <div className="uk-margin">
                            <label><input className="uk-checkbox" type="checkbox" /> FiT Exception</label>
                        </div>
                        <div className="uk-margin-small uk-float-right">
                        <button className="uk-button uk-button-primary" type="button" onClick={this.saveCompanyStatus} disabled>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cog" />
                            Update
                        </button>
                        </div>
                    </fieldset>
                </form>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioCompanyStatusProps> = (dispatch) => {
    return {
        //updateCompanyStatus: (status: PortfolioCompanyStatus) => dispatch(updateCompanyStatus(status))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioCompanyStatusProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioCompanyStatus);