import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import UploadLOADialog from "./UploadLOADialog";

interface PortfolioDocumentationSectionProps {
    details: PortfolioDetails;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
}

interface DispatchProps {
}

class PortfolioDocumentationSection extends React.Component<PortfolioDocumentationSectionProps & StateProps & DispatchProps, {}> {
    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.details == null){
            return (<Spinner />);
        }
        
        let loaContent = null;
        var { documentation } = this.props.details;
        var loaProvided = documentation != null && documentation.length != 0;
        if(loaProvided){
            loaContent = (
                <div data-uk-grid>
                    <div className="uk-width-auto@m">
                        <span className="icon-standard-cursor" data-uk-icon="icon: check; ratio: 1.5"></span>
                    </div>
                    <div className="uk-width-expand@m">
                        <h3>Letter of Authority provided</h3>
                    </div>
                    <div className="uk-width-auto@m">
                        <div className="uk-margin-small uk-float-right">
                            <button className="uk-button uk-button-default" type="button">
                                <span className="uk-margin-small-right icon-standard-cursor" data-uk-icon="icon: info" />
                                View
                            </button>
                        </div>  
                    </div>
                </div>);
        }
        else {
            loaContent = (
                <div data-uk-grid>
                    <div className="uk-width-auto@m">
                        <span className="icon-standard-cursor" data-uk-icon="icon: close; ratio: 1.5"></span>
                    </div>
                    <div className="uk-width-expand@m">
                        <h3>Requires Letter of Authority</h3>
                    </div>
                    <div className="uk-width-auto@m">
                        <div className="uk-margin-small uk-float-right">
                            <button className="uk-button uk-button-primary" type="button"  data-uk-toggle="target: #modal-upload-loa">
                                <span className="icon-standard-cursor uk-margin-small-right" data-uk-icon="icon: upload" />
                                Upload LOA
                            </button>
                        </div>
                    </div>
                </div>);
        }

        let siteListContent = null;
        var siteListProvided = this.props.details.siteCount != 0;
        if(siteListProvided){
            siteListContent = (
                <div data-uk-grid>
                    <div className="uk-width-auto@m">
                        <span className="icon-standard-cursor" data-uk-icon="icon: check; ratio: 1.5"></span>
                    </div>
                    <div className="uk-width-expand@m">
                        <h3>Site list provided</h3>
                    </div>
                </div>);
        }
        else {
            siteListContent = (
                <div data-uk-grid>
                    <div className="uk-width-auto@m">
                        <span className="icon-standard-cursor" data-uk-icon="icon: close; ratio: 1.5"></span>
                    </div>
                    <div className="uk-width-expand@m">
                        <h3>Requires Site List Upload</h3>
                    </div>
                    <div className="uk-width-auto@m">
                        <div className="uk-margin-small uk-float-right">
                            <button className="uk-button uk-button-primary" type="button">
                                <span className="uk-margin-small-right icon-standard-cursor" data-uk-icon="icon: upload" />
                                Upload Site List
                            </button>
                        </div>
                    </div>
                </div>);
        }

        return (
            <div className="uk-card uk-card-default uk-card-body">
                <h3>Documentation</h3>
                {siteListContent}
                <div className="uk-margin">{loaContent}</div>

                <div id="modal-upload-loa" data-uk-modal="center: true">
                    <UploadLOADialog details={this.props.details} />
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioDocumentationSectionProps> = (dispatch) => {
    return {
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDocumentationSectionProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDocumentationSection);