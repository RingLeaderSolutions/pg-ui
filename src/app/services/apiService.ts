import { AxiosResponse } from 'axios';
import axios from 'axios';
import { CompanyInfo, Account, AccountCompanyStatusFlags, UtilityType, User } from "../model/Models";
import { Tender, TenderContract, QuickQuote } from '../model/Tender';
import * as moment from 'moment';
import { AccountContact } from '../model/HierarchyObjects';
import { PortfolioCreationRequest } from '../model/Portfolio';
import { LocalStorageRepository } from './LocalStorageRepository';

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;
  getPortfolioDetails(portfolioId: string): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;

  searchCompany(companyNumber: string): Promise<AxiosResponse>;
  
  createPortfolio(portfolio: PortfolioCreationRequest) : Promise<AxiosResponse>;
  deletePortfolio(portfolioId: string) : Promise<AxiosResponse>;
  editPortfolio(portfolio: PortfolioCreationRequest) : Promise<AxiosResponse>;

  retrieveAccounts(): Promise<AxiosResponse>;  
  retrieveAccount(accountId: string): Promise<AxiosResponse>;
  retrieveAccountContacts(accountId: string): Promise<AxiosResponse>;
  retrieveAccountDetail(accountId: string): Promise<AxiosResponse>;
  createAccountFromCompany(company: CompanyInfo) : Promise<AxiosResponse>;
  createAccount(account: Account) : Promise<AxiosResponse>;
  updateAccount(account: Account) : Promise<AxiosResponse>;
  updateAccountFlags(accountId: string, accountFlags: AccountCompanyStatusFlags): Promise<AxiosResponse>;
  createContact(contact: AccountContact): Promise<AxiosResponse>;
  updateContact(contact: AccountContact): Promise<AxiosResponse>;
  deleteContact(accountContactId: string): Promise<AxiosResponse>;
  fetchAccountDocumentation(accountId: string): Promise<AxiosResponse>;
  fetchAccountUploads(accountId: string): Promise<AxiosResponse>;
  fetchAccountPortfolios(accountId: string): Promise<AxiosResponse>;

  fetchAccountContracts(accountId: string): Promise<AxiosResponse>;
  createAccountContract(accountId: string, contract: TenderContract): Promise<AxiosResponse>;
  updateAccountContract(contract: TenderContract): Promise<AxiosResponse>;
  deleteAccountContract(contractId: string): Promise<AxiosResponse>;
  fetchAccountContractRates(contractId: string): Promise<AxiosResponse>;
  createContractRenewal(contractId: string) : Promise<AxiosResponse>;

  getPortfolioHistory(portfolioId: string): Promise<AxiosResponse>;

  fetchMeterConsumption(portfolioId: string, utility: UtilityType): Promise<AxiosResponse>;
  excludeMeters(portfolioId: string, meters: string[]): Promise<AxiosResponse>;
  includeMeters(portfolioId: string, meters: string[]): Promise<AxiosResponse>;
  exportMeterConsumption(portfolioID: string, utility: UtilityType): Promise<AxiosResponse>;

  fetchPortfolioUploads(portfolioId: string): Promise<AxiosResponse>;
  fetchUploadReport(uri: string): Promise<AxiosResponse>;

  uploadSupplyMeterData(accountId: string, file: Blob, utility: UtilityType): Promise<AxiosResponse>;
  uploadHistorical(portfolioId: string, files: Blob[]): Promise<AxiosResponse>;
  uploadElectricityBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadGasBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadOffer(tenderId: string, supplierId: string, file: Blob): Promise<AxiosResponse>;
  uploadAccountDocument(accountId: string, file: Blob): Promise<AxiosResponse>;
  uploadOfferCollateral(tenderId: string, file: Blob): Promise<AxiosResponse>;

  reportSuccessfulSupplyMeterDataUpload(accountId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulHistoricalUpload(portfolioId: string, files: string[], historicalType: string): Promise<AxiosResponse>;
  reportSuccessfulBackingSheetUpload(contractId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulOfferUpload(tenderId: string, supplierId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulAccountDocumentUpload(accountId: string, documentType: string, files: string[]): Promise<AxiosResponse>;

  getTenderSuppliers(): Promise<AxiosResponse>;
  getPortfolioTenders(portfolioId: string): Promise<AxiosResponse>;
  deleteTender(portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  createTender(portfolioId: string, tender: Tender, utilityType: UtilityType, halfHourly?: boolean): Promise<AxiosResponse>;
  updateTenderSuppliers(tenderId: string, supplierIds: string[]): Promise<AxiosResponse>;
  updateTender(tenderId: string, tender: Tender): Promise<AxiosResponse>;
  getContractBackingSheets(tenderId: string, contractId: string): Promise<AxiosResponse>;
  getQuoteBackingSheets(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  generateTenderPack(tenderId: string, portfolioId: string): Promise<AxiosResponse>;
  issueTenderPack(tenderId: string, subject: string, body: string): Promise<AxiosResponse>;
  generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string): Promise<AxiosResponse>;
  issueSummaryReport(tenderId: string, reportId: string, emails: string[]): Promise<AxiosResponse>;
  fetchTenderIssuanceEmail(tenderId: string): Promise<AxiosResponse>;
  exportContractRates(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  deleteQuote(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  acceptQuote(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  submitQuickQuote(tenderId: string, quote: QuickQuote): Promise<AxiosResponse>;
  
  fetchTenderOffers(portfolioId: string): Promise<AxiosResponse>;
  fetchTenderRecommendations(portfolioId: string): Promise<AxiosResponse>;

  fetchRecommendationSuppliers(tenderId: string, summaryId: string): Promise<AxiosResponse>;
  fetchRecommendationSites(tenderId: string, summaryId: string, siteStart: number, siteEnd: number): Promise<AxiosResponse>;
  deleteRecommendation(tenderId: string, recommendationId: string): Promise<AxiosResponse>;

  reportLogin(): Promise<AxiosResponse>;
  fetchBackendVersion(): Promise<AxiosResponse>;
  fetchUsers(): Promise<AxiosResponse>;
  fetchInstanceDetails(): Promise<AxiosResponse>;
  getTariffs(): Promise<AxiosResponse>;
}

export class ApiService implements IApiService {
    private readonly baseApiUri: string = appConfig.baseApiUri;
    private readonly hierarchyApiUri: string = appConfig.hierarchyApiUri;
    private readonly uploadApiUri: string = appConfig.uploadApiUri;

    private readonly teamId: string = "989";
    private readonly contextQuery: string = "?context=team&value=989";
    private readonly storage: LocalStorageRepository = new LocalStorageRepository();

    constructor(){
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
                    this.storage.clearTokens();
                    window.location.replace('/login');
                    break;
                  default:
                    console.log(`Error: Received [${error.status}] from API @ [${error.config.url}]:\r\n${error.data}`);
                    break;
                }
              }
              else {
                  console.log(`Error: Encountered issue communicating with API @ [${error.config.url}]:\r\n${error.message}\r\n${error.stack}`);
              }
      
              return Promise.reject(error);
        })
    }

    getRequestConfig() {
        let authorisation = "";
        let token = this.storage.fetchIdToken();
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
    
    getUploadFileConfig(){
        return {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        };
    }

    getAllPortfolios(){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/team/${this.teamId}`, this.getRequestConfig());
    }

    getPortfolioDetails(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolio/details/${portfolioId}`, this.getRequestConfig());
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

    searchCompany(companyNumber: string){
        return axios.get(`${this.baseApiUri}/portman-web/company/search/fields/${companyNumber}`, this.getRequestConfig());                        
    }

    retrieveAccounts(){
        return axios.get(`${this.hierarchyApiUri}/api/Account/`);                        
    }

    retrieveAccount(accountId: string){
        return axios.get(`${this.hierarchyApiUri}/api/Account/${accountId}`, this.getRequestConfig());                        
    }

    retrieveAccountDetail(accountId: string){
        return axios.get(`${this.hierarchyApiUri}/api/Account/detail/${accountId}`, this.getRequestConfig());                        
    }

    createAccount(account: Account){
        return axios.post(`${this.hierarchyApiUri}/api/Account`, account, this.getRequestConfig());         
    }

    updateAccount(account: Account){
        return axios.put(`${this.hierarchyApiUri}/api/Account/${account.id}`, account, this.getRequestConfig());         
    }
    
    createAccountFromCompany(company: CompanyInfo) {
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

    createPortfolio(portfolio: PortfolioCreationRequest){       
        return axios.post(`${this.baseApiUri}/portman-web/portfolio`, portfolio, this.getRequestConfig());                        
    }

    editPortfolio(portfolio: PortfolioCreationRequest){       
        return axios.put(`${this.baseApiUri}/portman-web/portfolio`, portfolio, this.getRequestConfig());                        
    }

    deletePortfolio(portfolioId: string){       
        return axios.delete(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}`, this.getRequestConfig());                        
    }

    uploadSupplyMeterData(accountId: string, file: Blob, utility: UtilityType){
        var formData = new FormData();
        formData.append('files', file);

        var prefix = utility == UtilityType.Electricity ? "electricity" : "gas";
        return axios.post(`${this.uploadApiUri}/api/upload/supply/${prefix}/${accountId}`, formData, this.getUploadFileConfig());
    }

    uploadHistorical(portfolioId: string, files: Blob[]){
        var formData = new FormData();
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            formData.append('files', element);
        }

        return axios.post(`${this.uploadApiUri}/api/upload/historic/${portfolioId}`, formData, this.getUploadFileConfig());
    }

    uploadGasBackingSheet(contractId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/backing/${contractId}/gas`, formData, this.getUploadFileConfig());
    }

    uploadElectricityBackingSheet(contractId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/backing/${contractId}/electricity`, formData, this.getUploadFileConfig());
    }

    uploadOffer(tenderId: string, supplierId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/offer/${tenderId}`, formData, this.getUploadFileConfig());
    }

    getPortfolioTenders(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/basic`, this.getRequestConfig());        
    }

    getTenderSuppliers(){
        return axios.get(`${this.baseApiUri}/portman-web/tender/suppliers`, this.getRequestConfig());        
    }

    deleteTender(portfolioId: string, tenderId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/tender/${tenderId}`, this.getRequestConfig());
    }

    createTender(portfolioId: string, tender: Tender, utilityType: UtilityType, halfHourly?: boolean){
        var endPointSuffix: string;
        if(utilityType == UtilityType.Electricity){
            if(halfHourly){
                endPointSuffix = "electricity/hh";
            }
            else {
                endPointSuffix = "electricity/nhh";
            }
        }
        else {
            endPointSuffix = "gas";
        }

        return axios.post(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/${endPointSuffix}`, tender, this.getRequestConfig());
    }

    updateTenderSuppliers(tenderId: string, supplierIds: string[]){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/supplier/population`, supplierIds, this.getRequestConfig());        
    }

    updateTender(tenderId: string, tender: Tender){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/`, tender, this.getRequestConfig());
    }

    getContractBackingSheets(tenderId: string, contractId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/${tenderId}/contractBackingsheets/contract/v2/${contractId}`, this.getRequestConfig());        
    }

    getQuoteBackingSheets(tenderId: string, quoteId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/${tenderId}/contractBackingsheets/quote/v2/${quoteId}`, this.getRequestConfig());        
    }
    
    generateTenderPack(tenderId: string, portfolioId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/portfolio/${portfolioId}/tenderpack`, null, this.getRequestConfig());        
    }

    issueTenderPack(tenderId: string, subject: string, body: string){
        var requestBody = {
            subject,
            body
        }
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/issuePack`, requestBody, this.getRequestConfig());                
    }
    
    generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string){
        var requestBody = {
            tenderId,
            quoteId,
            marketCommentary,
            selectionCommentary
        };
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/generateSummaryReport`, requestBody, this.getRequestConfig());                        
    }

    issueSummaryReport(tenderId: string, reportId: string, emails: string[]){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/issueSummaryReport/${reportId}`, emails, this.getRequestConfig());
    }

    fetchBackendVersion(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/version`, this.getRequestConfig());                        
    }

    fetchTenderIssuanceEmail(tenderId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/${tenderId}/supplierEmail`, this.getRequestConfig());        
    }

    exportContractRates(tenderId: string, quoteId: string){
        return axios.get(`${this.baseApiUri}/portman-web/export/tender/${tenderId}/quote/${quoteId}`, this.getRequestConfig());        
    }

    excludeMeters(portfolioId: string, meters: string[]){
        var payload = {
            meters
        };
        return axios.put(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/exclude/meters`, payload, this.getRequestConfig());
    }

    includeMeters(portfolioId: string, meters: string[]){
        var payload = {
            meters
        };
        return axios.put(`${this.baseApiUri}/portman-web/portfolio/${portfolioId}/include/meters`, payload, this.getRequestConfig());
    }

    reportSuccessfulSupplyMeterDataUpload(accountId: string, files: string[], utility: UtilityType){
        var payload = {
            csvNames: files,
            uploadType: "SUPPLYDATA",
            notes: `Uploaded ${moment().toISOString()}`
        };
        
        var prefix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/supplymeterdata/${prefix}/${accountId}`, payload, this.getRequestConfig());
    }

    reportSuccessfulHistoricalUpload(portfolioId: string, files: string[], historicalType: string) {
        var payload = {
            csvNames: files,
            uploadType: "HISTORICAL",
            notes: `Uploaded ${moment().toISOString()}`,
            historicalType
        };
        
        return axios.post(`${this.baseApiUri}/portman-web/upload/historical/${portfolioId}`, payload, this.getRequestConfig());
    }

    reportSuccessfulBackingSheetUpload(contractId: string, files: string[], utility: UtilityType) {
        var payload = {
            csvNames: files,
            uploadType: "CONTRACT_BACKINGSHEETS",
            notes: `Uploaded ${moment().toISOString()}`
        };
        
        var suffix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/backingsheets/contract/${contractId}/${suffix}`, payload, this.getRequestConfig());
    }

    reportSuccessfulOfferUpload(tenderId: string, supplierId: string, files: string[], utility: UtilityType){
        var payload = {
            tenderId,
            files
        };
        
        var suffix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/offer/supplier/${supplierId}/${suffix}`, payload, this.getRequestConfig());
    }

    deleteQuote(tenderId: string, quoteId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/tender/${tenderId}/quote/${quoteId}`, this.getRequestConfig());                
    }

    getTariffs(){
        return axios.get(`${this.baseApiUri}/portman-web/tariff/detail`, this.getRequestConfig());        
    }

    fetchPortfolioUploads(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/upload/query/portfolio/${portfolioId}`, this.getRequestConfig());        
    }

    fetchUploadReport(blobUri: string){
        return axios.get(`${blobUri}`, { headers: { "Accept": "application/json" }});        
    }

    fetchMeterConsumption(portfolioId: string, utility: UtilityType){
        var utilityString = utility == UtilityType.Electricity ? "electricity" : "gas";        
        return axios.get(`${this.baseApiUri}/portman-web/meters/portfolio/consumption/${portfolioId}/pages?from=-1&to=1000&utility=${utilityString}`, this.getRequestConfig());     
    }

    exportMeterConsumption(portfolioId: string, utility: UtilityType){
        var utilityString = utility == UtilityType.Electricity ? "electricity" : "gas";        
        return axios.get(`${this.baseApiUri}/portman-web/export/consumption/portfolio/${portfolioId}?utility=${utilityString}`, this.getRequestConfig());        
    }

    fetchTenderOffers(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/offers`, this.getRequestConfig());        
    }

    fetchTenderRecommendations(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/recommendations`, this.getRequestConfig());        
    }

    fetchRecommendationSummary(tenderId: string, summaryId: string){
        return axios.get(`${this.baseApiUri}/portman-web/recommendation/recommendation/tender/${tenderId}?summaryId=${summaryId}`, this.getRequestConfig());                
    }

    fetchRecommendationSuppliers(tenderId: string, summaryId: string){
        return axios.get(`${this.baseApiUri}/portman-web/recommendation/suppliers/tender/${tenderId}?summaryId=${summaryId}`, this.getRequestConfig());                
    }

    fetchRecommendationSites(tenderId: string, summaryId: string, siteStart: number, siteEnd: number){
        return axios.get(`${this.baseApiUri}/portman-web/recommendation/sites/tender/${tenderId}?summaryId=${summaryId}&start=${siteStart}&end=${siteEnd}`, this.getRequestConfig());                      
    }

    deleteRecommendation(tenderId: string, recommendationId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/recommendation/tender/${tenderId}?summaryId=${recommendationId}`, this.getRequestConfig());                
    }

    reportLogin(){
        return axios.post(`${this.baseApiUri}/portman-web/admin/logon`, null, this.getRequestConfig());
    }

    createContact(contact: AccountContact){
        return axios.post(`${this.hierarchyApiUri}/api/Contact`, contact, this.getRequestConfig());         
    }

    updateContact(contact: AccountContact){
        return axios.put(`${this.hierarchyApiUri}/api/Contact/${contact.id}`, contact, this.getRequestConfig());         
    }

    deleteContact(accountContactId: string){
        return axios.delete(`${this.hierarchyApiUri}/api/Contact/${accountContactId}`, this.getRequestConfig());         
    }

    fetchAccountDocumentation(accountId: string){
        return axios.get(`${this.baseApiUri}/portman-web/documentation/account/${accountId}`, this.getRequestConfig());        
    }

    fetchAccountUploads(accountId: string){
        return axios.get(`${this.baseApiUri}/portman-web/upload/query/account/${accountId}`, this.getRequestConfig());        
    }

    uploadAccountDocument(accountId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/account/${accountId}`, formData, this.getUploadFileConfig());
    }

    uploadOfferCollateral(tenderId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/collateral/${tenderId}`, formData, this.getUploadFileConfig());
    }

    reportSuccessfulAccountDocumentUpload(accountId: string, documentType: string, files: string[]){
        var payload = {
            blobFileName: files[0],
            accountId,
            documentType,
            received: moment().utc().format("YYYY-MM-DDTHH:mm:ss"),
            expiry: moment().utc().add(1, 'years').format("YYYY-MM-DDTHH:mm:ss"),
        };

        return axios.post(`${this.baseApiUri}/portman-web/documentation/account`, payload, this.getRequestConfig());
    }

    fetchUsers(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/users`, this.getRequestConfig());        
    }

    fetchAccountPortfolios(accountId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/account/${accountId}/jumplist`, this.getRequestConfig());        
    }

    fetchAccountContracts(accountId: string){
        return axios.get(`${this.baseApiUri}/portman-web/contract/account/${accountId}/existing`, this.getRequestConfig());        
    }

    createAccountContract(accountId: string, contract: TenderContract){
        return axios.post(`${this.baseApiUri}/portman-web/contract/account/${accountId}`, contract, this.getRequestConfig());        
    }

    updateAccountContract(contract: TenderContract){
        return axios.put(`${this.baseApiUri}/portman-web/contract/${contract.contractId}`, contract, this.getRequestConfig());        
    }

    deleteAccountContract(contractId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/contract/${contractId}`, this.getRequestConfig());        
    }

    fetchAccountContractRates(contractId: string){
        return axios.get(`${this.baseApiUri}/portman-web/contract/${contractId}/backingsheets`, this.getRequestConfig());                
    }

    createContractRenewal(contractId: string){
        return axios.post(`${this.baseApiUri}/portman-web/contract/trigger/renewal/${contractId}`, null, this.getRequestConfig());                        
    }

    acceptQuote(tenderId: string, quoteId: string){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/quote/accept/${quoteId}`, null, this.getRequestConfig());        
    }

    submitQuickQuote(tenderId: string, quote: QuickQuote) {
        return axios.post(`${this.baseApiUri}/portman-web/upload/quickquote/tender/${tenderId}`, quote, this.getRequestConfig());                
    }

    getEndpointPrefix(utility: UtilityType) {
        return utility == UtilityType.Gas ? "gas" : "electricity";
    }

    fetchInstanceDetails(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/instance`, this.getRequestConfig());
    }

    retrieveAccountContacts(accountId: string) {
        return axios.get(`${this.hierarchyApiUri}/api/contact/account/${accountId}`, this.getRequestConfig());      
    }
}

//import { FakeApiService } from './fake/fakeApiService';
//export default new FakeApiService();
export default new ApiService();