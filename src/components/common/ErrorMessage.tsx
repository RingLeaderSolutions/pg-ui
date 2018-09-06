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
      <div className="uk-alert uk-alert-danger uk-margin-small-bottom" data-uk-alert>
          <div className="uk-grid uk-grid-small" data-uk-grid>
              <div className="uk-width-auto">
                  <span className="uk-margin-small-right" data-uk-icon="icon: warning" />
              </div>
              <div className="uk-width-expand">
                  <p>{errorMessage}</p>
              </div>
          </div>
      </div>
    )
  }
}