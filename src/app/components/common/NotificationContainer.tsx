import * as React from "react";
import { connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { NotificationMessage } from '../../model/NotificationMessage';
import * as UIkit from 'uikit';


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


const mapStateToProps: MapStateToProps<StateProps, {}, ApplicationState> = (state: ApplicationState) => {
  return {
    lastMessage: state.notifications.lastMessage
  };
};

export default connect(mapStateToProps, null)(NotificationContainer);