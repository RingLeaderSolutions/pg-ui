import { RequestState } from '../RequestState';
import { MeterPortfolio, Meter } from '../../model/Meter';
import { MeterUpdateState } from './meterUpdateReducer';
import { MetersRetrievalState } from './metersRetrievalReducer';

export interface MeterState {
    all: MetersRetrievalState;
    editedMeter: Meter;
    update: MeterUpdateState;
}