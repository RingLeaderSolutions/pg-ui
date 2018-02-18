import * as React from 'react';

interface ErrorMessageProps {
  content: string;
}

export default class ErrorMessage extends React.Component<ErrorMessageProps, {}> {
  render() {
    var errorMessage = "Sorry! There was an error retrieving data for this component.";
    if(this.props.content != undefined && this.props.content != ""){
      errorMessage = this.props.content;
    }
    return (
        <div className="uk-alert-danger" data-uk-alert>
            <p>{errorMessage}</p>
        </div>);
  }
}