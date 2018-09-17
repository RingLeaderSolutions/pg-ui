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
                    <div className="uk-alert uk-alert-warning uk-margin-small-bottom" data-uk-alert>
                        <div className="uk-grid uk-grid-small" data-uk-grid>
                            <div className="uk-width-auto uk-flex uk-flex-middle">
                                <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                            </div>
                            <div className="uk-width-expand uk-flex uk-flex-middle">
                                <div>
                                    <h3>Sorry, we couldn't find that.</h3>
                                    <p><Link to='/'>Click here</Link> to go back to TPI Flow.</p>
                                    <hr />
                                    <p>If you continue to receive this message, please contact us using the button below.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="uk-width-auto uk-text-center">
                        <a className="uk-button uk-button-default uk-button-small uk-margin-small-top" href={`mailto:support@tpiflow.com?subject=HTTP%20404at%20${window.location.href}`}><i className="fas fa-envelope uk-margin-small-right"></i>Contact Support</a>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default NotFound;