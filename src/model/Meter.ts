import { Decipher } from "crypto";

export interface MeterPortfolio {
    portfolioId: string;
    sites: MeterSite[];
}

export interface MeterSite {
    siteCode: string;
    mpans: Mpan[];
    mprns: Mprn[];
}

export interface Mpan {
    meterSupplyData: MpanSupplyData;
    halfHourly: HalfHourlyData;
}

export interface Mprn {
    meterSupplyData: MprnSupplyData;
    halfHourly: HalfHourlyData;
}

export interface HalfHourlyData {
    forecast: DocumentData;
    historical: DocumentData;
}

export interface DocumentData {
    created: string;
    docId: string;
}

export interface MprnSupplyData {
    aQ: number;
    address: string;
    changeOfUse: boolean;
    currentContractEnd: string;
    id: string;
    imperial: boolean;
    make: string;
    model: string;
    mprnCore: string;
    postcode: string;
    serialNumber: string;
    siteCode: string;
    size: number;
    utility: string;
}

export interface MpanSupplyData {
    address: string;
    currentContractEnd: string;
    id: string;
    mpanCore: string;    
    meterType: string;
    meterTimeSwitchCode: string;
    llf: string;
    profileClass: string;
    retrievalMethod: string;
    gspGroup: string;
    measurementClass: string;
    serialNumber: string;
    daAgent: string;
    dcAgent: string;
    moAgent: string;
    voltage: string;
    connection: string;
    postcode: string;
    rec: number;
    eac: number;
    capacity: number;
    utility: string;
    energized: boolean;
    newConnection: boolean;
    periodConsumption: string;
    siteCode: string;
    totalConsumption: number;
}

export enum MeterType{
    Gas,
    Electricity
}

export const AggregatorCollectors = [
    'ETCL',
    'GUCL',
    'HYDE',
    'IPNL',
    'LENG',
    'LOND',
    'MANW',
    'MIDE',
    'NEEB',
    'NORW',
    'SEEB',
    'SOUT',
    'SPOW',
    'SWAE',
    'SWEB',
    'UKDC',
    'YELG',
    'DASL',
    'SSIL',
    'UDMS'
];


export const MeterOperators = [
    'Siemens (EELC)',
    'Metering Services (MIDE)',
    'Metering Services (EMEB)',
    'ETCL',
    'GUCL',
    'Scottish & Southern (HYDE)',
    'Scottish & Southern (SOUT)',
    'IPNL',
    'LENG',
    'ECS (LOND)',
    'MANW',
    'NEEB',
    'United Utilities (NORW)',
    'SEEB',
    'SWAE - DO NOT USE',
    'Western Power (SWEB)',
    'MSERV (UKDC)',
    'YELG - DO NOT USE',
    'SP Dataserve (SPOW)',
    'Npower (NATP)',
    'Central Networks East Plc UMSO',
    'Central Networks West Plc UMSO',
    'EDF Energy IDNO Ltd UMSO',
    'EDF Energy Networks EPN Plc UMSO',
    'EDF Energy Networks LPN Plc UMSO',
    'EDF Energy Networks SPN Plc UMSO',
    'Electricity Network Company Ltd UMSO',
    'Electricity North West Ltd UMSO',
    'Energetics Electricity UMSO',
    'ESP Electricity Limited UMSO',
    'Independent Power Networks Ltd UMSO',
    'Northern Elec Distribution Ltd UMSO',
    'Scottish Hydro-Electric Dist UMSO',
    'Southern Electric Power Dist UMSO',
    'SP Distribution Ltd UMSO',
    'SP Manweb Plc UMSO',
    'Western Power Dis - S West UMSO',
    'Western Power Dis - S Wales UMSO',
    'Yorkshire Electricity Dist PLC UMSO'
];


export const MeterTimeSwitchCodes = [
    '000-399 Specific to Distribution Networks',
    '400-499 Not in use',
    '500-509 Common codes for Related Metering',
    '510 -799 Specific to Distribution Networks for Related Metering',
    '800 -999 Common Codes'
];


export const RetrievalMethods = ['Remote', 'Visual', 'Manual', 'Unknown', 'Unmetered'];


export const GspGroups = ['_A', '_B', '_C', '_D', '_E', '_F', '_G', '_H', '_I', '_J', '_K', '_L', '_M', '_N', '_P'];


export const MeasurementClasses = [ 'A','B','C','D','E']