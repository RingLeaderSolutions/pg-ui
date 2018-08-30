import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio, CompanyInfo, PortfolioContact, PortfolioRequirements, Account, AccountCompanyStatusFlags, UtilityType, User } from "../model/Models";
import { FakeApiService } from './fakeApiService';
import StorageService from './storageService';
import { Mpan } from '../model/Meter';
import { Tender, TenderContract, TenderSupplier, TenderRequirements } from '../model/Tender';
import * as moment from 'moment';
import { AccountContact } from '../model/HierarchyObjects';
import { PortfolioCreationRequest } from '../model/Portfolio';

export interface IApiService {
  getAllPortfolios(): Promise<AxiosResponse>;
  getPortfolioDetails(portfolioId: string): Promise<AxiosResponse>;

  getDashboardSummary(): Promise<AxiosResponse>;
  getDashboardTimeline(): Promise<AxiosResponse>;
  getDashboardStatus(): Promise<AxiosResponse>;

  searchCompany(companyNumber: string): Promise<AxiosResponse>;
  
  createPortfolio(portfolio: PortfolioCreationRequest) : Promise<AxiosResponse>;
  createPortfolioFromCompany(accountId: string, company: CompanyInfo): Promise<AxiosResponse>;
  updatePortfolioContact(contact: PortfolioContact): Promise<AxiosResponse>;
  updatePortfolioRequirements(requirements: PortfolioRequirements): Promise<AxiosResponse>;
  deletePortfolio(portfolioId: string) : Promise<AxiosResponse>;
  editPortfolio(portfolio: PortfolioCreationRequest) : Promise<AxiosResponse>;

  retrieveAccounts(): Promise<AxiosResponse>;  
  retrieveAccount(accountId: string): Promise<AxiosResponse>;
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
  
  getPortfolioHistory(portfolioId: string): Promise<AxiosResponse>;

  getAllMeters(portfolioId: string): Promise<AxiosResponse>;
  fetchMeterConsumption(portfolioId: string): Promise<AxiosResponse>;
  updateMeter(portfolioId: string, meter: Mpan): Promise<AxiosResponse>;
  excludeMeters(portfolioId: string, meters: string[]): Promise<AxiosResponse>;
  includeMeters(portfolioId: string, meters: string[]): Promise<AxiosResponse>;
  exportMeterConsumption(portfolioID: string): Promise<AxiosResponse>;

  fetchPortfolioUploads(portfolioId: string): Promise<AxiosResponse>;
  fetchUploadReport(reportId: string, isImport: boolean): Promise<AxiosResponse>;

  uploadLoa(portfolioId: string, file: Blob): Promise<AxiosResponse>;
  uploadSupplyMeterData(accountId: string, file: Blob, utility: UtilityType): Promise<AxiosResponse>;
  uploadHistorical(portfolioId: string, files: Blob[]): Promise<AxiosResponse>;
  uploadSiteList(portfolioId: string, file: Blob): Promise<AxiosResponse>;
  uploadElectricityBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadGasBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadOffer(tenderId: string, supplierId: string, file: Blob): Promise<AxiosResponse>;
  uploadAccountDocument(accountId: string, file: Blob): Promise<AxiosResponse>;

  reportSuccessfulLoaUpload(portfolioId: string, accountId: string, files: string[]): Promise<AxiosResponse>;
  reportSuccessfulSupplyMeterDataUpload(accountId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulSiteListUpload(portfolioId: string, accountId: string, files: string[]): Promise<AxiosResponse>;
  reportSuccessfulHistoricalUpload(portfolioId: string, files: string[], historicalType: string): Promise<AxiosResponse>;
  reportSuccessfulBackingSheetUpload(contractId: string, useGeneric: boolean, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulOfferUpload(tenderId: string, supplierId: string, useGeneric: boolean, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulAccountDocumentUpload(accountId: string, documentType: string, files: string[]): Promise<AxiosResponse>;

  getTenderSuppliers(): Promise<AxiosResponse>;
  getPortfolioTenders(portfolioId: string): Promise<AxiosResponse>;
  addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  updateExistingContract(contract: TenderContract, portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  deleteTender(portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  createTender(portfolioId: string, tender: Tender, utilityType: UtilityType, halfHourly?: boolean): Promise<AxiosResponse>;
  updateTenderSuppliers(tenderId: string, supplierIds: string[]): Promise<AxiosResponse>;
  updateTender(tenderId: string, tender: Tender): Promise<AxiosResponse>;
  getContractBackingSheets(tenderId: string, contractId: string): Promise<AxiosResponse>;
  getQuoteBackingSheets(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  generateTenderPack(tenderId: string, portfolioId: string): Promise<AxiosResponse>;
  issueTenderPack(tenderId: string, subject: string, body: string): Promise<AxiosResponse>;
  generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string): Promise<AxiosResponse>;
  issueSummaryReport(tenderId: string, reportId: string): Promise<AxiosResponse>;
  fetchTenderIssuanceEmail(tenderId: string): Promise<AxiosResponse>;
  exportContractRates(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  deleteQuote(tenderId: string, quoteId: string): Promise<AxiosResponse>;

  fetchTenderOffers(portfolioId: string): Promise<AxiosResponse>;
  fetchTenderRecommendations(portfolioId: string): Promise<AxiosResponse>;

  fetchRecommendationSuppliers(tenderId: string, summaryId: string): Promise<AxiosResponse>;
  fetchRecommendationSites(tenderId: string, summaryId: string, siteStart: number, siteEnd: number): Promise<AxiosResponse>;
  deleteRecommendation(tenderId: string, recommendationId: string): Promise<AxiosResponse>;

  reportLogin(): Promise<AxiosResponse>;
  getActiveUsers(): Promise<AxiosResponse>;
  assignPortfolioUsers(portfolioId: string, users: User[]): Promise<AxiosResponse>;
  fetchBackendVersion(): Promise<AxiosResponse>;
  fetchUsers(): Promise<AxiosResponse>;
  fetchInstanceDetails(): Promise<AxiosResponse>;
  getTariffs(): Promise<AxiosResponse>;
}

export class ApiService implements IApiService {
    baseApiUri: string;
    hierarchyApiUri: string;
    uploadApiUri: string;
    contextQuery: string;
    teamId: string;
    storage: StorageService;

    constructor(){
        this.baseApiUri = appConfig.baseApiUri;
        this.hierarchyApiUri = appConfig.hierarchyApiUri;
        this.uploadApiUri = appConfig.uploadApiUri;
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

    updatePortfolioContact(contact: PortfolioContact){
        return axios.post(`${this.baseApiUri}/portman-web/portfolio/contact`, contact, this.getRequestConfig());
    }

    updatePortfolioRequirements(requirements: PortfolioRequirements){
        let portfolioId = requirements.entityId;
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

    createPortfolioFromCompany(accountId: string, company: CompanyInfo){
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

    uploadLoa(portfolioId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/loa/${portfolioId}`, formData, this.getUploadFileConfig());
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

    uploadSiteList(portfolioId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/sites/${portfolioId}`, formData, this.getUploadFileConfig());
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

    getAllMeters(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/meters/portfolio/${portfolioId}`, this.getRequestConfig());
    }

    updateMeter(portfolioId: string, meter: Mpan){
        return axios.put(`${this.baseApiUri}/portman-web/meters/electricity/portfolio/${portfolioId}`, meter.meterSupplyData, this.getRequestConfig());
    }

    getPortfolioTenders(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/basic`, this.getRequestConfig());        
    }

    getTenderSuppliers(){
        return axios.get(`${this.baseApiUri}/portman-web/tender/suppliers`, this.getRequestConfig());        
    }

    addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/portfolio/${portfolioId}/contract`, contract, this.getRequestConfig());        
    }

    updateExistingContract(contract: TenderContract, portfolioId: string, tenderId: string){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/portfolio/${portfolioId}/contract`, contract, this.getRequestConfig());        
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
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/testSummaryReport`, requestBody, this.getRequestConfig());                        
    }
  
    getActiveUsers(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/users`, this.getRequestConfig());                
    }

    assignPortfolioUsers(portfolioId: string, users: User[]){
        return axios.post(`${this.baseApiUri}/portman-web/admin/staff/assignment/portfolio/${portfolioId}`, users, this.getRequestConfig());
    }

    issueSummaryReport(tenderId: string, reportId: string){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/issueSummaryReport/${reportId}`, {}, this.getRequestConfig());
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

    reportSuccessfulLoaUpload(portfolioId: string, accountId: string, files: string[]) {
        var payload = {
            id: "",
            accountId,
            blobFileName: files[0],
            received: moment().format("YYYY-MM-DDTHH:mm:ss"),
            expiry: moment().add(1, 'years').format("YYYY-MM-DDTHH:mm:ss"),
            documentType: "loa"
        };
        return axios.post(`${this.baseApiUri}/portman-web/upload/loa/${portfolioId}`, payload, this.getRequestConfig());
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

    reportSuccessfulSiteListUpload(portfolioId: string, accountId: string, files: string[]) {
        var payload = {
            portfolioId,
            csvNames: files,
            uploadType: "SITELIST",
            notes: `Uploaded ${moment().toISOString()}`
        };
        
        return axios.post(`${this.baseApiUri}/portman-web/upload/sitelist/${accountId}`, payload, this.getRequestConfig());
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

    reportSuccessfulBackingSheetUpload(contractId: string, useGeneric: boolean, files: string[], utility: UtilityType) {
        var payload = {
            csvNames: files,
            uploadType: "CONTRACT_BACKINGSHEETS",
            notes: `Uploaded ${moment().toISOString()}`,
            useGeneric
        };
        
        var suffix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/backingsheets/contract/${contractId}/${suffix}`, payload, this.getRequestConfig());
    }

    reportSuccessfulOfferUpload(tenderId: string, supplierId: string, useGeneric: boolean, files: string[], utility: UtilityType){
        var payload = {
            tenderId,
            useGeneric,
            files
        };
        
        var suffix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/offer/supplier/${supplierId}/${suffix}`, payload, this.getRequestConfig());
    }

    deleteQuote(tenderId: string, quoteId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/tender/${tenderId}/quote/${quoteId}`, this.getRequestConfig());                
    }

    getTariffs(){
        return axios.get(`${this.baseApiUri}/portman-web/tariff`, this.getRequestConfig());        
    }

    fetchPortfolioUploads(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/upload/query/portfolio/${portfolioId}`, this.getRequestConfig());        
    }

    fetchUploadReport(reportId: string, isImport: boolean){
        if(isImport){
            return axios.get(`${this.baseApiUri}/portman-web/upload/query/import/${reportId}`, this.getRequestConfig());        
        }

        return axios.get(`${this.baseApiUri}/portman-web/upload/query/upload/${reportId}`, this.getRequestConfig());        
    }

    fetchMeterConsumption(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/meters/portfolio/consumption/${portfolioId}`, this.getRequestConfig());     
    }

    exportMeterConsumption(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/export/consumption/portfolio/${portfolioId}`, this.getRequestConfig());        
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

    reportSuccessfulAccountDocumentUpload(accountId: string, documentType: string, files: string[]){
        var payload = {
            blobFileName: files[0],
            accountId,
            documentType,
            received: moment().format("YYYY-MM-DDTHH:mm:ss"),
            expiry: moment().add(1, 'years').format("YYYY-MM-DDTHH:mm:ss"),
        };

        return axios.post(`${this.baseApiUri}/portman-web/documentation/account`, payload, this.getRequestConfig());
    }

    fetchUsers(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/users`, this.getRequestConfig());        
    }

    fetchAccountPortfolios(accountId: string){
        return axios.get(`${this.baseApiUri}/portman-web/portfolios/account/${accountId}/jumplist`, this.getRequestConfig());        
    }

    getEndpointPrefix(utility: UtilityType) {
        return utility == UtilityType.Gas ? "gas" : "electricity";
    }

    fetchInstanceDetails(){
        return axios.get(`${this.baseApiUri}/portman-web/admin/instance`, this.getRequestConfig());
    }
}

//export default new FakeApiService();
export default new ApiService();