import { AxiosResponse } from 'axios';
import axios from 'axios';
import { Portfolio,
         DashboardPortfolioSummary,
         DashboardPortfolioTimeline,
         DashboardPortfolioStatus,
         MpanSummary,
         PortfolioHistoryEntry } from "../model/Models";

import { IApiService } from "./ApiService";

const responseDelay = 2000;
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
}

export default new FakeApiService();