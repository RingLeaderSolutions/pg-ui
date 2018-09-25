import * as React from "react";

interface NotificationProps{
    message: string;
    icon: string;
}

export default class Notification extends React.Component<NotificationProps, {}> {
    render() {
        const { message, icon } = this.props;
        return (
            <div className="uk-grid uk-grid-collapse">
                <div className="uk-width-auto uk-flex uk-flex-middle">
                    <i className={`fas fa-${icon} uk-margin-small-right fa-lg`}></i> 
                </div>
                <div className="uk-width-expand uk-flex uk-flex-middle">
                    <p>{message}</p> 
                </div>
            </div>
        )
    }
}