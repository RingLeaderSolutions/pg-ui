import * as React from "react";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import { UtilityType } from "../../../model/Models";
import CreateTenderDialog from "./CreateTenderDialog";
import { openModalDialog } from "../../../actions/viewActions";
import ModalDialog from "../../common/ModalDialog";

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
    openModalDialog: (dialogId: string) => void;
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

        var modalName = `create_tender_${utilityDescription}_${this.props.isHalfHourly}`;

        var content = (
            <div>
                <div className="uk-grid uk-flex-center" data-uk-grid>
                    <button className="uk-button uk-button-primary" type="button" onClick={() => this.props.openModalDialog(modalName)}>
                        <span className="uk-margin-small-right" data-uk-icon={buttonIcon} />
                        {buttonContent}
                    </button>
                </div>
                <ModalDialog dialogId={modalName}>
                    <CreateTenderDialog portfolioId={this.props.portfolioId} utility={this.props.utilityType} utilityDescription={utilityDescription} isHalfHourly={this.props.isHalfHourly} />
                </ModalDialog>
            </div>)
        return this.renderCard(content);
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, CreateTenderProps> = (dispatch) => {
    return {
        openModalDialog: (dialogId: string) => dispatch(openModalDialog(dialogId))
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