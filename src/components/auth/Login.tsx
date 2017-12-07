import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import Spinner from '../common/Spinner';

import { login } from '../../actions/authActions';

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
    login: (email: string, password:string, redirectRoute?: string) => void;
}

class Login extends React.Component<StateProps & DispatchProps, {}> {
    constructor(props: StateProps & DispatchProps) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this)
    }
    email: HTMLInputElement;
    password: HTMLInputElement;

    handleSubmit(event: any) {
        event.preventDefault();

        const email = this.email.value;
        const password = this.password.value

        this.props.login(email, password, null);
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
                        <h1>TPI Flow</h1>
                        <h4>Log in with your account details below.</h4>
                        <form className="auth-form">
                            <fieldset className="uk-fieldset">
                                {error}
                                <div className="uk-margin">
                                    <div className="uk-inline">
                                        <span className="uk-form-icon" data-uk-icon="icon: user"></span>
                                        <input id="email" className="uk-input" type="email" placeholder="Email" ref={ref => this.email = ref} />
                                    </div>
                                </div>

                                <div className="uk-margin">
                                    <div className="uk-margin uk-inline">
                                        <span className="uk-form-icon" data-uk-icon="icon: lock"></span>
                                        <input id="password" className="uk-input" type="password" placeholder="Password" ref={ref => this.password = ref} />
                                    </div>
                                </div>

                                {/* <Link to="/password_reset">Forgotten your password?</Link> */}
                                <button className="uk-button uk-button-primary" type="button" onClick={this.handleSubmit}>
                                    <span className="uk-margin-small-right" data-uk-icon="icon: sign-in" />
                                    Log in
                                </button>
                            </fieldset>
                        </form>
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