import * as React from "react";
import { RouteComponentProps } from 'react-router';

import AuthService from '../../services/authService';
import { Link } from "react-router-dom";

class Logout extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        AuthService.clearSession();
        return (
            <div className="uk-cover-container uk-height-viewport">
                <img src={require('../../images/powerline.png')} alt="" data-uk-cover />
                <div className="uk-position-center">
                    <div className="uk-card uk-card-body uk-card-default">
                        <h2>You have successfully logged out of the system.</h2>
                        <Link to="/login">
                            <button className="uk-button uk-button-primary" type="button">
                                <i className="fas fa-sign-in-alt uk-margin-small-right"></i>
                                Log back in
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

export default Logout;