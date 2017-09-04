import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';

interface ErrorMessageProps {
  errorMessage: string;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps, {}> {
  render() {
    var errorMessage = "Sorry! There was an error retrieving data for this component.";
    if(this.props.errorMessage != undefined && this.props.errorMessage != ""){
      errorMessage = this.props.errorMessage;
    }
    return (
        <div className="uk-alert-danger" data-uk-alert>
            <p>{errorMessage}</p>
        </div>);
  }
}