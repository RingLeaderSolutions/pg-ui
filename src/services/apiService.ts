import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio, CompanyInfo, PortfolioContact, PortfolioRequirements, Account, AccountCompanyStatusFlags, UtilityType, User } from "../model/Models";
import { FakeApiService } from './fakeApiService';
import StorageService from './storageService';
import { Mpan } from '../model/Meter';
import { Tender, TenderContract, TenderSupplier, TenderRequirements } from '../model/Tender';
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
  
  getPortfolioHistory(portfolioId: string): Promise<AxiosResponse>;

  getMpanTopline(documentId: string): Promise<AxiosResponse>;
  getMpanHistorical(documentId: string): Promise<AxiosResponse>;

  getAllMeters(portfolioId: string): Promise<AxiosResponse>;
  updateMeter(portfolioId: string, meter: Mpan): Promise<AxiosResponse>;
  excludeMeters(portfolioId: string, meters: string[]): Promise<AxiosResponse>;

  uploadLoa(portfolioId: string, file: Blob): Promise<AxiosResponse>;
  uploadSupplyMeterData(portfolioId: string, file: Blob, utility: UtilityType): Promise<AxiosResponse>;
  uploadHistorical(portfolioId: string, files: Blob[]): Promise<AxiosResponse>;
  uploadSiteList(portfolioId: string, file: Blob): Promise<AxiosResponse>;
  uploadElectricityBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadGasBackingSheet(contractId: string, file: Blob): Promise<AxiosResponse>;
  uploadOffer(tenderId: string, supplierId: string, file: Blob): Promise<AxiosResponse>;

  reportSuccessfulLoaUpload(portfolioId: string, accountId: string, files: string[]): Promise<AxiosResponse>;
  reportSuccessfulSupplyMeterDataUpload(portfolioId: string, accountId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulSiteListUpload(portfolioId: string, accountId: string, files: string[]): Promise<AxiosResponse>;
  reportSuccessfulHistoricalUpload(portfolioId: string, files: string[]): Promise<AxiosResponse>;
  reportSuccessfulBackingSheetUpload(contractId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;
  reportSuccessfulOfferUpload(tenderId: string, supplierId: string, files: string[], utility: UtilityType): Promise<AxiosResponse>;

  getTenderSuppliers(): Promise<AxiosResponse>;
  getPortfolioTenders(portfolioId: string): Promise<AxiosResponse>;
  addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  deleteTender(portfolioId: string, tenderId: string): Promise<AxiosResponse>;
  createHHElectricityTender(portfolioId: string): Promise<AxiosResponse>;
  createNHHElectricityTender(portfolioId: string): Promise<AxiosResponse>;
  createGasTender(portfolioId: string): Promise<AxiosResponse>;
  assignTenderSupplier(tenderId: string, supplierId: string): Promise<AxiosResponse>;
  unassignTenderSupplier(tenderId: string, supplierId: string): Promise<AxiosResponse>;
  updateTender(tenderId: string, tender: Tender): Promise<AxiosResponse>;
  getContractBackingSheets(tenderId: string, contractId: string): Promise<AxiosResponse>;
  getQuoteBackingSheets(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  generateTenderPack(tenderId: string, portfolioId: string): Promise<AxiosResponse>;
  issueTenderPack(tenderId: string, subject: string, body: string): Promise<AxiosResponse>;
  generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string): Promise<AxiosResponse>;
  issueSummaryReport(tenderId: string, reportId: string): Promise<AxiosResponse>;
  fetchTenderIssuanceEmail(tenderId: string): Promise<AxiosResponse>;
  exportContractRates(tenderId: string, quoteId: string): Promise<AxiosResponse>;
  updateTenderRequirements(requirements: TenderRequirements): Promise<AxiosResponse>;

  getActiveUsers(): Promise<AxiosResponse>;
  assignPortfolioUsers(portfolioId: string, users: User[]): Promise<AxiosResponse>;
  fetchBackendVersion(): Promise<AxiosResponse>;

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

    uploadLoa(portfolioId: string, file: Blob){
        var formData = new FormData();
        formData.append('files', file);

        return axios.post(`${this.uploadApiUri}/api/upload/loa/${portfolioId}`, formData, this.getUploadFileConfig());
    }

    uploadSupplyMeterData(portfolioId: string, file: Blob, utility: UtilityType){
        var formData = new FormData();
        formData.append('files', file);

        var prefix = utility == UtilityType.Electricity ? "electricity" : "gas";
        return axios.post(`${this.uploadApiUri}/api/upload/supply/${prefix}/${portfolioId}`, formData, this.getUploadFileConfig());
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

    getMpanHistorical(documentId: string){
        return new FakeApiService().getMpanHistorical(documentId);
        //return axios.get(`${this.baseApiUri}/historical/${documentId}`, this.getRequestConfig());                        
    }

    getAllMeters(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/meters/portfolio/${portfolioId}`, this.getRequestConfig());
    }

    updateMeter(portfolioId: string, meter: Mpan){
        return axios.put(`${this.baseApiUri}/portman-web/meters/electricity/portfolio/${portfolioId}`, meter.meterSupplyData, this.getRequestConfig());
    }

    getPortfolioTenders(portfolioId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}`, this.getRequestConfig());        
    }

    getTenderSuppliers(){
        return axios.get(`${this.baseApiUri}/portman-web/tender/suppliers`, this.getRequestConfig());        
    }

    addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/${tenderId}/portfolio/${portfolioId}/contract`, contract, this.getRequestConfig());        
    }

    deleteTender(portfolioId: string, tenderId: string){
        return axios.delete(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/tender/${tenderId}`, this.getRequestConfig());
    }

    createHHElectricityTender(portfolioId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/electricity/hh`, null, this.getRequestConfig());
    }

    createNHHElectricityTender(portfolioId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/electricity/nhh`, null, this.getRequestConfig());
    }

    createGasTender(portfolioId: string){
        return axios.post(`${this.baseApiUri}/portman-web/tender/portfolio/${portfolioId}/gas`, null, this.getRequestConfig());
    }

    assignTenderSupplier(tenderId: string, supplierId: string){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/supplier/${supplierId}/assign`, null, this.getRequestConfig());
    }

    unassignTenderSupplier(tenderId: string, supplierId: string){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/supplier/${supplierId}/unassign`, null, this.getRequestConfig());
    }

    updateTender(tenderId: string, tender: Tender){
        return axios.put(`${this.baseApiUri}/portman-web/tender/${tenderId}/`, tender, this.getRequestConfig());
    }

    getContractBackingSheets(tenderId: string, contractId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/${tenderId}/contractBackingsheets/contract/${contractId}`, this.getRequestConfig());        
    }

    getQuoteBackingSheets(tenderId: string, quoteId: string){
        return axios.get(`${this.baseApiUri}/portman-web/tender/${tenderId}/contractBackingsheets/quote/${quoteId}`, this.getRequestConfig());        
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

    reportSuccessfulSupplyMeterDataUpload(portfolioId: string, accountId: string, files: string[], utility: UtilityType){
        var payload = {
            portfolioId,
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

    reportSuccessfulHistoricalUpload(portfolioId: string, files: string[]) {
        var payload = {
            csvNames: files,
            uploadType: "HISTORICAL",
            notes: `Uploaded ${moment().toISOString()}`
        };
        
        return axios.post(`${this.baseApiUri}/portman-web/upload/historical/${portfolioId}`, payload, this.getRequestConfig());
    }

    reportSuccessfulBackingSheetUpload(contractId: string, files: string[], utility: UtilityType) {
        var payload = {
            csvNames: files,
            uploadType: "CONTRACT_BACKINGSHEETS",
            notes: `Uploaded ${moment().toISOString()}`
        };
        
        var prefix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/backingsheets/contract/${contractId}/${prefix}`, payload, this.getRequestConfig());
    }

    reportSuccessfulOfferUpload(tenderId: string, supplierId: string, files: string[], utility: UtilityType){
        var payload = {
            tenderId,
            files
        };
        
        var prefix = this.getEndpointPrefix(utility);
        return axios.post(`${this.baseApiUri}/portman-web/upload/offer/supplier/${supplierId}/${prefix}`, payload, this.getRequestConfig());
    }

    updateTenderRequirements(requirements: TenderRequirements){
        return axios.post(`${this.baseApiUri}/portman-web/tender/requirements`, requirements, this.getRequestConfig());        
    }

    getTariffs(){
        return axios.get(`${this.baseApiUri}/portman-web/tariff`, this.getRequestConfig());        
    }

    getEndpointPrefix(utility: UtilityType) {
        return utility == UtilityType.Gas ? "gas" : "electricity";
    }
}

//export default new FakeApiService();
export default new ApiService();