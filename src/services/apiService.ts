import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio } from "../model/Models";

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;
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

    getDashboardSummary(){
        return axios.get(`${this.baseApiUri}/portfolios/summary${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardTimeline(){
        return axios.get(`${this.baseApiUri}/portfolios/timeline${this.contextQuery}`, this.getRequestConfig());        
    }

    getDashboardStatus(){
        return axios.get(`${this.baseApiUri}/portfolios/status${this.contextQuery}`, this.getRequestConfig());        
    }
}

export default new ApiService();