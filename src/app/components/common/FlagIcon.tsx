import * as React from "react";

interface FlagIconProps {
    country: string;
}

export const FlagIcon: React.SFC<FlagIconProps> = (props) => {
    let { country } = props;

    if(country.IsNullOrWhitespace()){
        return null;
    }

    let icon = ""
    switch(country.toLowerCase()){
        case "united kingdom":
        case "uk":
        case "great britain":
        case "gb":
        case "ni":
            icon = "uk";
            break;
        case "ireland":
        case "roi":
        case "eire":
        case "ire":
        case "ie":
            icon = "ie"
            break;
        default:
            return null;
    }

    return (<img className={`flag-icon ${icon}`} />);
}