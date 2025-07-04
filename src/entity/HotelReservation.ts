// 严格对应后端 hotel_reservation 表结构
export interface HotelReservation {
    orderId?: number;        // 后端自增
    userId: number;          // 用户 ID
    hotelId: number;         // 酒店 ID
    typeId: number;          // 房型 ID
    price: number;           // 折后总价
    bookDate?: string;       // 后端填充，ISO 或 "YYYY-MM-DD HH:mm:ss"
    checkinDate: string;     // 入住日期 "YYYY-MM-DD HH:mm:ss"
    checkoutDate: string;    // 离店日期 "YYYY-MM-DD HH:mm:ss"
    uuid: string;       // uuid
    isPay: number;           // 0 未支付
    promise: number;         // 0 尚未还款但未到期限
    payDate?:string;          //支付日期，可为空
  }