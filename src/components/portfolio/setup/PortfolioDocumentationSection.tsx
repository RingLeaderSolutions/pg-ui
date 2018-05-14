import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import UploadLOADialog from "./UploadLOADialog";
import UploadSiteListDialog from "./UploadSiteListDialog";
import * as moment from 'moment';

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
        var loa = documentation.find(d => d.documentType == "loa");
        var loaProvided = loa != null;
        if(loaProvided){
            loaContent = (
                <div data-uk-grid>
                    <div className="uk-width-auto@m">
                        <span className="icon-standard-cursor" data-uk-icon="icon: check; ratio: 1.5"></span>
                    </div>
                    <div className="uk-width-expand@m">
                        <h3>Letter of Authority provided, expires {moment.utc(loa.expiry).format('ll')}</h3>
                    </div>
                    <div className="uk-width-1-3">
                        <a className="uk-button uk-button-default uk-button-small uk-align-right" href={loa.blobFileName}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                            Download
                        </a> 
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

        return (
            <div className="uk-card uk-card-default uk-card-body">
                <h3>Documentation</h3>
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