import * as React from "react";
import { Portfolio, PortfolioDetails, UtilityType } from '../../../model/Models';

import { getPortfolioTenders } from '../../../actions/tenderActions';
import { Tender, TenderSupplier } from "../../../model/Tender";
import TenderStatus from "./TenderStatus";

interface TenderSupplierSelectDialogProps {
    suppliers: TenderSupplier[];
}

class TenderView extends React.Component<TenderSupplierSelectDialogProps, {}> { 
    render() {
        return (
            <div className="uk-modal-dialog">
                <button className="uk-modal-close-default" type="button" data-uk-close></button>
                <div className="uk-modal-header">
                    <h2 className="uk-modal-title">Select Suppliers</h2>
                </div>
                <div className="uk-modal-body">
                    <div className="uk-panel-scrollable uk-margin uk-height-large">
                        {this.props.suppliers.map(s => {
                            return (
                                <div key={s.supplierId} className="supplier">
                                    <div className="uk-margin uk-grid" data-uk-grid>
                                        <span data-uk-icon="icon: bolt; ratio: 2"></span>
                                        <div className="uk-margin">
                                            <h3>{s.name}</h3>
                                        </div>
                                    </div>
                                    <div className="uk-margin uk-grid-small" data-uk-grid>
                                        <div>
                                            <label>
                                                <input className="uk-checkbox" type="checkbox"/>
                                                <div>Included</div>
                                            </label>
                                        </div>
                                        <div>
                                            <p>Payment terms: <strong>{s.paymentTerms}</strong></p>
                                        </div>
                                        <div>
                                            <p>Fixed product: <strong>PPA Plus</strong></p>
                                        </div>
                                        <div>
                                            <label className="uk-form-label" data-for="form-stacked-select">Pack format</label>
                                            <div className="uk-form-controls">
                                                <select className="uk-select" id="pack-format-select">
                                                    <option>CSV</option>
                                                    <option>XLS</option>
                                                    <option>Both</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="uk-modal-footer uk-text-right">
                    <button className="uk-button uk-button-default uk-margin-right uk-modal-close" type="button">Done</button>
                </div>
            </div>)
    }
}

export default TenderView;