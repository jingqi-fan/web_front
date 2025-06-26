export interface HouseOrder {
    id?: number;
    userId: number;
    houseId: number;
    deadline: string; // 租赁截止日期
    startDate: string; // 租赁开始时间
    status: number; // 状态：0.未支付、1.已支付
    price: number; // 总金额
    payDate?: string; // 支付时间
    promise: number; // 是否守约：0.守约 1.违约
}

export interface PlaceHouseOrderRequest {
    userId: number;
    houseId: number;
    startDate: string;
    deadline: string;
    price: number;
    status?: number;
    promise?: number;
}

export interface HouseOrderListParams {
    userId: number;
}

// 房屋订单状态枚举
export enum HouseOrderStatus {
    PENDING_PAYMENT = 0, // 未支付
    COMPLETED = 1        // 已支付
}

// 守约状态枚举
export enum PromiseStatus {
    KEPT = 0,      // 守约
    VIOLATED = 1   // 违约
}