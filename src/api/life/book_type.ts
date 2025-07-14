export interface BorrowingRecord {
    id: number
    userId: number
    borrowDate: string // ISO 时间字符串
    dueDate: string
    returnDate: string | null
    createdAt: string
    updatedAt: string
    borrowingStatus: number
}
export interface SubBorrowing {
    id: number
    borrowingId: number
    bookId: number
    borrowingStatus: number // 0 借阅中，1 已归还等
    createdAt: string
    updatedAt: string
    bookInfo: BookInfo
}

export interface BookInfo {
    id: number
    bookName: string
    author: string
    bookIntroduction: string
    borrowedNumber: number
    categoryId: number
    price: number
    overdueFee: number
    publicationYear: number
    publisher: string
    stock: number
    image: string
    createdAt: string
    updatedAt: string
}
export interface BorrowingResponse {
    bookBorrowings: BorrowingRecord[]
    bookSubBorrowings: SubBorrowing[]
}
