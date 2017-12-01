export interface MeterPortfolio {
    portfolioId: string;
    meters: Meter[];
}

export interface Meter {
    meterSupplyData: MeterSupplyData;
    halfhourly: void;
}

export interface MeterSupplyData {
    id: string;
    mpanCore: string;
    utility: string;
    meterType: string;
    newConnection: boolean;
    MTC: number;
    LLF: number;
    profileClass: number;
    retrievalMethod: string;
    GSPGroup: string;
    measurementClass: string;
    energised: boolean;
    da: string;
    dc: string;
    mo: string;
    voltage: string;
    connection: string;
    serialNumber: string;
    capacity: number;
    EAC: string;
}