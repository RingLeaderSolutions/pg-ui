import { RequestState } from '../RequestState';
import { MeterPortfolio, Meter } from '../../model/Meter';


export interface MeterState extends RequestState {
    meter: Meter;
}