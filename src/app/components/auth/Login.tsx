import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';

import { login } from '../../actions/authActions';
import { RouteComponentProps } from "react-router-dom";
import { Strings } from "../../helpers/Utils";
import PreAuthAppContainer from "../common/PreAuthAppContainer";
import { Form, FormGroup, Label, Input, Button, Alert } from "reactstrap";

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
    constructor(props:RouteComponentProps<void> &  StateProps & DispatchProps) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
        return (
            <PreAuthAppContainer>
                {this.props.error &&  (
                    <Alert color="danger"><i className="fas fa-exclamation-triangle mr-2"></i>{this.props.errorMessage}</Alert>
                )}
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="userEmail" className="text-left">Email address</Label>
                        <Input type="email" name="email" id="userEmail" placeholder="Enter email"
                            value={this.state.email}
                            onChange={(e) => this.handleFormChange("email", e)} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="userPassword" className="text-left">Password</Label>
                        <Input type="password" name="password" id="userPassword" placeholder="Password" 
                            value={this.state.password}
                            onChange={(e) => this.handleFormChange("password", e)} />
                    </FormGroup>
                    <Button color="primary" 
                            type="submit"
                            className="btn-pill d-table mx-auto"
                            disabled={!this.canSubmit()}>
                            <i className="fas fa-sign-in-alt mr-2"></i>
                            Log in
                    </Button>
                </Form>
            </PreAuthAppContainer>)
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