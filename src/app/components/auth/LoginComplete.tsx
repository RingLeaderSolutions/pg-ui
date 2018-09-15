import * as React from "react";
import { RouteComponentProps, Redirect } from 'react-router';
import Spinner from '../common/Spinner';

import AuthService from '../../services/authService';

class LoginComplete extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        var hash = this.props.location.hash;
        AuthService.parseHash(hash);
        return (
            <div>
                <Spinner hasMargin={true}/>
            </div>
        )
    }
}

export default LoginComplete;