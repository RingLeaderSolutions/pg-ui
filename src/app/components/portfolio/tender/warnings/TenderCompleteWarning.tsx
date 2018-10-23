import * as React from "react";
import { Tender, isComplete } from "../../../../model/Tender";
import { Alert } from "reactstrap";

export const TenderCompleteWarning: React.SFC<{ tender: Tender, className: string }> = (props) => {
    let { tender, className } = props;

    if(!isComplete(tender)){
        return null;
    }

    return (
        <Alert color="success" className={className}>
            <div className="d-flex align-items-center">
                <i className="fas fa-eye mr-2"></i>
                This tender is in read-only mode because an offer has been accepted.
            </div>
        </Alert>);
}