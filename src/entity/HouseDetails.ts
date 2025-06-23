export interface HouseDetails {
    id: number;
    houseId: number;
    detailDescription?: string;
    imgsPath?: string;
    imgsPathAsJson?: string | any;
    facilities?: string;
    transportation?: string;
    surrounding?: string;
    rentRules?: string;
    contactInfo?: string;
    viewCount?: number;
    createTime?: string;
    updateTime?: string;
}

export interface HouseDetailsResponse {
    houseDetails: HouseDetails;
    house: {
        id: number;
        title: string;
        district: string;
        rentalType: string;
        price: number;
        area?: number;
        bedrooms?: number;
        bathrooms?: number;
        floor?: string;
        orientation?: string;
        decoration?: string;
        contactPhone?: string;
        contactPerson?: string;
        img?: string;
    };
}