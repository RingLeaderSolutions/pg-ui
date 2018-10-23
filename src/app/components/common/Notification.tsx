import * as React from "react";

interface NotificationProps{
    message: string;
    icon: string;
}

export default class Notification extends React.Component<NotificationProps, {}> {
    render() {
        const { message, icon } = this.props;
        return (
            <div className="d-flex">
                <i className={`fas fa-${icon} mr-2 fa-lg`}></i> 
                <p className="flex-grow-1 mb-0">{message}</p> 
            </div>);
    }
}