import * as React from "react";
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../../applicationState';
import Spinner from '../../common/Spinner';
import ErrorMessage from "../../common/ErrorMessage";
import * as moment from 'moment';

import { Tender, TenderSupplier } from "../../../model/Tender";

interface TenderPackDialogProps {
    tender: Tender;
    portfolioId: string;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    suppliers: TenderSupplier[];
}
  
interface DispatchProps {
}

class TenderPackDialog extends React.Component<TenderPackDialogProps & StateProps & DispatchProps, {}> {
    renderPackTableContent(){
        return this.props.tender.unissuedPacks.map(p => {
            var supplier = this.props.suppliers.find(s => s.supplierId == p.supplierId);
            var supplierText = supplier == null ? "Unknown" : supplier.name;

            return (
                <tr key={p.packId}>
                    <td>{<span className="uk-label uk-label-success">{p.packId.substring(0, 8)}</span>}</td>
                    <td>{moment.utc(p.created).local().format("MMMM Do, HH:mm")}</td>
                    <td>{p.meterCount}</td>
                    <td>{supplierText}</td>
                    <td>
                        <a className="uk-button uk-button-default uk-button-small" href={p.zipFileName}>
                            <span className="uk-margin-small-right" data-uk-icon="icon: cloud-download" />
                        </a> 
                    </td>
                </tr>
            )
        });
    }

    renderPackTable(){
        if(this.props.tender.unissuedPacks == null || this.props.tender.unissuedPacks.length == 0){
            return (<p>There are no unissued requirement packs for this tender.</p>);
        }

        var tableContent = this.renderPackTableContent();
        return (
            <table className="uk-table uk-table-divider uk-table-hover">
                <thead>
                    <tr>
                        <th>Pack ID</th>
                        <th>Created</th>
                        <th>Meter count</th>
                        <th>Supplier</th>
                    </tr>
                </thead>
                <tbody>
                    {tableContent}
                </tbody>
            </table>)
    }
    
    renderPackDialogContent(){
        return (
            <div>
                <div className="uk-margin">
                    {this.renderPackTable()}
                </div>
            </div>);
    }

    render() {
        let content;
        if(this.props.suppliers == null || this.props.working){
            content = (<Spinner hasMargin={true} />);
        }
        else if(this.props.error){
            content = (<ErrorMessage content={this.props.errorMessage}/> )
        }
        else {
            content = this.renderPackDialogContent();
        }
        
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Tender Requirements</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-margin">
                        {content}
                    </div>
                </div>
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, TenderPackDialogProps> = () => {
    return {};
};
  
const mapStateToProps: MapStateToProps<StateProps, TenderPackDialogProps> = (state: ApplicationState) => {
    return {
        suppliers: state.portfolio.tender.suppliers.value,
        working: state.portfolio.tender.generate_pack.working,
        error: state.portfolio.tender.generate_pack.error,
        errorMessage: state.portfolio.tender.generate_pack.errorMessage
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(TenderPackDialog);