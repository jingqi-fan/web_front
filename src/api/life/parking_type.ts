// src/types/park.ts

export interface ParkingLotsSimpleInfoRes {
    id: number
    title: string
    location: string
    leftCount: number
}

export interface ParkingLotsInfoRes {
    id: number
    title: string
    location: string
    leftCount: number
    totalCount: number
    price: number
    tag: string
    image: string
}

export interface ParkingLotsTypeRes {
    totalCount: number
    lotsInfoResList: ParkingLotsInfoRes[]
}

export interface ParkingSpaces {
    spaceId: number
    parkingLotId: number
    spaceNumber: string
    spaceType: number
    spaceStatus: number
    createdAt: string
    updatedAt: string
}

export interface ParkingLots {
    id: number
    parkingLotName: string
    parkingLotLocation: string
    parkingLotType: number
    totalSpaces: number
    image: string
    leftCount: number
    price: number
    deleted: number
    createdAt: string
    updatedAt: string
}

export interface ParkingPreOrderInfoReq {
    lotId: number
    spaceNum: string
    startTime: number
    endTime: number
}

export interface ParkingPreOrderInfoRes {
    ParkingLotName: string
    spaceNum: string
    appointTimeStr: string
    currentCreditScore: number
    needCreditScore: number
    spendTimeCount: number
    price: number
    totalPrice: number
    appointmentId: number
}

export interface AppointmentListRes {
    title: string
    appointTimeStr: string
    spaceNum: string
    tag: string
    appointmentId: number
}

export interface ParkingFeeRes {
    parkingTime: string
    startTime: string
    price: number
}

export interface ParkingNeedPayFeeRes {
    parkingFeeId: number
    totalFee: string
    parkingTimeStr: string
    appointNum: string
    createTimeStr: string
}
