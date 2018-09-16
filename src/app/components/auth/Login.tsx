import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { login } from '../../actions/authActions';
import { StringsAreNotNullOrEmpty } from "../../helpers/ValidationHelpers";

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    login: (email: string, password:string, redirectRoute?: string) => void;
}

interface LoginState {
    email: string;
    password: string;
}

class Login extends React.Component<StateProps & DispatchProps, LoginState> {
    constructor(props: StateProps & DispatchProps) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    handleSubmit() {
        this.props.login(this.state.email, this.state.password, null);
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return StringsAreNotNullOrEmpty(this.state.email, this.state.password);
    }

    render() {
        let error = null;
        if (this.props.error) {
            error = (
                <div className="uk-alert-danger" data-uk-alert>
                    <p>{this.props.errorMessage}</p>
                </div>);
        }
        return (
            <div className="uk-cover-container uk-height-viewport">
                <img src={require('../../images/panels.png')} alt="" data-uk-cover />
                <div className="uk-position-center">
                    <div className="uk-card uk-card-body uk-card-default">
                        <img src={require('../../images/tpi-flow-logo.png')} alt="TPI Flow" />
                        <h4>Log in with your account details below.</h4>
                        <form>
                            <fieldset className="uk-fieldset">
                                {error}
                                <div className="uk-margin">
                                    <div className="uk-inline">
                                        <span className="uk-form-icon" data-uk-icon="icon: user"></span>
                                        <input id="email" className="uk-input" type="email" placeholder="Email"
                                        value={this.state.email}
                                        onChange={(e) => this.handleFormChange("email", e)} />
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <div className="uk-margin uk-inline">
                                        <span className="uk-form-icon" data-uk-icon="icon: lock"></span>
                                        <input id="password" className="uk-input" type="password" placeholder="Password" 
                                        value={this.state.password}
                                        onChange={(e) => this.handleFormChange("password", e)}/>
                                    </div>
                                </div>

                                {/* <Link to="/password_reset">Forgotten your password?</Link> */}
                            </fieldset>
                        </form>
                        <button className="uk-button uk-button-primary" onClick={() => this.handleSubmit()} disabled={!this.canSubmit()}>
                            <i className="fas fa-sign-in-alt uk-margin-small-right"></i>
                            Log in
                        </button>
                        </div>
                </div>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = (dispatch) => {
    return {
        login: (email: string, password: string) => dispatch(login(email, password))
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
    return {
        working: state.auth.login.working,
        error: state.auth.login.error,
        errorMessage: state.auth.login.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Login);