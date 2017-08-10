import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio } from "../model/Models";

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;
}

export class ApiService implements IApiService {
    baseApiUri: string;
    constructor(){
        this.baseApiUri = "http://81.147.87.33:8080";
        //this.baseApiUri = "http://mpanupload242007.northeurope.cloudapp.azure.com:8080";
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
}

export default new ApiService();