import * as React from "react";
import Header from "../../common/Header";
import ErrorMessage from "../../common/ErrorMessage";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import { PortfolioDetails, PortfolioContact } from '../../../model/Models';
import Spinner from '../../common/Spinner';
import { FormEvent } from "react";
import { Tender, TenderContract, TenderSupplier } from "../../../model/Tender";

import { uploadElectricityOffer, uploadGasOffer } from '../../../actions/tenderActions';

interface UploadOfferDialogProps {
    tenderId: string;
    utilityType: string;
}

interface StateProps {
  working: boolean;
  error: boolean;
  errorMessage: string;
  suppliers: TenderSupplier[];
}

interface DispatchProps {
    uploadElectricityOffer: (tenderId: string, supplierId: string, file: Blob) => void;
    uploadGasOffer: (tenderId: string, supplierId: string, file: Blob) => void;
}

interface UploadOfferState {
    file: Blob;
}

class UploadOfferDialog extends React.Component<UploadOfferDialogProps & StateProps & DispatchProps, UploadOfferState> {
    constructor(props: UploadOfferDialogProps & StateProps & DispatchProps){
        super();
        this.state = {
            file: null
        };

        this.upload = this.upload.bind(this);
        this.onFileChosen = this.onFileChosen.bind(this);
    }
    supplier: HTMLSelectElement;

    upload() {
        if(this.props.utilityType.toLowerCase() == "gas"){
            this.props.uploadGasOffer(this.props.tenderId, this.supplier.value, this.state.file);
            return;
        }
        this.props.uploadElectricityOffer(this.props.tenderId, this.supplier.value, this.state.file);
    }

    onFileChosen(e: any){
        this.setState({
            file: e.target.files[0]
        });
    }

    renderSupplierSelect(){
        var options = this.props.suppliers.map(s => {
                return (<option key={s.supplierId} value={s.supplierId}>{s.name}</option>)
        })

        return (
            <select className='uk-select' 
                ref={ref => this.supplier = ref}>
                <option value="" disabled>Select</option>
                {options}
            </select>
        );
    }

    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Upload Offer</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        <p>Please select the utility, the originating supplier, and the file provided.</p>
                        <form>
                            <fieldset className="uk-fieldset">
                                <div className='uk-margin'>
                                    <label className='uk-form-label'>Supplier</label>
                                    {this.renderSupplierSelect()}
                                </div>
                                <div className="uk-margin">
                                    <div className="uk-form-file"><input type="file" onChange={this.onFileChosen}/></div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Cancel</button>
                    <button className="uk-button uk-button-primary uk-modal-close" type="button" onClick={this.upload}>Upload</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, UploadOfferDialogProps> = (dispatch) => {
    return {
        uploadElectricityOffer: (tenderId: string, supplierId: string, file: Blob) => dispatch(uploadElectricityOffer(tenderId, supplierId, file)),
        uploadGasOffer: (tenderId: string, supplierId: string, file: Blob) => dispatch(uploadGasOffer(tenderId, supplierId, file))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, UploadOfferDialogProps> = (state: ApplicationState) => {
    return {
        working: state.portfolio.details.working || state.portfolio.tender.suppliers.working,
        error: state.portfolio.details.error,
        errorMessage: state.portfolio.details.errorMessage,
        suppliers: state.portfolio.tender.suppliers.value,
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(UploadOfferDialog);