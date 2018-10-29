import * as React from "react";
import * as cn from "classnames";

import { RouteComponentProps } from 'react-router';
import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
import { ApplicationState } from '../../applicationState';
import { Portfolio, PortfolioDetails, ApplicationTab, Account } from '../../model/Models';
import { Nav, NavItem, NavLink, Button, UncontrolledTooltip, Navbar, Col } from "reactstrap";
import { ModalDialogNames } from "../common/modal/ModalDialogNames";

import { LoadingIndicator } from "../common/LoadingIndicator";
import PortfolioSummary from "./summary/PortfolioSummary";
import PortfolioMeters from "./mpan/PortfolioMeters";
import ErrorMessage from "../common/ErrorMessage";
import Tenders from "./tender/Tenders";
import { PageHeader } from "../common/PageHeader";
import UpdatePortfolioDialog, { UpdatePortfolioDialogData } from "./creation/UpdatePortfolioDialog";

import { getSinglePortfolio, getPortfolioDetails } from '../../actions/portfolioActions';
import { selectPortfolioTab, openDialog, selectApplicationTab, redirectToAccount } from "../../actions/viewActions";
import { getTenderSuppliers } from '../../actions/tenderActions';

interface PortfolioDetailProps extends RouteComponentProps<void> { }

interface StateProps {
  portfolio: Portfolio;
  detail: PortfolioDetails;
  account: Account;

  working: boolean;
  error: boolean;
  errorMessage: string;
  selectedTab: number;
}

interface DispatchProps {
    getPortfolio: (portfolioId: string) => void;
    getPortfolioDetails: (portfolioId: string) => void;
    getTenderSuppliers: () => void;        

    selectPortfolioTab: (index: number) => void;
    selectApplicationTab: (tab: ApplicationTab) => void;

    openUpdatePortfolioDialog: (data: UpdatePortfolioDialogData) => void;
    redirectToAccount: (accountId: string) => void;
}

class PortfolioDetail extends React.Component<PortfolioDetailProps & StateProps & DispatchProps, {}> {
    componentDidMount(){
        this.props.getTenderSuppliers();
        this.props.selectApplicationTab(ApplicationTab.Portfolios);

        var portfolioId = this.props.location.pathname.split('/')[2];        
        this.props.getPortfolio(portfolioId);
        this.props.getPortfolioDetails(portfolioId);
    }

    selectTab(index: number){
        this.props.selectPortfolioTab(index);
    }

    renderContent(){
        var { portfolio, detail, selectedTab } = this.props;

        switch(selectedTab){
            case 0:
                return (<PortfolioSummary portfolio={portfolio} detail={detail}/>);
            case 1:
                return (<PortfolioMeters portfolio={portfolio}/>);
            case 2:
                return (<Tenders portfolio={portfolio}/>);
            default:
                return (<p>No tab selected</p>);
        }
    }

    render() {
        if(this.props.error){
            return (<ErrorMessage content={this.props.errorMessage} />);
        }
        if(this.props.working || this.props.portfolio == null){
            return (<LoadingIndicator />);
        }
        var { portfolio, detail, account } = this.props;
        return (
            <div className="w-100">
                <Col className="d-flex justify-content-center justify-content-lg-start">
                    <PageHeader title={portfolio.title} subtitle="Portfolio" icon="fas fa-layer-group" className="px-2 flex-column flex-md-row">
                        <div className="w-100 d-flex align-items-center justify-content-between justify-content-md-start">
                        { account && (<div>
                            <Button color="accent" outline className="ml-auto btn-grey-outline" id="account-link-button"
                                onClick={() => this.props.redirectToAccount(account.id)}>
                                <i className="fas fa-building mr-1" /> {account.companyName}
                            </Button>
                            <UncontrolledTooltip target="account-link-button" placement="bottom">
                                <strong>Visit Account</strong>
                            </UncontrolledTooltip>
                        </div>)}
                        <Button color="accent" outline className="ml-auto ml-md-3 btn-grey-outline" id="edit-portfolio-button"
                                onClick={() => this.props.openUpdatePortfolioDialog({ portfolio, detail })}>
                            <i className="material-icons">mode_edit</i>
                        </Button>
                        <UncontrolledTooltip target="edit-portfolio-button" placement="bottom">
                            <strong>Edit Portfolio</strong>
                        </UncontrolledTooltip>
                        </div>
                    </PageHeader>
                </Col>
                    <Navbar className="p-0 bg-white border-top">
                        <Nav tabs className="justify-content-center flex-grow-1">
                            <NavItem>
                                <NavLink className={cn({ active: this.props.selectedTab == 0})}
                                            onClick={() => this.selectTab(0)}
                                            href="#">
                                    <i className="fa fa-list"></i>Summary
                                </NavLink>
                            </NavItem>
                            <NavItem className="ml-md-3 ml-sm-1">
                                <NavLink className={cn({ active: this.props.selectedTab == 1})}
                                            onClick={() => this.selectTab(1)}
                                            href="#">
                                    <i className="fas fa-tachometer-alt"></i>Meters
                                </NavLink>
                            </NavItem>
                            <NavItem className="ml-md-3 ml-sm-1">
                                <NavLink className={cn({ active: this.props.selectedTab == 2}, "mr-0")}
                                            onClick={() => this.selectTab(2)}
                                            href="#">
                                    <i className="fas fa-shopping-cart"></i>Tenders
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Navbar>
                    <div>
                        {this.renderContent()}
                    </div>
                    <UpdatePortfolioDialog />
            </div>)
    }
}

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioDetailProps> = (dispatch) => {
    return {
        getPortfolio: (portfolioId: string) => dispatch(getSinglePortfolio(portfolioId)),   
        getPortfolioDetails: (portfolioId: string) => dispatch(getPortfolioDetails(portfolioId)),
        getTenderSuppliers: () => dispatch(getTenderSuppliers()),   
        selectPortfolioTab: (index: number) => dispatch(selectPortfolioTab(index)),
        selectApplicationTab: (tab: ApplicationTab) => dispatch(selectApplicationTab(tab)),
        openUpdatePortfolioDialog: (data: UpdatePortfolioDialogData) => dispatch(openDialog(ModalDialogNames.UpdatePortfolio, data)),
        redirectToAccount: (accountId: string) => dispatch(redirectToAccount(accountId))
    };
};
  
const mapStateToProps: MapStateToProps<StateProps, PortfolioDetailProps, ApplicationState> = (state: ApplicationState) => {
    return {
        portfolio: state.portfolio.selected.value,
        detail: state.portfolio.details.value,
        account: state.portfolio.account.account.value,
        
        working: state.portfolio.selected.working || state.portfolio.details.working,
        error: state.portfolio.selected.error || state.portfolio.details.error || state.portfolio.account.account.error,
        errorMessage: state.portfolio.selected.errorMessage || state.portfolio.details.errorMessage || state.portfolio.account.account.errorMessage,

        selectedTab: state.view.portfolio.selectedTabIndex
    };
};
  
export default connect(mapStateToProps, mapDispatchToProps)(PortfolioDetail);