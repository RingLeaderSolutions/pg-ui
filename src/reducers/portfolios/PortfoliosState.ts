import { RequestState } from '../RequestState';
import { Portfolio } from '../../model/Models';

export interface PortfoliosState extends RequestState {
    value: Portfolio[];
}