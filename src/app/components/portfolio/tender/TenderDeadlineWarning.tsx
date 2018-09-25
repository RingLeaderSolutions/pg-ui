import * as React from "react";
import * as moment from "moment";

interface TenderDeadlineWarningProps{
    deadline: moment.Moment;
    className?: string;
}

export default class TenderDeadlineWarning extends React.Component<TenderDeadlineWarningProps, {}> {
    renderDeadlineWarning(initialText: JSX.Element){
        return (
            <div className={`uk-alert uk-alert-warning ${this.props.className || ''}`} data-uk-alert>
                <div className="uk-grid uk-grid-small" data-uk-grid>
                    <div className="uk-width-auto uk-flex uk-flex-middle">
                        <i className="fas fa-exclamation-triangle uk-margin-small-right"></i>
                    </div>
                    <div className="uk-width-expand uk-flex uk-flex-middle">
                        <div>
                            {initialText}
                            <p>You won't be able to generate new or issue existing requirements packs to suppliers until this has been set to a date in the future.</p>
                        </div>
                    </div>
                </div>
            </div>);
    }

    render() {
        let { deadline } = this.props;
        
        if(!deadline || !deadline.isValid()){
            let promptMessage = (<p>You haven't set a deadline for this tender yet.</p>);
            return this.renderDeadlineWarning(promptMessage);
        }
        
        if(moment().diff(deadline, 'hours') > 0){
            let promptMessage = (<p>This tender's deadline ({deadline.format("DD/MM/YYYY")}) has now passed.</p>);
            return this.renderDeadlineWarning(promptMessage)
        }
        
        return null;
    }
}