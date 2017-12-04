import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio, CompanyInfo, PortfolioContact, PortfolioRequirements, Account, AccountCompanyStatusFlags } from "../model/Models";
import { FakeApiService } from './fakeApiService';
import StorageService from './storageService';
import * as moment from 'moment';

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;
  getPortfolioDetails(portfolioId: string): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;

  searchCompany(companyNumber: string): Promise<AxiosResponse>;
  
  createPortfolio(accountId: string, company: CompanyInfo): Promise<AxiosResponse>;
  updatePortfolioContact(contact: PortfolioContact): Promise<AxiosResponse>;
  updatePortfolioRequirements(requirements: PortfolioRequirements): Promise<AxiosResponse>;
  
  retrieveAccount(accountId: string): Promise<AxiosResponse>;
  createAccount(company: CompanyInfo) : Promise<AxiosResponse>;
  updateAccountFlags(accountId: string, accountFlags: AccountCompanyStatusFlags): Promise<AxiosResponse>;
  
  getPortfolioMpanSummary(portfolioId: string): Promise<AxiosResponse>;
  getPortfolioHistory(portfolioId: string): Promise<AxiosResponse>;
  getPortfolioSiteMpans(portfolioId: string): Promise<AxiosResponse>;

  getMpanTopline(documentId: string): Promise<AxiosResponse>;
  getMpanHistorical(documentId: string): Promise<AxiosResponse>;
}

export class ApiService implements IApiService {
    baseApiUri: string;
    hierarchyApiUri: string;
    contextQuery: string;
    teamId: string;
    storage: StorageService;

    constructor(){
        this.baseApiUri = appConfig.baseApiUri;
        this.hierarchyApiUri = appConfig.hierarchyApiUri;
        this.storage = new StorageService(); 

        this.teamId = "989";
        this.contextQuery = `?context=team&value=${this.teamId}`;

        axios.interceptors.response.use(config => {
            return config;
        },
        error => {
            if (error.response) {
                switch (error.response.status) {
                  case 401:
                  case 403:
                    console.log(`Error (1/2): Received [${error.status}] from API @ [${error.config.url}]:\r\n${error.data}`);
                    console.log(`Error (2/2): Clearing local storage and redirecting to the login page.`);
                    this.storage.clear();
                    window.location.replace('/login');
                    break;
                  default:
                    console.log(`Error: Received [${error.status}] from API @ [${error.config.url}]:\r\n${error.data}`);
                    break;
                }
              }
              else {
                console.log(`Error: Encountered issue setting up Axios Request:\r\n${error.message}`);
              }
      
              return Promise.reject(error);
        })
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

    getAllPortfolios(){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/team/${this.teamId}`, this.getRequestConfig());
    }

    getPortfolioDetails(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/details/${portfolioId}`, this.getRequestConfig());
    }

    updatePortfolioContact(contact: PortfolioContact){
        return axios.post(`${this.baseApiUri}/portman-web/portfolio/contact`, contact, this.getRequestConfig());
    }

    updatePortfolioRequirements(requirements: PortfolioRequirements){
        let portfolioId = requirements.portfolioId;
        return axios.post(`${this.baseApiUri}/portman-web/portfolio/requirements/${portfolioId}`, requirements, this.getRequestConfig());
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
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/history/${portfolioId}`, this.getRequestConfig());        
    }
    
    getPortfolioSiteMpans(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/mpans/detail`, this.getRequestConfig());                
    }

    searchCompany(companyNumber: string){
        return axios.get(`${this.baseApiUri}/portman-web/company/search/fields/${companyNumber}`, this.getRequestConfig());                        
    }

    retrieveAccount(accountId: string){
        return axios.get(`${this.hierarchyApiUri}/api/Account/${accountId}`, this.getRequestConfig());                        
    }

    createAccount(company: CompanyInfo) {
        let dateToFormat = moment(company.incorporationDate, "DD/MM/YYYY");
        let incorporationDate = dateToFormat.format();
        let account = {
            companyName: company.companyName,
            companyRegistrationNumber: company.companyNumber,
            address: `${company.addressLine1}, ${company.addressLine2}, ${company.postTown}, ${company.county}`,
            postcode: company.postcode,
            countryOfOrigin: company.countryOfOrigin,
            incorporationDate: incorporationDate,
            companyStatus: company.companyStatus,
            isVATEligible: true,
            isRegisteredCharity: false,
            hasFiTException: false,
            hasCCLException: false,

            creditRating: "A+"
        };
        return axios.post(`${this.hierarchyApiUri}/api/Account`, account, this.getRequestConfig());                        
    }

    updateAccountFlags(accountId: string, accountFlags: AccountCompanyStatusFlags){
        return axios.put(`${this.hierarchyApiUri}/api/Account/status/${accountId}`, accountFlags, this.getRequestConfig());          
    }

    createPortfolio(accountId: string, company: CompanyInfo){
        let portfolio = {
            title: company.companyName,
            accountId,
            contractStart: "2017-12-01T00:00:00",
            contractEnd: "2018-03-01T00:00:00",
            teamId: this.teamId,

            // Static fields
            ownerId: 1,
            category: "direct",
            supportOwner: 7
        };
        
        return axios.post(`${this.baseApiUri}/portman-web/portfolio`, portfolio, this.getRequestConfig());                        
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