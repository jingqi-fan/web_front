// 图书借阅记录类型
export interface BorrowingRecord {
    id: number;
    bookName: string;
    author: string;
    publisher: string;
    publicationYear: number;
    categoryId: number;
    bookIntroduction: string;
    image: string;
    stock: number;
    borrowedNumber: number;
    price: number;
    overdueFee: number;
    createdAt: string;
    updatedAt: string;
}