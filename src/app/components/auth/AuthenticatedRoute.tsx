import * as React from "react";
import { RouteProps, Redirect, Route } from "react-router-dom";
import { History } from 'history';
import { LocalStorageRepository } from "../../services/LocalStorageRepository";

class LoginRedirect extends React.Component<RouteProps, {}> {
    render() {        
        var location: History.LocationDescriptor = {
            pathname: `/login`,
            state: { intendedPath: this.props.location.pathname }
        }

        return (<Redirect to={location} />);
    }
}

class AuthenticatedRoute extends React.Component<RouteProps, {}> {
    render() {
        var token = new LocalStorageRepository().fetchIdToken();
        let canAccess = token && token != '';
        return canAccess ? (<Route {...this.props} />) : (<LoginRedirect {...this.props}/>);
    }
}

export default AuthenticatedRoute;