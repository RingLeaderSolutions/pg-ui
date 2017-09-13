import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio,
         DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         DashboardPortfolioStatus,
         MpanSummary,
         MpanTopline,
         PortfolioHistoryEntry,
         Site } from "../model/Models";

import { IApiService } from "./ApiService";

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

    getPortfolioMpanSummary(portfolioId: string){
        var mpanSummary: MpanSummary[] = [
            {
                stage: "HH",
                completed: 25,
                incomplete: 3654
            },
            {
                stage: "Topline",
                completed: 15,
                incomplete: 3254
            }
        ]

        return OK(mpanSummary);
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
                created: 1415463675,
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
                created: 1504514597,
                children: null
            }
        ]

        return OK(history);
    }

    getPortfolioSiteMpans(portfolioId: string){
        var mpans: Site[] = 
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

        return OK(mpans);
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
            voltage: "High"
        };

        return OK(topline);
    }

    getMpanHistorical(documentId: string){
        let historical = require("json-loader!./fake/mpanHistorical.json");    
        return OK(historical);
    }
}

export default new FakeApiService();