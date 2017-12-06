import { RequestState } from '../RequestState';
import { Portfolio } from '../../model/Models';
import { AllPortfoliosState } from './allPortfoliosReducer'
import { CreatePortfolioState } from './create/CreatePortfolioState';

export interface PortfoliosState {
    all : AllPortfoliosState;
    create: CreatePortfolioState;
}