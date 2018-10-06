import * as React from "react";

export const TenderCompleteWarning: React.SFC<{}> = () => {
    return (<div className={`uk-alert uk-alert-success`} data-uk-alert>
        <div className="uk-grid uk-grid-small" data-uk-grid>
            <div className="uk-width-auto uk-flex uk-flex-middle">
                <i className="fas fa-eye uk-margin-small-right"></i>
            </div>
            <div className="uk-width-expand uk-flex uk-flex-middle">
                <p>This tender is in read-only mode because an offer has been accepted.</p>
            </div>
        </div>
    </div>);
}