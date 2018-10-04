import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

class NotFound extends React.Component<RouteComponentProps<void>, {}> {
    render() {
        return (
            <div className="uk-cover-container uk-height-viewport">
            <img src={require('../images/panels.png')} alt="" data-uk-cover />
            <div className="app-loading-container uk-position-center">
                <div className="uk-card uk-card-body uk-card-default">
                    <img src={require('../images/tpi-flow-logo.png')} alt="TPI Flow" />
                    <div className="uk-alert uk-alert-warning uk-text-center" data-uk-alert>
                        <div><i className="fas fa-exclamation-triangle fa-2x"></i></div>
                        <h3 className="uk-margin-top">Sorry, we couldn't find the page you were looking for.</h3>                    
                        <p><Link to='/'>Click here</Link> to go back to TPI Flow.</p>

                        <hr />
                        <p>If you continue to receive this message, please contact us using the button below.</p>
                    </div>
                    <p className="uk-text-center"><a className="uk-button uk-button-default uk-button-small uk-margin-small-top" href={`mailto:support@tpiflow.com?subject=HTTP%20404at%20${window.location.href}`}><i className="fas fa-envelope uk-margin-small-right"></i>Get in touch</a></p>
                </div>
                
            </div>
        </div>
        )
    }
}

export default NotFound;