export interface UserJoinActivityDTO {
    id: number
    itemId: number
    title: string
    joinTime: string
    status: string
}
export interface ActivityItemWithCategoryDTO {
    itemId: number
    content: string
    startDate: string
    endDate: string
    publishDate: string
    qrCode: string
    number: number
    activityTitle:string
}
export interface ActivitiesDTO {
    id: number
    logo: string
    title: string
    introduce: string
    content: string
    sponsor: string
    address: string
}