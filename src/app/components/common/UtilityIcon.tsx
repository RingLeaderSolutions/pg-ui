import * as React from "react";
import { Tender } from "../../model/Tender";
import { UtilityType } from "../../model/Models";

interface UtilityIconProps{
    utility: string;
    isHalfHourlyElectricity?: boolean;
    centerText?: boolean;
    iconClass?: string;
    children?: any;
}

export class UtilityIcon extends React.Component<UtilityIconProps, {}> {
    renderContained(...icons: any[]){
        return (<div className={this.props.centerText ? "text-center" : null}>{icons}{this.props.children}</div>);
    }

    render() {
        var { utility } = this.props;
        var lowerUtility = utility.toLowerCase();

        // Handle the case where the utility given is `UtilityType.Electricity`, but we've also been passed an isHalfHourly flag
        if(lowerUtility == KnownUtilityStrings.Electricity && this.props.isHalfHourlyElectricity != null){
            lowerUtility = this.props.isHalfHourlyElectricity ? KnownUtilityStrings.HalfHourlyElectricity : KnownUtilityStrings.NonHalfHourlyElectricity;
        }

        switch(lowerUtility){
            case KnownUtilityStrings.Gas:
                return this.renderContained(<i key="g" className={`fas fa-fire ${this.props.iconClass}`}></i>);

            case "electricity":
            case "nhh":
                return this.renderContained(<i key="e" className={`fas fa-bolt ${this.props.iconClass}`}></i>);

            case "hh":
                var icons = [
                    (<i key="e" className={`fas fa-bolt mr-1`}></i>),
                    (<i key="c" className={`fas fa-clock ${this.props.iconClass}`}></i>)
                ];
                return this.renderContained(icons);

            default:
                return this.renderContained(utility);
        }
    }
}

class KnownUtilityStrings {
    public static readonly Gas = "gas";
    public static readonly Electricity = "electricity";
    public static readonly HalfHourlyElectricity = "hh";
    public static readonly NonHalfHourlyElectricity = "nhh";
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

                return (<UtilityIcon utility={utility} iconClass="mr-1">{tender.tenderTitle}</UtilityIcon>)
            case "GAS":
                return (<UtilityIcon utility="gas" iconClass="mr-1">{tender.tenderTitle}</UtilityIcon>)
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