// src/entity/Hotel.ts
export interface Hotel {
    id: number
    hotelName: string
    img: string      // 相对路径，如 hoteldata/{id}/0.jpg
    score: number
    nearby: string
    location: string
    price: number
  }