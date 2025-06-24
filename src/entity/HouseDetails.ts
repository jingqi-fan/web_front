export interface HouseDetails {
    id: number;
    houseId: number;
    houseType: string;
    area: number;
    orientation: string;
    floor: number;
    decorates: string;
    neighborhood: string;
    facilities: string;
    imgsPath?: string;
    imgsPathAsJson?: string | any;
    updateTime: string;
}

export interface HouseDetailsResponse {
    houseDetails: HouseDetails;
    house: {
        id: number;
        title: string;
        district: string;
        rentalType: string;
        price: number;
        address: string;
        img: string;
        createTime?: string;
        updateTime?: string;
    };
}

// 类型别名，与后端HouseDetailsWithHouseDTO保持一致
export type HouseDetailsWithHouseDTO = HouseDetailsResponse;
