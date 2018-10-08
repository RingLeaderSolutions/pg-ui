import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { login } from '../../actions/authActions';
import { RouteComponentProps } from "react-router-dom";
import { Strings } from "../../helpers/Utils";

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    login: (email: string, password:string, intendedPath?: string) => void;
}

interface LoginState {
    email: string;
    password: string;
}

class Login extends React.Component<RouteComponentProps<void> & StateProps & DispatchProps, LoginState> {
    loginButton: HTMLButtonElement;
    constructor(props:RouteComponentProps<void> &  StateProps & DispatchProps) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    componentDidMount(){
        this.loginButton.focus();
    }

    handleSubmit() {
        var { intendedPath } = this.props.location.state || { intendedPath: '/' };
        this.props.login(this.state.email, this.state.password, intendedPath);
    }

    handleFormChange(attribute: string, event: React.ChangeEvent<any>, isCheck: boolean = false){
        var value = isCheck ? event.target.checked : event.target.value;

        this.setState({
            ...this.state,
            [attribute]: value
        })
    }

    canSubmit(){
        return Strings.AreNotNullOrEmpty(this.state.email, this.state.password);
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
                                    <div className="icon-input-container uk-grid uk-grid-collapse icon-left">
                                        <div tabIndex={-1} className="uk-width-auto uk-flex uk-flex-middle" style={{background: "#f7f7f7"}}>
                                            <i className="fas fa-at"></i>
                                        </div>
                                        <input id="email" className="uk-input uk-width-expand" type="email" placeholder="Email"
                                            value={this.state.email}
                                            onChange={(e) => this.handleFormChange("email", e)} />
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <div className="icon-input-container uk-grid uk-grid-collapse icon-left" style={{background: "#f7f7f7"}}>
                                        <div tabIndex={-1} className="uk-width-auto uk-flex uk-flex-middle">
                                            <i className="fas fa-lock"></i>
                                        </div>
                                        <input id="password" className="uk-input uk-width-expand" type="password" placeholder="Password" 
                                            value={this.state.password}
                                            onChange={(e) => this.handleFormChange("password", e)}/>
                                    </div>
                                </div>

                                {/* <Link to="/password_reset">Forgotten your password?</Link> */}
                            </fieldset>
                        </form>
                        <button className="uk-button uk-button-primary" ref={(button) => this.loginButton = button}onClick={() => this.handleSubmit()} disabled={!this.canSubmit()}>
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
        login: (email: string, password: string, intendedPath: string) => dispatch(login(email, password, intendedPath))
    }
}

const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.auth.login.working,
        error: state.auth.login.error,
        errorMessage: state.auth.login.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(Login);