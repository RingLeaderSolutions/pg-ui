import { UtilityType, SiteDetail } from "../../../model/Models";
import AccountElectricityMeterTable from "./AccountElectricityMeterTable";
import React = require("react");
import AccountGasMeterTable from "./AccountGasMeterTable";
import { Button, Row, ButtonGroup } from "reactstrap";
import { Tariff } from "../../../model/Tender";
import { MapDispatchToPropsFunction, MapStateToProps, connect } from "react-redux";
import { fetchTariffs } from "../../../actions/portfolioActions";
import { ApplicationState } from "../../../applicationState";
import { LoadingIndicator } from "../../common/LoadingIndicator";
import * as cn from "classnames";

interface AccountMetersProps {
    accountId: string;
    sites: SiteDetail[];
    portfolios: any;
}

interface StateProps {
    working: boolean;
    error: boolean;
    errorMessage: string;
    tariffs: Tariff[];
}

interface DispatchProps {
    fetchTariffs: () => void;
}

interface AccountMetersState {
    selectedUtility: UtilityType;
}

class AccountMeters extends React.Component<AccountMetersProps & StateProps & DispatchProps, AccountMetersState> {
    constructor(props: AccountMetersProps & StateProps & DispatchProps){
        super(props);

        this.state = {
            selectedUtility: UtilityType.Electricity
        }
    }

    componentDidMount(){
        this.props.fetchTariffs();
    }

    selectUtility(utility: UtilityType): void{
        this.setState({
            selectedUtility: utility
        })
    }

    filterSites(utility: UtilityType): SiteDetail[]{
        let sorted = this.props.sites.sort(
            (site1: SiteDetail, site2: SiteDetail) => {
                let firstSiteCode = site1.siteCode.toLowerCase();
                let secondSiteCode = site2.siteCode.toLowerCase();
        
                if (firstSiteCode < secondSiteCode) return -1;
                if (firstSiteCode > secondSiteCode) return 1;
                return 0;
            });

        switch(utility){
            case UtilityType.Electricity:
                return sorted.filter(s => s.mpans != null && s.mpans.length > 0);
            case UtilityType.Gas:
                return sorted.filter(s => s.mprns != null && s.mprns.length > 0);
            default:
                return [];
        }
    }

    renderMeterTable(): JSX.Element{
        let utility = this.state.selectedUtility;
        let sites = this.filterSites(utility);

        switch(utility){
            case UtilityType.Electricity:
                return (<AccountElectricityMeterTable sites={sites} portfolios={this.props.portfolios} tariffs={this.props.tariffs} accountId={this.props.accountId} />);
            case UtilityType.Gas:
                return (<AccountGasMeterTable sites={sites} portfolios={this.props.portfolios} tariffs={this.props.tariffs} accountId={this.props.accountId}/>);
            default:
                return (<p>Unknown utility selected</p>);
        }
    }

    render(){
        if(this.props.working || this.props.tariffs == null) {
            return (<LoadingIndicator />)
        }

        return (
            <div className="w-100 p-3">
                <Row className="d-flex justify-content-center" noGutters>
                    <ButtonGroup>
                        <Button color="white active-warning" className={cn({ active: this.state.selectedUtility == UtilityType.Electricity})}
                                onClick={() => this.selectUtility(UtilityType.Electricity)}>
                            <i className="fa fa-bolt mr-2" />
                            Electricity
                        </Button>
                        <Button color="white active-orange" className={cn({ active: this.state.selectedUtility == UtilityType.Gas})}
                                onClick={() => this.selectUtility(UtilityType.Gas)}>
                            <i className="fas fa-fire mr-2" />
                            Gas
                        </Button>
                    </ButtonGroup>
                </Row>
                <Row noGutters className="mt-3">
                    {this.renderMeterTable()}
                </Row>
            </div>
        )
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, AccountMetersProps> = (dispatch) => {
    return {
        fetchTariffs: () => dispatch(fetchTariffs())
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, AccountMetersProps, ApplicationState> = (state: ApplicationState) => {
    return {
        working: state.portfolio.tender.tariffs.working,
        error:  state.portfolio.tender.tariffs.error,
        errorMessage: state.portfolio.tender.tariffs.errorMessage,

        tariffs: state.portfolio.tender.tariffs.value        
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(AccountMeters);