// import * as React from "react";
// import { RouteComponentProps } from 'react-router';
// import { MapDispatchToPropsFunction, connect, MapStateToProps } from 'react-redux';
// import { ApplicationState } from '../../../applicationState';
// import { Portfolio, Mpan } from '../../../model/Models';
// import Spinner from '../../common/Spinner';

// import { getMpansForPortfolio } from '../../../actions/portfolioActions';

// interface PortfolioMpansProps extends RouteComponentProps<void> {
//     portfolio: Portfolio;
// }

// interface StateProps {
//   portfolio: Portfolio;
//   working: boolean;
// }

// interface DispatchProps {
//     getMpans: (portfolioId: string) => void;
// }

// class PortfolioMpans extends React.Component<PortfolioMpansProps & StateProps & DispatchProps, {}> {
//     constructor() {
//         super();
//     }

//     componentDidMount(){
//         if(this.props.portfolio != null){
//             this.props.getMpans(this.props.portfolio.id);
//         }
//     }

//     render() {
//         if(this.props.working || this.props.portfolio == null){
//             return (<Spinner />);
//         }
//         return (
//             <div className="content-inner-portfolio">
//                 <p>In progress..</p>
//             </div>)
//     }
// }

// const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, PortfolioMpansProps> = (dispatch) => {
//     return {
//         getMpans: (portfolioId: string) => dispatch(getMpansForPortfolio(portfolioId))        
//     };
// };
  
// const mapStateToProps: MapStateToProps<StateProps, PortfolioMpansProps> = (state: ApplicationState) => {
//     return {
//         portfolio: state.portfolio.mpans,
//         working: state.portfolio.mpans_working
//     };
// };
  
// export default connect(mapStateToProps, mapDispatchToProps)(PortfolioMpans);