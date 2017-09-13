import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio } from "../model/Models";
import { FakeApiService } from './fakeApiService';

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;

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
    constructor(){
        //this.baseApiUri = "http://81.147.87.33:8080";
        this.baseApiUri = "http://mpanupload242007.northeurope.cloudapp.azure.com:8080";
        this.teamId = "989";
        this.contextQuery = `?context=team&value=${this.teamId}`;
    }
    getRequestConfig() {
        // let authorisation = "";
        // let token = localStorage.getItem("id_token");
        // if (token) {
        //     authorisation = `Bearer ${token}`;
        // }

        return {
            headers: {
                // "Authorization": authorisation,
                "Content-Type": "application/json"
            }
        };
    }

    getAllPortfolios() {
        return axios.get(`${this.baseApiUri}/portfolios/team/${this.teamId}`, this.getRequestConfig());
    }

    getDashboardSummary(){
        return axios.get(`${this.baseApiUri}/portfolios/summary${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardTimeline(){
        return axios.get(`${this.baseApiUri}/portfolios/timeline${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardStatus(){
        return axios.get(`${this.baseApiUri}/portfolios/status${this.contextQuery}`, this.getRequestConfig());        
    }

    getPortfolioMpanSummary(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portfolio/${portfolioId}/mpans/summary`, this.getRequestConfig());
    }

    getPortfolioHistory(portfolioId: string) {
        return axios.get(`${this.baseApiUri}/portfolio/${portfolioId}/history`, this.getRequestConfig());        
    }
    
    getPortfolioSiteMpans(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portfolio/${portfolioId}/mpans/detail`, this.getRequestConfig());                
    }

    getMpanTopline(documentId: string){
        return axios.get(`${this.baseApiUri}/topline/${documentId}`, this.getRequestConfig());                        
    }

    getMpanHistorical(documentId: string){
        return axios.get(`${this.baseApiUri}/historical/${documentId}`, this.getRequestConfig());                        
    }
}

//export default new FakeApiService();
export default new ApiService();