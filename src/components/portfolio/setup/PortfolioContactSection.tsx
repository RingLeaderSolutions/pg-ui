import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioRequirements } from '../../../model/Models';
import Spinner from '../../common/Spinner';

interface PortfolioContactSectionProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
}

class PortfolioContactSection extends React.Component<PortfolioContactSectionProps & StateProps & DispatchProps, {}> {
    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            return (<Spinner />);
        }
        
        var { portfolio } = this.props.details;
        var contactProvided = portfolio.contact != null;
        let content = null;

        if(contactProvided){
            var contact = portfolio.contact;
            content = (
                <div>
                    <div data-uk-grid>
                        <div className="uk-width-auto@m">
                            <span data-uk-icon="icon: check; ratio: 1.5"></span>
                        </div>
                        <div className="uk-width-expand@m">
                            <h3>Contact provided</h3>
                        </div>
                    </div>
                    <div className="uk-margin-large-left uk-margin-top">
                        <div>{contact.firstName}</div>
                        <div>{contact.lastName}</div>
                        <div>{contact.email}</div>
                        <div>{contact.firstName}</div>
                    </div>
                </div>
            )
        }
        else {
            content = (
                <div>
                    <div>
                        <span data-uk-icon="icon: close; ratio: 3.5"></span>
                        <h3>Requires contact details</h3>
                    </div>
                    <div className="uk-margin-small uk-float-right">
                        <button className="uk-button uk-button-primary" type="button">
                            <span className="uk-margin-small-right" data-uk-icon="icon: user" />
                            Add contact
                        </button>
                    </div>
                </div>
            )
        }
        return (
            <div className="uk-card uk-card-default uk-card-body">
                {content}
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioContactSectionProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioContactSectionProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioContactSection);