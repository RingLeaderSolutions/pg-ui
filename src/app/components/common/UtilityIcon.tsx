import * as React from "react";
import { Tender } from "../../model/Tender";
import { UtilityType } from "../../model/Models";

interface UtilityIconProps{
    utility: string;
    centerText?: boolean;
    iconClass?: string;
    children?: any;
}

export class UtilityIcon extends React.Component<UtilityIconProps, {}> {
    readonly tooltipMap = new Map<string, string>([
        ["electricity", "Electricity"],
        ["gas", "Gas"],
        ["nhh", "Non half-hourly electricity"],
        ["hh", "Half-hourly electricity"],
    ]);

    renderContained(...icons: any[]){
        return (<div className={this.props.centerText ? "uk-text-center" : null}>{icons}{this.props.children}</div>);
    }

    render() {
        var { utility } = this.props;
        
        var lowerUtility = utility.toLowerCase();
        var tooltip = `title:${this.tooltipMap.get(lowerUtility)}`
        
        switch(lowerUtility){
            case "gas":
                return this.renderContained(<i key="g" className={`fas fa-fire ${this.props.iconClass}`} data-uk-tooltip={tooltip}></i>);

            case "electricity":
            case "nhh":
                return this.renderContained(<i key="e" className={`fas fa-bolt ${this.props.iconClass}`} data-uk-tooltip={tooltip}></i>);

            case "hh":
                var icons = [
                    (<i key="e" className={`fas fa-bolt uk-margin-small-right`} data-uk-tooltip={tooltip}></i>),
                    (<i key="c" className={`fas fa-clock ${this.props.iconClass}`} data-uk-tooltip={tooltip}></i>)
                ];
                return this.renderContained(icons);

            default:
                return this.renderContained(utility);
        }
    }
}

interface TenderUtilityIconTabHeaderProps {
    tender: Tender;
}

export class TenderUtilityIconTabHeader extends React.Component<TenderUtilityIconTabHeaderProps, {}> {
    render(){
        const { tender } = this.props;

        switch(tender.utility){
            case "ELECTRICITY":
                var utility = tender.halfHourly ? "hh" : "nhh";
                var title =  tender.halfHourly ? "Electricity (HH)" : "Electricity (NHH)";

                return (<UtilityIcon utility={utility} iconClass="uk-margin-small-right">{title}</UtilityIcon>)
            case "GAS":
                return (<UtilityIcon utility="gas" iconClass="uk-margin-small-right">Gas</UtilityIcon>)
            default:
                throw new RangeError(`Unknown tender utility: [${utility}]`);
        }
    }
}

export function getWellFormattedUtilityName(utility: string){
    switch(utility){
        case "ELECTRICITY":
            return "Electricity";
        case "GAS":
            return "Gas";
        default:
            return utility;
    }
}

export function getWellFormattedUtilityType(utility: UtilityType){
    switch(utility){
        case UtilityType.Electricity:
            return "Electricity";
        case UtilityType.Gas:
            return "Gas";
        default:
            return utility;
    }
}