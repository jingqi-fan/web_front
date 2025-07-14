import axiosInstance from "../../plugins/axios.ts";

/** 图书信息类型 */
export interface Book {
    id: number
    bookName: string
    author: string
    publisher: string
    publicationYear: number
    categoryId: number
    bookIntroduction: string
    image: string
    stock: number
    borrowedNumber: number
    price: number
    overdueFee: number
    createdAt: string
    updatedAt: string
}

/** 分页查询返回结构 */
export interface BooksPageListRes {
    total: number
    booksList: Book[]
}

/** 借阅清单返回结构 */
export interface BooksListingRes {
    totalCount: number
    booksList: Book[]
    totalPrice: string
}

/** 预下单信息结构 */
export interface BookPreOrderInfoRes {
    booksList: Book[]
    totalPrice: string
    discountPrice: string
    shouldPayPrice: string
    bookReturnFeesId: number
}



// 获取推荐图书
export const getRecommendBooks = async () => {
    const res = await axiosInstance.get<{ code: number; data: Book[] }>('/book/recommend')
    return res.data.data
}

// 获取分页图书列表
export const getBooksPage = async (
    pageNum = 1,
    pageSize = 10,
    categoryId = 0,
    title = ''
) => {
    const res = await axiosInstance.get<{ code: number; data: BooksPageListRes }>('/book/list', {
        params: { pageNum, pageSize, categoryId, title }
    })
    return res.data.data
}

// 获取图书详情
export const getBookDetail = async (bookId: number) => {
    const res = await axiosInstance.get<{ code: number; data: Book }>(`/book/books/detail/${bookId}`)
    return res.data.data
}

// 获取借阅清单
export const getBookListing = async (userId: number) => {
    const res = await axiosInstance.get<{ code: number; data: BooksListingRes }>(
        '/book/listing',
        { params: { id: userId } }
    )
    console.log(res)
    return res.data.data
}

// 添加到借阅清单
export const addToBookListing = async (bookId: number, userId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        `/book/listing/add/${bookId}`,
        { params: { id: userId } }
    )
    return res.data
}

// 删除借阅清单中的图书
export const deleteFromBookListing = async (bookId: number, userId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        `/book/listing/deleted/${bookId}`,
        { params: { id: userId } }
    )
    return res.data.data
}

// 预下单
export const preOrderBooks = async (userId: number) => {
    const res = await axiosInstance.get<{ code: number; data: BookPreOrderInfoRes }>(
        '/book/pre/order',
        { params: { id: userId } }
    )
    return res.data.data
}

// 支付下单
export const payOrder = async (bookReturnFeeId: number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        `/book/pay/order/${bookReturnFeeId}`
    )
    return res.data.data
}

// 查询借阅记录
export const getBorrowRecords = async (userId: number) => {
    const res = await axiosInstance.get(
        '/book/record',
        { params: { id: userId } }
    )

    return res.data.data
}

// 归还书籍
export const returnBook = async (bookId: number,borrowingsId:number) => {
    const res = await axiosInstance.get<{ code: number; data: string }>(
        '/book/return',
        { params: { bookId,borrowingsId } }
    )
    return res.data.data
}
