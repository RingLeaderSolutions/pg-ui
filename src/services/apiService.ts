import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio } from "../model/Models";

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;
  getAllPortfolioSummary(): Promise<AxiosResponse>;
  getAllPortfolioTimeline(): Promise<AxiosResponse>;
  getAllPortfolioStatus(): Promise<AxiosResponse>;

}

export class ApiService implements IApiService {
    baseApiUri: string;
    contextQuery: string;
    constructor(){
        //this.baseApiUri = "http://81.147.87.33:8080";
        this.baseApiUri = "http://mpanupload242007.northeurope.cloudapp.azure.com:8080";
        this.contextQuery = "?context=team&value=989";
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
        return axios.get(`${this.baseApiUri}/portfolios/all`, this.getRequestConfig());
    }

    getAllPortfolioSummary(){
        return axios.get(`${this.baseApiUri}/portfolios/summary${this.contextQuery}`, this.getRequestConfig());        
    }

    getAllPortfolioTimeline(){
        return axios.get(`${this.baseApiUri}/portfolios/timeline${this.contextQuery}`, this.getRequestConfig());        
    }

    getAllPortfolioStatus(){
        return axios.get(`${this.baseApiUri}/portfolios/status${this.contextQuery}`, this.getRequestConfig());        
    }
}

export default new ApiService();