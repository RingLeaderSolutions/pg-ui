import { MeasurementClasses } from "./Meter";

export interface Account {
    id: string;
    accountNumber: string;
    companyName: string;
    companyRegistrationNumber: string;
    address: string;
    postcode: string,
    countryOfOrigin: string,
    incorporationDate: string,
    contact: string,
    companyStatus: string,
    creditRating: string,
    isRegisteredCharity: boolean,
    hasCCLException: boolean
    isVATEligible: boolean,
    hasFiTException: boolean
}

export interface AccountContact {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
}

export interface HierarchySite {
    id: string,
    siteCode: string,
    name: string,
    contact: string,
    address1: string,
    address2: string,
    town: string,
    coT: string,
    billingAddress: string,
    postcode: string
}

export interface AccountDetail extends Account {
    sites: SiteDetail[];
    contacts: AccountContact[];
}

export interface SiteDetail extends HierarchySite {
    tenancyStart: string,
    tenancyEnd: string,
    mpans: HierarchyMpan[],
    mprns: HierarchyMprn[]
}

export interface AccountCompanyStatusFlags {
    isRegisteredCharity: boolean,
    hasCCLException: boolean
    isVATEligible: boolean,
    hasFiTException: boolean
}

export interface HierarchyMpan {
    id: string,
    mpanCore: string,
    meterType: string,
    meterTimeSwitchCode: string,
    llf: string,
    profileClass: string
    retrievalMethod: string,
    gspGroup: string,
    measurementClass: string,
    isEnergized: boolean,
    moAgent: string,
    daAgent: string,
    dcAgent: string,
    voltage: string,
    serialNumber: string,
    postcode: string,
    isNewConnection: boolean,
    connection: string,
    eac: number,
    rec: number,
    capacity: number,
    vatPercentage: number,
    tariffId: string,
    cclEligible: boolean
}

export interface HierarchyMprn {
    id: string,
    mprnCore: string,
    serialNumber: string,
    isImperial: boolean,
    make: string,
    model: string,
    aq: number,
    changeOfUse: boolean,
    size: number,
    vatPercentage: number,
    cclEligible: boolean,
    emergencyContactAddress: string,
    emergencyContactName: string,
    emergencyContactTelephone: string,
    tariffId: string
}