import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio,
         PortfolioContact,
         PortfolioRequirements,
         DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         DashboardPortfolioStatus,
         MpanTopline,
         PortfolioHistoryEntry,
         Site,
         Account,
         AccountCompanyStatusFlags } from "../model/Models";
import { MeterPortfolio, Mpan } from '../model/Meter';
import { Tender, TenderContract, TenderSupplier, BackingSheet} from '../model/Tender';
import { IApiService } from "./ApiService";
import { CompanyInfo } from '../model/CompanyInfo';
import { PortfolioDetails, PortfolioDocument } from '../model/PortfolioDetails';

const responseDelay = 1000;
const defer = (callback: () => void) => new Promise((resolve, reject) => setTimeout(() => callback(), responseDelay));
const respondWithSuccess = (statusCode: number, data: any) => {
  return new Promise<AxiosResponse>((resolve:(data:any) => void, reject:() => void) => {
    defer(() => resolve({
      status: statusCode,
      data: data
    }));
  }
  );
};
const OK = (data: any = null) => respondWithSuccess(200, data);
const Created = (data: any) => respondWithSuccess(201, data);
const BadRequest = (data: any) => respondWithSuccess(400, data);

export class FakeApiService implements IApiService {
    getAllPortfolios() {
        var portfolios: Portfolio[] = [
            {
                id: "1",
                title: "Fake portfolio",
                status: "Active",
                contractStart: "15/01/2017",
                contractEnd: "16/01/2017",
                accounts: 10,
                sites: 12,
                mpans: 159,
                category: "none",
                client: {
                    id: "1",
                    name: "Ring Leader",
                    contact: {
                        id: "1",
                        firstName: "Daniel",
                        lastName: "May",
                        status: "active",
                        avatarUrl: ""
                    }
                },
                creditRating: "A+",
                approvalStatus: "Approved",
                salesLead: {
                    id: "1",
                    firstName: "Daniel",
                    lastName: "May",
                    status: "active",
                    avatarUrl: ""
                },
                supportExec: {
                    id: "1",
                    firstName: "Daniel",
                    lastName: "May",
                    status: "active",
                    avatarUrl: ""
                }
             }
        ];

        return OK(portfolios);
    }

    getDashboardSummary(){
        var summary: DashboardPortfolioSummary = {
            context: "team",
            value: "1",
            portfolioCount: 24,
            siteCount: 12,
            mpanCount: 156
        };

        return OK(summary);
    }

    getDashboardTimeline(){
        var timeline: DashboardPortfolioTimeline = {
            context: "team",
            value: "1",
            timelineList: [ {
                id: "1",
                contractStart: "15/01/2017",
                contractEnd: "16/01/2017",
                title: "Test portfolio",
                workload: 2,
                totalMpans: 1
            }]
        };

        return OK(timeline);
    }

    getDashboardStatus(){
        var status: DashboardPortfolioStatus = {
            context: "team",
            value: "1",
        
            statusList: [
                {
                    status: "Indicative Pricing Only",
                    count: 24
                },
                {
                    status: "Ready",
                    count: 93
                },
                {
                    status: "Finished",
                    count: 253
                }
            ]
        };

        return OK(status);
    }
    
    getPortfolioHistory(portfolioId: string) {
        var history: PortfolioHistoryEntry[] = [
            {
                id: "1",
                parent: null,
                category: null,
                entityType: null,
                entityId: null,
                description: "",
                actionRequired: false,
                owner: 1,
                documentId: "",
                documentType: "",
                created: 1505333410318,
                children: null
            },
            {
                id: "2",
                parent: null,
                category: null,
                entityType: null,
                entityId: null,
                description: "",
                actionRequired: false,
                owner: 1,
                documentId: "",
                documentType: "",
                created: 1505333100000,
                children: null
            }
        ]

        return OK(history);
    }

    getPortfolioSiteMpans(portfolioId: string){
        var sites: Site[] = 
        [{
            id: "1",
            name: "Test site",
            effectiveFrom: "15/01/2017",
            effectiveTo: "16/01/2017",
            mpans: [
                {
                    id: "1",
                    mpanCore: "12345678901",
                    currentTopline: null,
                    currentHistorical: null,
                    proposedTopline: {
                        documentId: "1",
                        status: "UPLOADED",
                        validFrom: "15/06/2017"
                    },
                    proposedHistorical: {
                        documentId: "1",
                        status: "UPLOADED",
                        validFrom: "15/06/2017"
                    }
                },
                {
                    id: "2",
                    mpanCore: "23456789012",
                    currentTopline: {
                        documentId: "3",
                        status: "CURRENT",
                        validFrom: "17/06/2017"
                    },
                    currentHistorical: {
                        documentId: "4",
                        status: "CURRENT",
                        validFrom: "17/06/2017"
                    },
                    proposedTopline: null,
                    proposedHistorical: null,
                }
            ]
        }];

        var wrapper = {
            sites
        };
        return OK(wrapper);
    }

    getMpanTopline(documentId: string){
        var topline: MpanTopline = {
            _id : "59aeffcdb1a0d819811eede1",
            connection: "Network",
            cot: false,
            da: "UKDC",
            dc: "UKDC",
            duosFixed: true,
            eac: "null",
            energisation: "E",
            gspGroup: "_A",
            llf: "86",
            measurementClass: "C",
            meterType: "HH",
            mo: "EELC",
            mpanCore: "1640000432138",
            mtc: "845",
            newConnection: false,
            profileClass: "0",
            retrievalMethod: "R",
            ssc: "null",
            voltage: "High",
            group: "PROPOSED",
            created: "2017-09-13T11:45:33.446",
            creator: {
                id: "1",
                firstName: "Daniel",
                lastName: "May",
                status: "active",
                avatarUrl: ""
            }
        };

        return OK(topline);
    }

    getMpanHistorical(documentId: string){
        let historical = require("json-loader!./fake/mpanHistorical.json");    
        return OK(historical);
    }

    searchCompany(companyNumber: string){
        var company: CompanyInfo = {
            companyName: "ZENITH PRINT (UK) LIMITED",
            companyNumber: "02050399",
            addressLine1: "15 LON UCHAF",
            addressLine2: "LON UCHAF",
            companyStatus: "Active",
            countryOfOrigin: "United Kingdom",
            county: "MID GLAMORGAN",
            incorporationDate: "28/08/1986",
            postcode: "CF83 1BR",
            postTown: "CAERPHILLY"
        };

        return OK(company);
    }

    createAccount(company: CompanyInfo){
        var response = {
            id: "4dbd3fb8-c598-4d33-a0f6-b12da7b8b0d0"
        };

        return OK(response);
    }

    retrieveAccount(accountId: string){
        var account: Account = {
            id: accountId,
            accountNumber: "1",
            address: "123 Fake St",
            companyName: "ABC XYZ Ltd",
            companyRegistrationNumber: "124567890",
            companyStatus: "Active",
            contact: "AB CD",
            countryOfOrigin: "United Kingdom",
            creditRating: "A+++",
            hasCCLException: true,
            hasFiTException: false,
            incorporationDate: "12/04/2012",
            isRegisteredCharity: false,
            isVATEligible: true,
            postcode: "AB12 CD2"
        };
        
        return OK(account);
    }

    updateAccountFlags(accountId: string, accountFlags: AccountCompanyStatusFlags){
        var account: Account = {
            id: accountId,
            accountNumber: "1",
            address: "123 Fake St",
            companyName: "ABC XYZ Ltd",
            companyRegistrationNumber: "124567890",
            companyStatus: "Active",
            contact: "AB CD",
            countryOfOrigin: "United Kingdom",
            creditRating: "A+++",
            hasCCLException: true,
            hasFiTException: false,
            incorporationDate: "12/04/2012",
            isRegisteredCharity: false,
            isVATEligible: true,
            postcode: "AB12 CD2"
        };
        
        return OK(account);
    }

    createPortfolio(accountId: string, company: CompanyInfo){
        var response = {
            id: "a1b01d44-5971-4be0-a197-0226c44372ea",
            title: company.companyName,
            status: "onboard",
            category: "direct",
            teamId: 989,
            ownerId: 1,
            supportOwner: 7,
            accountId: accountId,
            //contact: null,
            contractStart: "2017-12-01T00:00:00",
            contractEnd: "2018-03-01T00:00:00"
        }

        return OK(response);
    }

    getPortfolioDetails(portfolioId: string) {
        var contact: PortfolioContact = {
            id: "ca49abcc-c483-427b-9adb-47a7d08d1d9a",
			firstName: "Bertie",
			lastName: "Basset",
			email: "bertie.basset@wherever.com",
			role: "procurement",
			phoneNumber: "+44 2020202222",
			accountId: "493e1708-2457-48ba-8925-09856d6e9732",
			portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51"
        };

        var documentation: PortfolioDocument[] = [{
            id: "d7b3ae3d-5b65-4e6b-87c1-d68e9b9d8be7",
            blobFileName: "loa_rls_20171121.pdf",
            accountId: "493e1708-2457-48ba-8925-09856d6e9732",
            documentType: "loa",
            received: "2017-11-21T05:49:53",
            expiry: "2018-11-20T05:49:53"
        }];

        var portfolioDetails: PortfolioDetails = {
            portfolio: {
                id: "4d584e81-91c2-47b4-85f9-411db125af51",
                title: "Portfolio for testing",
                status: "onboard",
                category: "direct",
                teamId: 989,
                ownerId: 1,
                supportOwner: 0,
                accountId: "493e1708-2457-48ba-8925-09856d6e9732",
                contact: null,
                contractStart: "2017-09-01T00:00:00",
                contractEnd: "2019-01-30T00:00:00"
            },
            requirements: {
                id: "6ae3c008-5541-48a4-b514-be36b1a613bd",
                portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51",
                product: "Fixed",
                paymentTerms: 21,
                startDate: "2018-01-12T00:54:25",
                durationMonths: 18,
                stodId: "day/night",
                gasRequired: true,
                electricityRequired: true,
                greenPercentage: 100.0
            },
            documentation: null,
            meterGroups: [{
                groupName: "GAS",
                meterCount: 4,
                supplyDataCount: 4,
                historicalCount: 0,
                forecastCount: 0
            }, {
                groupName: "ELECTRICITY",
                meterCount: 25,
                supplyDataCount: 25,
                historicalCount: 24,
                forecastCount: 0
            }],
            siteCount: 0
        }

        return OK(portfolioDetails);
    }

    updatePortfolioContact(contact: PortfolioContact){
        return OK();
    }

    updatePortfolioRequirements(requirements: PortfolioRequirements){
        return OK();
    }

    uploadLoa(portfolioId: string, accountId: string, file: Blob){
        return OK();
    }

    getAllMeters(portfolioId: string){
        var data: MeterPortfolio = {
            portfolioId: "1",
            sites: [{
                siteCode: "test site",
                mpans: [
                    {
                        meterSupplyData: {
                            address: null,
                            capacity: 0,
                            connection: "Network",
                            currentContractEnd: null,
                            daAgent: null,
                            dcAgent: "UKDC",
                            eac: 0,
                            energized: true,
                            gspGroup: "_A",
                            id: "30f83b25-304c-4903-9924-3de29a295b60",
                            llf: "973",
                            measurementClass: "D",
                            meterTimeSwitchCode: "845",
                            meterType: "HH",
                            moAgent: "EELC",
                            mpanCore: "1001110011154",
                            newConnection: false,
                            periodConsumption: null,
                            postcode: null,
                            profileClass: "00",
                            rec: 0,
                            retrievalMethod: "R",
                            serialNumber: "LKD007",
                            siteCode: null,
                            totalConsumption: 0,
                            utility: "ELECTRICITY",
                            voltage: null
                        },
                        halfHourly: {
                            forecast: null,
                            historical: {
                                created: "2018-01-08T10:32:23.197",
                                docId: "5a5348b2c3ae3643b9b19c19"
                            }
                        }
                }],
                mprns: [
                    {
                        meterSupplyData: {
                            aQ: 0,
                            address: null,
                            changeOfUse: false,
                            currentContractEnd: null,
                            id: null,
                            imperial: false,
                            make: null,
                            model: null,
                            mprnCore: "612345",
                            postcode: null,
                            serialNumber: null,
                            siteCode: null,
                            size: 0,
                            utility: "GAS"
                        },
                        halfHourly: null
                    }
                ]
            }]
        };
        
        return OK(data);
	}
		
    uploadSupplyMeterData(portfolioId: string, accountId: string, file: Blob){
        return OK();
    }

    uploadHistorical(portfolioId: string, file: Blob){
        return OK();
    }

    uploadSiteList(portfolioId: string, accountId: string, file: Blob){
        return OK();
    }

    updateMeter(portfolioId: string, meter: Mpan){
        return OK();
    }

    uploadBackingSheet(tenderId: string, file: Blob){
        return OK();
    }

    getPortfolioTenders(portfolioId: string){
        var data: Tender[] = [
            {
                tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50",
                tenderTitle: "Best tender",
                billingMethod: "Paper",
                portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51",
                created: "2017-12-19T00:12:07.167",
                deadline: null,
                deadlineNotes: null,
                commission: 1,
                status: "CREATED",
                quotes: [],
                assignedSuppliers: [
                    {
                        supplierId: "4",
                        name: "Eon",
                        acctMgrId: "004",
                        gasSupplier: true,
                        electricitySupplier: true,
                        paymentTerms: 28,
                        logoUri: "EonLogoMainLogo.svg"
                    }
                ],
                packs: [],
                existingContract: {
                    contractId: "bc6f7888-d4cf-443b-aa28-e79c58ba14bb",
                    supplierId: "1",
                    accountId: "493e1708-2457-48ba-8925-09856d6e9732",
                    contractStart: "2016-12-19T00:12:07.167",
                    contractEnd: "2019-01-19T00:12:07.167",
                    product: "fixed",
                    reference: "havenGas16",
                    utility: "GAS",
                    incumbent: true,
                    uploaded: null,
                    status: null
                },
                utility: "GAS"
            }
        ];

        return OK(data);
    }

    getTenderSuppliers(){
        var data: TenderSupplier[] = [
            {
                supplierId: "1",
                name: "Haven Power",
                acctMgrId: "001",
                gasSupplier: true,
                electricitySupplier: true,
                paymentTerms: 28,
                logoUri: "https://portfoliogeneration.blob.core.windows.net/suppliers/haven.png"
            },
            {
                supplierId: "4",
                name: "Eon",
                acctMgrId: "004",
                gasSupplier: true,
                electricitySupplier: true,
                paymentTerms: 28,
                logoUri: "https://portfoliogeneration.blob.core.windows.net/suppliers/EonLogoMainLogo.svg"
            }
        ];

        return OK(data);
    }

    addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string) {
        return OK();
    }

    deleteTender(portfolioId: string, tenderId: string){
        return OK();
    }

    createElectricityTender(portfolioId: string){
        return OK();
    }

    createGasTender(portfolioId: string){
        return OK();
    }

    assignTenderSupplier(tenderId: string, supplierId: string){
        return OK();
    }

    unassignTenderSupplier(tenderId: string, supplierId: string){
        return OK();
    }

    updateTender(tenderId: string, tender: Tender){
        return OK();
    }

    getContractBackingSheets(tenderId: string, contractId: string){
        var backing = this.getBackingSheets();
        return OK(backing);
    }

    getQuoteBackingSheets(tenderId: string, quoteId: string){
        var backing = this.getBackingSheets();
        return OK(backing);        
    }

    getBackingSheets(){
        var bs: BackingSheet[] = [
            {
                sheetType: null,
                parentId: "b004832f-ac3b-4138-adfa-8d8bc29ae526",
                sheetId: "0c1e6140-0c26-474d-8c1a-8d85b1c41db5",
                tenderRef: "",
                supplier: "British Gas",
                siteCode: "Coventry",
                address1: "",
                address2: "",
                town: "",
                postcode: "",
                utility: "electricity",
                product: "24 Month Green 100%",
                contractLength: 24,
                billingFrequency: "Monthly",
                paymentTerms: 28,
                topline: "S03 801 201",
                consumption1: 100000,
                consumption2: 27000,
                consumption3: 0,
                consumption4: 0,
                consumption5: 0,
                totalUnits: 127000,
                rateName1: "Day Units 7 - 12 Mon - Fri",
                rateName2: "Night Units 12 - 7 All days",
                rateName3: "Day Units Feb - March",
                rateName4: "Rate 4 Units Nov - Dec",
                rateName5: "Rate 5 Units Weekend",
                rate1: 11.5,
                rate2: 7.2,
                rate3: 0,
                rate4: 0,
                rate5: 0,
                duosRedConsumption: 0,
                duosAmberConsumption: 0,
                duosGreenConsumption: 0,
                duosRedRate: 0,
                duosAmberRate: 0,
                duosGreenRate: 0,
                greenPercentage: 100,
                greenPremiumRate: 0.254,
                fixedCharge: 19,
                settlementRate: 18.5,
                kVARate: 2.2,
                kVACapacity: 500,
                fITRate: 0.03,
                cCLRate: 0.58,
                commission: 0.1,
                vatPercentage: 20,
                rate1Cost: 11500,
                rate2Cost: 1944,
                rate3Cost: 0,
                rate4Cost: 0,
                rate5Cost: 0,
                duosRedCost: 0,
                duosAmberCost: 0,
                duosGreenCost: 0,
                greenPremiumCost: 322.58,
                fixedChargesCost: 228,
                settlementsCost: 222,
                kVACosts: 1100,
                fITCosts: 38.1,
                cCLCosts: 736.6,
                commissionCost: 127,
                totalCostIncCCL: 16218.28,
                vATCost: 32.44,
                totalCostIncVAT: 16250.72,
                mpanCore: "1001110011121"
            }
        ];
    }

    generateTenderPack(tenderId: string, portfolioId: string){
        return OK();
    }
}

export default new FakeApiService();