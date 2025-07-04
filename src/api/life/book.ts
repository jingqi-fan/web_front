import axiosInstance from "../../plugins/axios.ts";
import {ElMessage} from "element-plus";

export interface BookQueryParams {
    pageNum?: number
    pageSize?: number
    categoryId?: number
    title?: string
}

export interface BookRes {
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

export interface GetBooksPageResult {
    total: number
    booksList: BookRes[]
    imageUrl: string
}

export const  getBooksPage=async (params: BookQueryParams)=> {
    const res=await axiosInstance.get<{ code: number; data: GetBooksPageResult }>('/book/list', {
        params
    })
    if(res.data.code!==200){
        ElMessage.error('添加书籍失败')
    }
    console.log(res.data)
    return res.data
}
export const addBook=async (data: BookRes)=> {
    const res=await axiosInstance.post<{ code: number; data: BookRes }>('/book/admin/books/save',data)
    if(res.data.code!==200){
        ElMessage.error('添加书籍失败')
    }
    return res.data
}
export const updateBook=async (data: BookRes)=> {
    const res=await axiosInstance.post<{ code: number; data: BookRes }>('/book/admin/books/update',data)
    if(res.data.code!==200){
        ElMessage.error('更新书籍失败')
    }
    return res.data
}
export const deleteBook=async (id:number)=>{
    const res=await axiosInstance.get(`/book/admin/books/deleted?bookId=${id}`)
    if(res.data.code!==200){
        ElMessage.error('删除书籍失败')
    }
}
export const getBookDetail=async (id:number)=>{
    const res=await axiosInstance.get<{ code: number; data: BookRes }>(`/book/books/detail/${id}`)
    if(res.data.code!==200){
        ElMessage.error('获取书籍详情失败')
    }
    return res.data
}