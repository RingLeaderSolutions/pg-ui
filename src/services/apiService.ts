import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio } from "../model/Models";
import { FakeApiService } from './fakeApiService';
import StorageService from './storageService';

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;

  searchCompany(companyNumber: string): Promise<AxiosResponse>;

  getPortfolioMpanSummary(portfolioId: string): Promise<AxiosResponse>;
  getPortfolioHistory(portfolioId: string): Promise<AxiosResponse>;
  getPortfolioSiteMpans(portfolioId: string): Promise<AxiosResponse>;

  getMpanTopline(documentId: string): Promise<AxiosResponse>;
  getMpanHistorical(documentId: string): Promise<AxiosResponse>;
}

export class ApiService implements IApiService {
    baseApiUri: string;
    contextQuery: string;
    teamId: string;
    storage: StorageService;

    constructor(){
        this.baseApiUri = appConfig.baseApiUri;
        this.storage = new StorageService();

        this.teamId = "989";
        this.contextQuery = `?context=team&value=${this.teamId}`;
    }

    getRequestConfig() {
        let authorisation = "";
        let token = this.storage.getToken();
        if (token) {
            authorisation = `Bearer ${token}`;
        }

        return {
            headers: {
                "Authorization": authorisation,
                "Content-Type": "application/json"
            }
        };
    }

    getAllPortfolios() {
        //return axios.get(`${this.baseApiUri}/portman-web/tpis`, this.getRequestConfig());
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/team/${this.teamId}`, this.getRequestConfig());
    }

    getDashboardSummary(){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/summary${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardTimeline(){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/timeline${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardStatus(){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/status${this.contextQuery}`, this.getRequestConfig());        
    }

    getPortfolioMpanSummary(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/mpans/summary`, this.getRequestConfig());
    }

    getPortfolioHistory(portfolioId: string) {
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/history`, this.getRequestConfig());        
    }
    
    getPortfolioSiteMpans(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/mpans/detail`, this.getRequestConfig());                
    }

    searchCompany(companyNumber: string){
        return axios.get(`${this.baseApiUri}/portman-web/company/search/fields/${companyNumber}`, this.getRequestConfig());                        
    }

    getMpanTopline(documentId: string){
        return axios.get(`${this.baseApiUri}/portman-web/topline/${documentId}`, this.getRequestConfig());                        
    }

    getMpanHistorical(documentId: string){
        return new FakeApiService().getMpanHistorical(documentId);
        //return axios.get(`${this.baseApiUri}/historical/${documentId}`, this.getRequestConfig());                        
    }
}

//export default new FakeApiService();
export default new ApiService();