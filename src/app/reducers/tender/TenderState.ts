import { RequestState } from '../RequestState';
import { TendersState } from './tendersReducer';
import { TenderOffersState } from './fetchTenderOffersReducer';
import { TenderRecommendationsState } from './fetchTenderRecommendationsReducer';
import { RecommendationSuppliersState } from './fetchRecommendationSuppliersReducer';
import { RecommendationSitesState } from './fetchRecommendationSitesReducer';
import { RecommendationSummaryState } from './fetchRecommendationSummaryReducer';
import { TenderRecommendation } from '../../model/Tender';

export interface TenderState {
    tenders: TendersState;
    offers: TenderOffersState,
    recommendations: TenderRecommendationsState,
    selected_recommendation: TenderRecommendation,
    selected_recommendation_summary: RecommendationSummaryState,
    selected_recommendation_suppliers: RecommendationSuppliersState,
    selected_recommendation_sites: RecommendationSitesState,
    addExistingContract: RequestState;
    delete_tender: RequestState;
    create_tender: RequestState;
    update_tender_suppliers: RequestState;
    update_tender: RequestState;
    generate_pack: RequestState;
    issue_pack: RequestState;
    generate_summary: RequestState;
    issue_summary: RequestState;
    backing_sheets: RequestState;
    issuance_email: RequestState;
    tariffs: RequestState;
    delete_quote: RequestState;
}