import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioContact } from '../../../model/Models';
import Spinner from '../../common/Spinner';

//import { addPortfolioContact } from '../../../actions/portfolioActions';

interface AddContactDialogProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    // addPortfolioContact: (contact: PortfolioContact) => void;
}

class AddContactDialog extends React.Component<AddContactDialogProps & StateProps & DispatchProps, {}> {
    constructor(props: AddContactDialogProps & StateProps & DispatchProps){
        super();
        this.addContact = this.addContact.bind(this);
    }

    addContact() {
        // TODO: Add contact.
    }

    render() {
        var { details } = this.props;

        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Add Contact</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className="uk-margin">
                                    <input className="uk-input" type="text" placeholder="First Name" />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input" type="text" placeholder="Last Name" />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input" type="text" placeholder="Email" />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input" type="text" placeholder="Phone #" />
                                </div>

                                <div className="uk-margin">
                                    <input className="uk-input" type="text" placeholder="Role" />
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary" type="button">Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AddContactDialogProps> = (dispatch) => {
    return {
        //addPortfolioContact: (contact: PortfolioContact) => dispatch(addPortfolioContact(contact))        
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AddContactDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AddContactDialog);