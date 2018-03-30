import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";

import { assignTenderSupplier, unassignTenderSupplier, getTenderSuppliers } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";

interface TenderSupplierSelectDialogProps {
    tenderId: string;
    assignedSuppliers: TenderSupplier[];
}

interface StateProps {
    suppliers: TenderSupplier[];    
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    getTenderSuppliers: () => void;        
    assignTenderSupplier: (tenderId: string, supplierId: string) => void;
    unassignTenderSupplier: (tenderId: string, supplierId: string) => void;
}


class TenderSupplierSelectDialog extends React.Component<TenderSupplierSelectDialogProps & StateProps & DispatchProps, {}> {
    componentDidMount() {
        this.props.getTenderSuppliers();
    }

    toggleSupplierAssignment(ev: any, supplierId: string){
        if(ev.target.checked){
            this.props.assignTenderSupplier(this.props.tenderId, supplierId);        
        }
        else {
            this.props.unassignTenderSupplier(this.props.tenderId, supplierId);        
        }
    }

    renderModalContent(){
        if(this.props.working){
            return (<Spinner hasMargin={true} />);
        }
        
        return (
            <div className="uk-panel-scrollable uk-margin uk-height-large">
                    {this.props.suppliers.map(s => {
                        var isAssigned = this.props.assignedSuppliers.find(as => as.supplierId == s.supplierId) != null;
                        return (
                            <div key={s.supplierId} className="supplier">
                                <div className="uk-margin uk-grid uk-flex-center" data-uk-grid>
                                    <img className="supplier-image" src={s.logoUri} alt={s.name} style={{width:"auto", height: "80px"}}/>
                                </div>
                                <div className="uk-margin uk-grid-small" data-uk-grid>
                                    <div className="uk-width-expand@m">
                                        <label>
                                            <input className="uk-checkbox" type="checkbox" defaultChecked={isAssigned} onChange={(e) => this.toggleSupplierAssignment(e, s.supplierId)}/> Included
                                        </label>
                                    </div>
                                    <div className="uk-grid-1-3">
                                        <p className="uk-text-right">Payment terms: <strong>{s.paymentTerms} days</strong></p>
                                    </div>
                                </div>
                                <hr />
                            </div>
                        )
                    })}
                </div>);
    }

    render() {
        var content = this.renderModalContent();
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Select Suppliers</h2>
                </div>
                <div className="uk-modal-body">
                    {content}
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Done</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderSupplierSelectDialogProps> = (dispatch) => {
    return {
        getTenderSuppliers: () => dispatch(getTenderSuppliers()),                
        assignTenderSupplier: (tenderId, supplierId) => dispatch(assignTenderSupplier(tenderId, supplierId)),
        unassignTenderSupplier: (tenderId, supplierId) => dispatch(unassignTenderSupplier(tenderId, supplierId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderSupplierSelectDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.suppliers.working,
        error: state.portfolio.tender.tenders.error,
        errorMessage: state.portfolio.tender.tenders.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderSupplierSelectDialog);