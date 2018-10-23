import * as React from "react";
import * as moment from "moment";
import { Alert } from "reactstrap";

interface TenderDeadlineWarningProps{
    deadline: moment.Moment;
    className?: string;
}

export default class TenderDeadlineWarning extends React.Component<TenderDeadlineWarningProps, {}> {
    private static readonly noFurtherActionText = "You won't be able to generate new or issue existing requirements packs to suppliers until this has been set to a date in the future.";
    renderDeadlineWarning(text: JSX.Element){
        return (
            <Alert color="danger">
                <div className="d-flex align-items-center">
                    <i className="fas fa-exclamation-triangle mr-2"></i>
                    {text} 
                </div>
            </Alert>);
    }

    render() {
        let { deadline } = this.props;
        
        if(!deadline || !deadline.isValid()){
            let promptMessage = (<p className="m-0">You haven't set a deadline for this tender yet. {TenderDeadlineWarning.noFurtherActionText}</p>);
            return this.renderDeadlineWarning(promptMessage);
        }
        
        if(moment().diff(deadline, 'hours') > 0){
            let promptMessage = (<p className="m-0">This tender's deadline ({deadline.format("DD/MM/YYYY")}) has now passed. {TenderDeadlineWarning.noFurtherActionText}</p>);
            return this.renderDeadlineWarning(promptMessage)
        }
        
        return null;
    }
}