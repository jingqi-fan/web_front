export interface House {
    id: number;
    title: string;
    img: string;
    price: number;
    address: string;
    rentalType: string;
    district: string;
}

export interface HouseSearchParams {
    title?: string;
    district?: string;
    rentalType?: string;
    minPrice?: number;
    maxPrice?: number;
    pageNum?: number;
    pageSize?: number;
}

export interface HouseListResponse {
    records: House[];
    total: number;
    size: number;
    current: number;
    pages: number;
}