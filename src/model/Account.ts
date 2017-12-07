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

export interface AccountCompanyStatusFlags {
    isRegisteredCharity: boolean,
    hasCCLException: boolean
    isVATEligible: boolean,
    hasFiTException: boolean
}