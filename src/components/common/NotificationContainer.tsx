import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { NotificationMessage } from '../../model/NotificationMessage';

const UIkit = require('uikit'); 


interface StateProps {
  lastMessage: NotificationMessage
}

class NotificationContainer extends React.Component<StateProps, {}> {
  render() {    
    if(this.props.lastMessage)
    {      
      UIkit.notification({
        message: this.props.lastMessage.Description,
        status: 'primary',
        pos: 'top-center',
        timeout: 5000
    });
    }
    return <div/>;
  }
}


const mapStateToProps: MapStateToProps<StateProps, {}> = (state: ApplicationState) => {
  return {
    lastMessage: state.notifications.lastMessage
  };
};

export default connect(mapStateToProps, null)(NotificationContainer);