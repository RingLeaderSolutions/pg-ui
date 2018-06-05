import { Mpan } from '../../model/Meter';
import { MeterUpdateState } from './meterUpdateReducer';
import { MetersRetrievalState } from './metersRetrievalReducer';
import { MeterConsumptionState } from './fetchMeterConsumptionReducer';

export interface MeterState {
    all: MetersRetrievalState;
    consumption: MeterConsumptionState;
    editedMeter?: Mpan;
    update: MeterUpdateState;
}