export interface Commodity {
    id: number;
    name: string;
    category: string;
    price: number;
    shop: string;
    inventory: number;
    img?: string;
    detailImgs?: string | any;
    description?: string;
    createTime?: string;
    updateTime?: string;
}

export interface CommoditySearchParams {
    name?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    pageNum?: number;
    pageSize?: number;
}

export interface CommodityListResponse {
    records: Commodity[];
    total: number;
    size: number;
    current: number;
    pages: number;
}