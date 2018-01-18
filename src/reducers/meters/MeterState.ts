import { RequestState } from '../RequestState';
import { MeterPortfolio, Mpan } from '../../model/Meter';
import { MeterUpdateState } from './meterUpdateReducer';
import { MetersRetrievalState } from './metersRetrievalReducer';

export interface MeterState {
    all: MetersRetrievalState;
    editedMeter?: Mpan;
    update: MeterUpdateState;
}