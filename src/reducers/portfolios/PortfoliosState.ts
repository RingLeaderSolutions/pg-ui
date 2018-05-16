import { RequestState } from '../RequestState';
import { Portfolio } from '../../model/Models';
import { AllPortfoliosState } from './allPortfoliosReducer';

export interface PortfoliosState {
    all : AllPortfoliosState;
}