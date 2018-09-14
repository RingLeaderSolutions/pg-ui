import * as types from '../../actions/actionTypes';

import { reduceReducers } from '../common';
import { TenderRecommendation } from '../../model/Tender';

const selectedRecommendationReportReducer = (state: TenderRecommendation, action: any): TenderRecommendation => {
    switch (action.type) {
        case types.SELECT_RECOMMENDATION_REPORT:
            return action.data;
        default:
            if(state == undefined){
                return null;
            }
            return state;
    }
}

export default reduceReducers(selectedRecommendationReportReducer);