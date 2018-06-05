import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import { UtilityType } from "../../../model/Models";
import CreateTenderDialog from "./CreateTenderDialog";

interface CreateTenderProps {
    portfolioId: string;
    isHalfHourly: boolean;
    utilityType: UtilityType;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
}

interface DispatchProps {
}

class CreateTenderView extends React.Component<CreateTenderProps & StateProps & DispatchProps, {}> {    
    renderCard(content: any){
        return (
            <div className="uk-card uk-card-default uk-card-body">
                {content}
            </div>);
    }
    
    render() {
        if(this.props.error){
            var error = (<ErrorMessage content={this.props.errorMessage} />);
            return this.renderCard(error);
        }
        if(this.props.working){
            var spinner = (<Spinner hasMargin={true}/>);
            return this.renderCard(spinner);
        }

        var buttonIcon;
        var buttonContent;
        var utilityDescription;
        if(this.props.utilityType == UtilityType.Electricity){
            buttonIcon = "icon: bolt";
            buttonContent = this.props.isHalfHourly ? "Create a half-hourly electricity tender" : "Create a non-half-hourly electricity tender";
            utilityDescription  = "Electricity";
        }
        else {
            buttonIcon = "icon: world";
            buttonContent = "Create a gas tender";
            utilityDescription  = "Gas";
        }

        var content = (
            <div>
                <div className="uk-grid uk-flex-center" data-uk-grid>
                    <button className="uk-button uk-button-primary" type="button" data-uk-toggle="target: #modal-create-tender">
                        <span className="uk-margin-small-right" data-uk-icon={buttonIcon} />
                        {buttonContent}
                    </button>
                </div>
                <div id="modal-create-tender" data-uk-modal="center: true">
                    <CreateTenderDialog portfolioId={this.props.portfolioId} utility={this.props.utilityType} utilityDescription={utilityDescription} isHalfHourly={this.props.isHalfHourly} />
                </div>
            </div>)
        return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateTenderProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, CreateTenderProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.create_tender.working,
        error: state.portfolio.tender.create_tender.error,
        errorMessage: state.portfolio.tender.create_tender.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(CreateTenderView);