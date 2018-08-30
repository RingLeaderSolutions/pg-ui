import * as React from "react";
import { UtilityType } from '../../../model/Models';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';

import { updateTenderSuppliers, getTenderSuppliers } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import { closeModalDialog } from "../../../actions/viewActions";

interface TenderSupplierSelectDialogProps {
    tenderId: string;
    assignedSuppliers: TenderSupplier[];
    utility: UtilityType;
}

interface StateProps {
    suppliers: TenderSupplier[];    
    working: boolean;
    error: boolean;
    errorMessage: string;
}
  
interface DispatchProps {
    getTenderSuppliers: () => void;        
    updateTenderSuppliers: (tenderId: string, supplierIds: string[]) => void;
    closeModalDialog: () => void;
}

interface SupplierSelectState {
    selected: string[];
}

class TenderSupplierSelectDialog extends React.Component<TenderSupplierSelectDialogProps & StateProps & DispatchProps, SupplierSelectState> {
    constructor(props: TenderSupplierSelectDialogProps & StateProps & DispatchProps) {
        super();
        var selected = props.assignedSuppliers.map(s => s.supplierId);
        this.state = {
            selected 
        }
    }

    componentWillReceiveProps(nextProps: TenderSupplierSelectDialogProps & StateProps & DispatchProps){
        var selected = nextProps.assignedSuppliers.map(s => s.supplierId);
        this.setState({
            selected
        })
    }

    componentDidMount() {
        this.props.getTenderSuppliers();
    }

    saveSuppliers(){
        this.props.updateTenderSuppliers(this.props.tenderId, this.state.selected);
        this.props.closeModalDialog();
    }

    toggleSupplierAssignment(ev: any, supplierId: string){
        if(this.state.selected.find(selectedId => selectedId == supplierId)){
            this.setState( {
                selected: this.state.selected.filter((sid) => sid != supplierId)
            })
        }
        else {
            this.setState({
                selected: [...this.state.selected, supplierId]
            })
        }
    }

    selectAllSuppliers(){
        var suppliers = this.getValidSuppliers();
        
        this.setState({
            ...this.state,
            selected: suppliers.map(s => s.supplierId)
        });
    }

    selectNoSuppliers(){
        this.setState({
            ...this.state,
            selected: []
        });
    }


    getValidSuppliers() : TenderSupplier[]{
        if(this.props.utility == UtilityType.Gas){
            return this.props.suppliers.filter(s => s.gasSupplier);
        }
        else {
            return this.props.suppliers.filter(s => s.electricitySupplier);
        }
    }

    renderModalContent(){
        if(this.props.working){
            return (<Spinner hasMargin={true} />);
        }
        
        var suppliers = this.getValidSuppliers().map(s => {
            var isSelected = this.state.selected.find(sid => sid == s.supplierId) != null;
            return (
                <tr key={s.supplierId}>
                    <td><img src={s.logoUri} style={{ maxWidth: "70px", maxHeight: "40px"}}/></td>
                    <td>{s.name}</td>
                    <td>{s.paymentTerms} days</td>
                    <td><input className="uk-checkbox" type="checkbox" checked={isSelected} onChange={(e) => this.toggleSupplierAssignment(e, s.supplierId)}/></td>
                </tr>
            )
        });

        return (
            <div className="uk-panel-scrollable uk-height-large">
                <table className="uk-table uk-table-divider">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Supplier</th>
                            <th>Payment Terms</th>
                            <th>Included</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers}
                    </tbody>
                </table>
            </div>
        )
    }

    render() {
        var content = this.renderModalContent();
        return (
            <div>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Select Suppliers</h2>
                </div>
                <div className="uk-modal-body">
                    {content}
                    <hr />
                    <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.selectAllSuppliers()} type="button">
                    <span className="uk-margin-small-right" data-uk-icon="icon: check" /> Select All
                    </button>
                    <button className="uk-button uk-button-small uk-button-default uk-margin-right" onClick={() => this.selectNoSuppliers()} type="button">
                        <span className="uk-margin-small-right" data-uk-icon="icon: close" /> Select None
                    </button>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right" type="button" onClick={() => this.props.closeModalDialog()}>Done</button>
                    <button className="uk-button uk-button-primary uk-margin-right" type="button" onClick={() => this.saveSuppliers()}>Save</button>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderSupplierSelectDialogProps> = (dispatch) => {
    return {
        getTenderSuppliers: () => dispatch(getTenderSuppliers()),                
        updateTenderSuppliers: (tenderId, supplierIds) => dispatch(updateTenderSuppliers(tenderId, supplierIds)),
        closeModalDialog: () => dispatch(closeModalDialog())
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