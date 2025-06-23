export interface House {
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
    facilities?: string;
    description?: string;
    contactPhone?: string;
    contactPerson?: string;
    img?: string;
    createTime?: string;
    updateTime?: string;
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