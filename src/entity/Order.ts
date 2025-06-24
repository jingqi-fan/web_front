// 订单实体类型定义
export interface CommodityOrder {
  id?: number;
  userId: number;
  commodityId: number;
  method: string; // 支付方式：'0'-立即支付，'1'-货到付款
  amount: number; // 商品数量
  price: number; // 总金额
  address: string; // 收货地址
  orderTime?: string; // 下单时间
  payTime?: string; // 支付时间
  finished: number; // 订单状态：1-货到付款待支付，2-已完成
  freightAmount: number; // 运费
  discountAmount: number; // 折扣金额
  actualAmount: number; // 实际付费
}

// 订单初始化响应
export interface OrderInitResponse {
  userId: number;
  commodityId: number;
  discount: number;
}

// 下单请求参数
export interface PlaceOrderRequest {
  userId: number;
  commodityId: number;
  method: string;
  amount: number;
  address: string;
  price?: number; // 商品总价
  freightAmount?: number; // 运费
  discountAmount?: number; // 折扣金额
  actualAmount?: number; // 实际付费
}

// 订单列表查询参数
export interface OrderListParams {
  userId: number;
  page?: number;
  size?: number;
}


// 订单状态枚举
export enum OrderStatus {
  PENDING_PAYMENT = 1, // 待支付
  COMPLETED = 2 // 已完成
}

// 支付方式枚举
export enum PaymentMethod {
  IMMEDIATE = '0', // 立即支付
  CASH_ON_DELIVERY = '1' // 货到付款
}