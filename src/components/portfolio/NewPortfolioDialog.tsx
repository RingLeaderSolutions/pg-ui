import * as React from "react";

const NewPortfolioDialog : React.SFC<{}> = () => {
    return (
        <div className="uk-modal-dialog">
            <button className="uk-modal-close-default" type="button" data-uk-close></button>
            <div className="uk-modal-header">
                <h2 className="uk-modal-title">New Portfolio</h2>
            </div>
            <div className="uk-modal-body">
                <div className="uk-margin">
                    <input className="uk-input" type="text" placeholder="Title" />
                    <input className="uk-input" type="text" placeholder="Status" />
                    <input className="uk-input" type="text" placeholder="Contract Start" />
                    <input className="uk-input" type="text" placeholder="Contract End" />
                    <input className="uk-input" type="text" placeholder="Team Id" />
                    <input className="uk-input" type="text" placeholder="Owner Id" />
                    <input className="uk-input" type="text" placeholder="Category" />
                    <input className="uk-input" type="text" placeholder="Client" />
                    <input className="uk-input" type="text" placeholder="Support Owner" />
                </div>
            </div>
            <div className="uk-modal-footer uk-text-right">
                <button className="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button className="uk-button uk-button-primary uk-modal-close" type="button">Upload</button>
            </div>
        </div>)
}

export default NewPortfolioDialog;