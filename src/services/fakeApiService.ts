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
import { Meter } from '../model/Meter';
import { IApiService } from "./ApiService";
import { CompanyInfo } from '../model/CompanyInfo';

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
        return OK();
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
        var portfolioDetails = {};

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
        var data = {
            portfolioId: "guid",
            meters: [
                {
                    meterSupplyData: {
                        mpanCore: "123456798",
                        utility: "electricity",
                        meterType: "HH",
                        newConnection: false,
                        MTC: "845",
                        LLF: "86",
                        profileClass: "0",
                        retrievalMethod: "R",
                        GSPGroup: "_A",
                        measurementClass: "C",
                        energised: true,
                        da: "UKDC",
                        dc: "UKDC",
                        mo: "EELC",
                        voltage: "low",
                        connection: "network",
                        serialNumber: "AO9X031482",
                        capacity: 2.0,
                        EAC: "abc"
                    }
                },
                {
                    meterSupplyData: {
                        mpanCore: "123456798",
                        utility: "electricity",
                        meterType: "HH",
                        newConnection: false,
                        MTC: "845",
                        LLF: "86",
                        profileClass: "0",
                        retrievalMethod: "R",
                        GSPGroup: "_A",
                        measurementClass: "C",
                        energised: true,
                        da: "UKDC",
                        dc: "UKDC",
                        mo: "EELC",
                        voltage: "low",
                        connection: "network",
                        serialNumber: "AO9X031482",
                        capacity: 2.0,
                        EAC: "abc"
                    }
                },
                {
                    meterSupplyData: {
                        mpanCore: "123456798",
                        utility: "gas",
                        meterType: "HH",
                        newConnection: false,
                        MTC: "845",
                        LLF: "86",
                        profileClass: "0",
                        retrievalMethod: "R",
                        GSPGroup: "_A",
                        measurementClass: "C",
                        energised: true,
                        da: "UKDC",
                        dc: "UKDC",
                        mo: "EELC",
                        voltage: "low",
                        connection: "network",
                        serialNumber: "AO9X031482",
                        capacity: 2.0,
                        EAC: "abc"
                    }
                }
            ]
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

    updateMeter(portfolioId: string, meter: Meter){
        return OK();
    }
}

export default new FakeApiService();