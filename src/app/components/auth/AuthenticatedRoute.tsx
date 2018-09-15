import * as React from "react";
import { Route, RouteProps, Redirect } from 'react-router';

import AuthService from '../../services/authService';

const RedirectRoute : React.SFC<{}> = () => {
    return <Redirect to="/login" />
}

class AuthenticatedRoute extends React.Component<RouteProps, {}> {
    render() {
        let canAccess = AuthService.isLoggedIn();
        return canAccess ? (<Route {...this.props} />) : (<Route component={RedirectRoute} />);
    }
}

export default AuthenticatedRoute;