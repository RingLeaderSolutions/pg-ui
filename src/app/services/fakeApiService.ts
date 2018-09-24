import { AxiosResponse } from 'axios';

import { CompanyInfo } from '../model/CompanyInfo';
import { MeterPortfolio, Mpan, MeterConsumptionSummary } from '../model/Meter';
import {
    Account,
    AccountCompanyStatusFlags,
    DashboardPortfolioStatus,
    DashboardPortfolioSummary,
    DashboardPortfolioTimeline,
    Portfolio,
    PortfolioContact,
    PortfolioHistoryEntry,
    PortfolioRequirements,
    User,
    UtilityType,
    AccountDetail,
    SiteDetail,
    AccountDocument,
    InstanceDetail
} from '../model/Models';
import { PortfolioDetails } from '../model/PortfolioDetails';
import { BackingSheet, Tender, TenderContract, TenderSupplier, TenderIssuanceEmail, Tariff, TenderRequirements } from '../model/Tender';
import { IApiService } from './apiService';
import { AccountContact } from '../model/HierarchyObjects';
import { PortfolioCreationRequest } from '../model/Portfolio';

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
                        avatarUrl: "",
                        email: "daniel@danielmay.co.uk"                        
                    }
                },
                creditRating: "A+",
                approvalStatus: "Approved",
                salesLead: {
                    id: "1",
                    firstName: "Daniel",
                    lastName: "May",
                    status: "active",
                    avatarUrl: "",
                    email: "daniel@danielmay.co.uk"
                },
                supportExec: {
                    id: "1",
                    firstName: "Daniel",
                    lastName: "May",
                    status: "active",
                    avatarUrl: "",
                    email: "daniel@danielmay.co.uk"                    
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

    createAccount(account: Account){
        var response = {
            id: "4dbd3fb8-c598-4d33-a0f6-b12da7b8b0d0"
        };

        return OK(response);
    }

    createAccountFromCompany(company:CompanyInfo){
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

    createPortfolioFromCompany(accountId: string, company: CompanyInfo){
        var response = {
            id: "a1b01d44-5971-4be0-a197-0226c44372ea",
            title: company.companyName,
            status: "tender",
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

        var portfolioDetails: PortfolioDetails = {
            portfolio: {
                id: "4d584e81-91c2-47b4-85f9-411db125af51",
                title: "Portfolio for testing",
                status: "tender",
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
                entityId: "4d584e81-91c2-47b4-85f9-411db125af51",
                product: "Fixed",
                paymentTerms: 21,
                startDate: "2018-01-12T00:54:25",
                durationMonths: 18,
                tariffId: "day/night",
                gasRequired: true,
                electricityRequired: true,
                greenPercentage: 100.0
            },
            meterGroups: [{
                consumption: 1234.32,
                groupName: "GAS",
                meterCount: 4,
                supplyDataCount: 4,
                historicalCount: 0,
                forecastCount: 0
            }, {
                consumption: 1234.32,
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

    uploadLoa(portfolioId: string, file: Blob){
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
                            voltage: null,
                            cclEligible: true,
                            vatPercentage: 0.2,
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
                            utility: "GAS",
                            cclEligible: true,
                            vatPercentage: 0.2,
                            emergencyContactName: "Joe Bloggs",
                            emergencyContactAddress: "1 Hampton Court, Hampton, London, W1A X21",
                            emergencyContactTelephone: "01292 191191"
                        },
                        halfHourly: null
                    }
                ]
            }]
        };
        
        return OK(data);
    }
        
    uploadSupplyMeterData(accountId: string, file: Blob, utility: UtilityType){
        return OK();
    }

    uploadHistorical(portfolioId: string, files: Blob[]){
        return OK();
    }

    uploadSiteList(portfolioId: string, file: Blob){
        return OK();
    }

    updateMeter(portfolioId: string, meter: Mpan){
        return OK();
    }

    uploadGasBackingSheet(contractId: string, file: Blob){
        return OK();
    }

    uploadElectricityBackingSheet(contractId: string, file: Blob){
        return OK();
    }

    getPortfolioTenders(portfolioId: string){
        var data: Tender[] = [
            {
                tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50",
                tenderTitle: "Best tender",
                packStatusMessage: "Issued on 21/03/2018 with deadline of 31/03/2018",
                billingMethod: "Paper",
                portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51",
                created: "2017-12-19T00:12:07.167",
                deadline: null,
                deadlineNotes: null,
                commission: 1,
                status: "CREATED",
                offerTypes: [],
                issuances: [{
                    issuanceId: "4f2ca438-d5dd-4fe4-9932-f31c8812a5de",
                    tenderId: "9f8cac73-73f4-40b3-a811-c0afc02a9edd",
                    created: "2018-03-29T01:10:34.613",
                    expiry: "2018-03-31T01:07:49",
                    status: "created",
                    packs: [{
                        packId: "8d9af5b6-ba36-4ef0-8021-13ed7e4269f2",
                        tenderId: "9f8cac73-73f4-40b3-a811-c0afc02a9edd",
                        supplierId: "1",
                        created: "2018-03-28T22:46:28.153",
                        lastIssued: "2018-03-29T01:11:40.023",
                        zipFileName: "http://portfoliotest.blob.core.windows.net/tenderpacks/1/SupplyRequirements-9f8cac73.zip",
                        meterCount: 5,
                        quotes: [
                            {
                                appu: 0.1010201,
                                contractBlobId: "x",
                                expiry: "2017-12-19T00:12:07.167",
                                portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51",
                                quoteId: "1964f31c-29b1-4a29-8532-66e1aea9e231",
                                received: "2017-12-19T00:12:07.167",
                                sheetCount: 0,
                                contractLength: 24,
                                status: "x",
                                tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50",
                                termsheetBlobId: "5122951b",
                                utility: "GAS",
                                supplierId: "4",
                                totalIncCCL: 123456,
                                collateralList: [{
                                    collateralId: "c1297bdd-63f0-4a7a-8903-b329e9000b09",
                                    quoteId: "1964f31c-29b1-4a29-8532-66e1aea9e231",
                                    created: "2017-12-19T00:12:07.167",
                                    documentBlobId: "https://test.com/test.pdf"
                                }],
                                indicators: [
                                    {
                                        type: "UPLOAD",
                                        detail: "TBC"
                                    }
                                ],
                                bestCategories: [
                                    {
                                        title: "totalCCL",
                                        score: 4,
                                        value: ""
                                    }
                                ],
                                version: 1,
                            }
                        ],
                    }]
                }],
                assignedSuppliers: [
                    {
                        supplierId: "4",
                        name: "Eon",
                        acctMgrId: "004",
                        gasSupplier: true,
                        electricitySupplier: true,
                        paymentTerms: 28,
                        logoUri: "EonLogoMainLogo.svg",
                        serviceRatings: [
                            {
                                category: "Billing Accuracy",
                                score: "Good",
                                reason: "None"
                            },
                            {
                                category: "Service Desk",
                                score: "Good",
                                reason: "None"
                            }
                        ]
                    }
                ],
                unissuedPacks: [
                {
                    supplierId: "1",
                    packId: "65277870-8d40-440d-9941-a7c7c2773425",
                    tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50",
                    created: "2017-12-19T00:11:07.167",
                    lastIssued: null,
                    zipFileName: "http://fake.com/fake.zip",
                    meterCount: 25,
                    quotes: null
                },
                {
                    supplierId: "4",
                    packId: "12111eb9-98cc-4c17-8cd2-ea9c03013d70",
                    tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50",
                    created: "2017-12-19T00:12:07.167",
                    lastIssued: "2017-12-19T00:11:07.167",
                    zipFileName: "http://fake.com/fake.zip",
                    meterCount: 25,
                    quotes: null                    
                }],
                existingContract: {
                    contractId: "bc6f7888-d4cf-443b-aa28-e79c58ba14bb",
                    supplierId: "1",
                    accountId: "493e1708-2457-48ba-8925-09856d6e9732",
                    product: "fixed",
                    contractStart: "2017-09-11T16:55:01.223Z",
                    contractEnd: "2018-09-10T16:55:01.223Z",
                    reference: "havenGas16",
                    utility: "GAS",
                    incumbent: true,
                    uploaded: null,
                    status: null,
                    sheetCount: 1,
                    activeTenderCount: 0
                },
                requirements: {
                    greenPercentage: 0,
                    id: "68bc8e6b-2552-4dfd-8c65-235c20cf83ce",
                    paymentTerms: 21,
                    portfolioId: "4d584e81-91c2-47b4-85f9-411db125af51",
                    tariffId: "2",
                    tenderId: "5122951b-b942-4f25-8ee0-5f2e255a5f50"
                },
                summaries: [
                    {
                        accepted : null,
                        communicated : null,
                        created : "2017-12-19T00:12:07.167",
                        meterCount : 25,
                        packId : null,
                        summaryFileName : "http://portfoliogeneration.blob.core.windows.net/tendersummary/c2edf658-4f75-401a-b2d0-3b330ab4e833/recommendation6511578287409214190.xls",
                        summaryId : "1081e2f3-057e-4472-bbb5-37b01b0ca3e8",
                        supplierCount : 0,
                        supplierId : "4",
                        tenderId : "c2edf658-4f75-401a-b2d0-3b330ab4e833",
                        winningDuration: 6
                    }
                ],
                halfHourly: false,
                allInclusive: true,
                utility: "GAS",
                acuom: "BTU",
                annualConsumption: 1000,
                meterCount: 10
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
                logoUri: "https://portfoliogeneration.blob.core.windows.net/suppliers/haven.png",
                serviceRatings: [
                    {
                        category: "Billing Accuracy",
                        score: "Good",
                        reason: "None"
                    },
                    {
                        category: "Service Desk",
                        score: "Good",
                        reason: "None"
                    }
                ]
            },
            {
                supplierId: "4",
                name: "Eon",
                acctMgrId: "004",
                gasSupplier: true,
                electricitySupplier: true,
                paymentTerms: 28,
                logoUri: "https://portfoliogeneration.blob.core.windows.net/suppliers/EonLogoMainLogo.svg",
                serviceRatings: [
                    {
                        category: "Billing Accuracy",
                        score: "Bad",
                        reason: "None"
                    },
                    {
                        category: "Service Desk",
                        score: "Not so great",
                        reason: "None"
                    }
                ]
            }
        ];

        return OK(data);
    }

    addExistingContract(contract: TenderContract, portfolioId: string, tenderId: string) {
        return OK();
    }

    updateExistingContract(contract: TenderContract, portfolioId: string, tenderId: string) {
        return OK();
    }

    deleteTender(portfolioId: string, tenderId: string){
        return OK();
    }

    createTender(portfolioId: string, tender: Tender, utilityType: UtilityType, halfHourly?: boolean){
        return OK();
    }

    updateTenderSuppliers(tenderId: string, supplierIds: string[]){
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
                mpanCore: "1001110011121",
                availabilityChargeUOM: "POUNDS_PER_KVA_PER_MONTH",
                fixedChargeUOM: "POUNDS_PER_MONTH"
            }
        ];
    }

    generateTenderPack(tenderId: string, portfolioId: string){
        return OK();
    }

    issueTenderPack(tenderPackId: string, subject: string, body: string){
        return OK();
    }
    
    generateSummaryReport(tenderId: string, quoteId: string, marketCommentary: string, selectionCommentary: string){
        return OK();        
    }
  
    getActiveUsers(){
        var users: User[] = [
            {
                id: '1',
                firstName: 'Fake',
                lastName: 'McFakerson',
                status: 'active',
                avatarUrl: 'http://none.com/none.jpg',
                email: 'fake@fake.com'
            }
        ];

        return OK(users);
    }

    assignPortfolioUsers(portfolioId: string, users: User[]){
        return OK();        
    }

    issueSummaryReport(tenderId: string, reportId: string, emails: string[]){
        return OK();
    }
    
    fetchBackendVersion(){
        return OK({
            version: "FAKE"
        });
    }

    fetchTenderIssuanceEmail(tenderId: string){
        var email: TenderIssuanceEmail = {
            subject: "hello",
            body: "test"
        };
        
        return OK(email);
    }

    exportContractRates(tenderId: string, quoteId: string){
        var rateLink = "http://test.com/test.csv";

        return OK( { exportUri: rateLink });
    }

    exportMeterConsumption(portfolioId: string){
        var rateLink = "http://test.com/test.csv";

        return OK( { exportUri: rateLink });
    }

    excludeMeters(portfolioId: string, meters: string[]){
        return OK();
    }

    includeMeters(portfolioId: string, meters: string[]){
        return OK();
    }

    uploadOffer(tenderId: string, supplierId: string, file: Blob) {
        return OK();
    }

    reportSuccessfulLoaUpload(portfolioId: string, accountId: string, files: string[]) {
        return OK();
    }

    reportSuccessfulSupplyMeterDataUpload(accountId: string, files: string[], utility: UtilityType) {
        return OK();
    }

    reportSuccessfulSiteListUpload(portfolioId: string, accountId: string, files: string[]) {
        return OK();
    }

    reportSuccessfulHistoricalUpload(portfolioId: string, files: string[], historicalType: string) {
        return OK();
    }

    reportSuccessfulBackingSheetUpload(contractId: string, useGeneric: boolean, files: string[], utility: UtilityType) {
        return OK();
    }

    reportSuccessfulOfferUpload(tenderId: string, supplierId: string, useGeneric: boolean, files: string[], utility: UtilityType) {
        return OK();
    }

    deleteQuote(tenderId: string, quoteId: string){
        return OK();
    }

    getTariffs(){
        var tariffs: Tariff[] = [
            { id: "1",  name: "day/night"},
            { id: "2",  name: "summer/winter"}
        ];
        return OK(tariffs);
    }

    retrieveAccounts(){
     var accounts: Account[] = [
        {
            id: "1",
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
        }
     ];
     return OK(accounts);
    }

    retrieveAccountDetail(accountId: string) {
        var sites: SiteDetail[] = 
        [
            {
                tenancyStart: "2018-04-21T07:25:26.327Z",
                tenancyEnd: "2018-04-21T07:25:26.327Z",
                mpans: [
                    {
                    id: "string",
                    mpanCore: "string",
                    meterType: "string",
                    meterTimeSwitchCode: "string",
                    llf: "string",
                    profileClass: "string",
                    retrievalMethod: "string",
                    gspGroup: "string",
                    measurementClass: "string",
                    isEnergized: true,
                    moAgent: "string",
                    daAgent: "string",
                    dcAgent: "string",
                    voltage: "string",
                    serialNumber: "string",
                    postcode: "string",
                    isNewConnection: true,
                    connection: "string",
                    eac: 0,
                    rec: 0,
                    capacity: 0,
                    vatPercentage: 0,
                    tariffId: "string",
                    cclEligible: true
                    }
                ],
                mprns: [
                    {
                    id: "string",
                    mprnCore: "string",
                    serialNumber: "string",
                    isImperial: true,
                    make: "string",
                    model: "string",
                    aq: 0,
                    changeOfUse: true,
                    size: 0,
                    vatPercentage: 0,
                    cclEligible: true,
                    emergencyContactAddress: "string",
                    emergencyContactName: "string",
                    emergencyContactTelephone: "string",
                    tariffId: "string"
                    }
                ],
                id: "string",
                siteCode: "string",
                name: "string",
                contact: "string",
                address1: "string",
                address2: "string",
                town: "string",
                coT: "string",
                billingAddress: "string",
                postcode: "string"
            }
        ];
        
        var contacts: AccountContact[] = [{
            id: "2",
            accountId: "1",
            firstName: "Daniel",
            lastName: "May",
            email: "daniel@danielmay.co.uk",
            phoneNumber: "+1 409 217 2046",
            role: "Administrator"
        }]

        var accountDetail: AccountDetail = {
            id: "1",
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
            incorporationDate: "2004-10-19T00:00:00",
            isRegisteredCharity: false,
            isVATEligible: true,
            postcode: "AB12 CD2",
            sites,
            contacts
        };
        return OK(accountDetail);
    }

    fetchPortfolioUploads(portfolioId: string){
        return OK();
    }

    fetchUploadReport(reportId: string, isImport: boolean){
        return OK();
    }

    reportLogin(){
        return OK();
    }

    fetchMeterConsumption(portfolioId: string){
        var consumption: MeterConsumptionSummary = {
            summaryFields: [],
            summaryValues: [],
            electricityHeaders: [ "site", "mpan", "meterType", "total Units", "Day", "Night"],
            gasHeaders: [ "site", "mprn", "total Units", "All Times"],
            electrictyConsumptionEntries: [[ "MOONIE009", "1", "NHH", "100", "100", "100"]],
            gasConsumptionEntries: [[ "MOONIEG", "2", "100", "100"]],
        }
        return OK(consumption);
    }

    updateAccount(account: Account){
        return OK();
    }

    createContact(contact: AccountContact){
        return OK();
    }

    updateContact(contact: AccountContact){
        return OK();   
    }

    deleteContact(accountContactId: string){
        return OK();     
    }

    fetchAccountDocumentation(accountId: string){
        var documentation: AccountDocument[] = [{
            id: "d7b3ae3d-5b65-4e6b-87c1-d68e9b9d8be7",
            blobFileName: "loa_rls_20171121.pdf",
            accountId: "493e1708-2457-48ba-8925-09856d6e9732",
            documentType: "loa",
            received: "2017-11-21T05:49:53",
            expiry: "2018-11-20T05:49:53"
        }];

        return OK(documentation);
    }

    fetchAccountUploads(accountId: string){
        return OK();  
    }

    uploadAccountDocument(accountId: string, file: Blob){
        return OK();
    }

    reportSuccessfulAccountDocumentUpload(accountId: string, documentType: string, files: string[]){
        return OK();        
    }

    fetchUsers(){
        return OK(); 
    }
    
    createPortfolio(portfolio: PortfolioCreationRequest){
        var response = {
            id: "a1b01d44-5971-4be0-a197-0226c44372ea",
            title: "X",
            status: "tender",
            category: "direct",
            teamId: 989,
            ownerId: 1,
            supportOwner: 7,
            accountId: "1",
            //contact: null,
            contractStart: "2017-12-01T00:00:00",
            contractEnd: "2018-03-01T00:00:00"
        }
        return OK(response)
    }

    fetchAccountPortfolios(accountId: string){
        return OK();
    }

    editPortfolio(portfolio: PortfolioCreationRequest){       
        return OK();        
    }

    deletePortfolio(portfolioId: string){       
        return OK();
    }

    fetchInstanceDetails(){
        var data: InstanceDetail = {
            contactus: '01 111 111111',
            address: 'HQ',
            buildType: null,
            consul: 'host(localhost) port(8500) key(test) ',
            name: 'Ringleader Solutions',
            logoUri: 'https://portfoliotest.blob.core.windows.net/suppliers/tpi-flow-logo.png',
            summaryGasTemplate: 'TenderSummaryReportv7Gas_rls.xls',
            mongodb: 'mpan',
            email: 'testflow@ringleadersolutions.com',
            summaryElectricityTemplate: 'TenderSummaryReportv7_rls.xls'
          };

        return OK(data);
    }

    fetchTenderOffers(portfolioId: string){
        return OK();       
    }

    fetchTenderRecommendations(portfolioId: string){
        return OK(); 
    }

    fetchRecommendationSuppliers(tenderId: string, summaryId: string){
        return OK();             
    }

    fetchRecommendationSites(tenderId: string, summaryId: string, siteStart: number, siteEnd: number){
        return OK();
    }

    fetchRecommendationSummary(tenderId: string, summaryId: string){
        return OK();
    }

    deleteRecommendation(tenderId: string, recommendationId: string){
        return OK();
    }

    fetchAccountContracts(accountId: string){
        return OK();
    }

    createAccountContract(accountId: string, contract: TenderContract){
        return OK();
    }
    
    updateAccountContract(contract: TenderContract){
        return OK();
    }

    deleteAccountContract(contractId: string){
        return OK();
    }

    fetchAccountContractRates(contractId: string){
        return OK();
    }

    createContractRenewal(contractId: string){
        return OK();
    }
}

export default new FakeApiService();