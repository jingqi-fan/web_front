import axiosInstance from "../plugins/axios.ts";
import type {News, NewsDTO} from "../entity/news.ts";

/** 获取新闻列表 */
export const getNewsList = async ()=> {
    const res = await axiosInstance.get('/news/list')
    return res.data
}

/** 添加新闻 */
export const addNews = async (data: NewsDTO) => {
    const res = await axiosInstance.post('/news/add', data)
    return res.data
}

/** 删除新闻 */
export const deleteNewsById = async (id: number) => {
    const res = await axiosInstance.get('/news/delete', {
        params: { id }
    })
    return res.data
}

/** 更新新闻 */
export const updateNews = async (data: News) => {
    const res = await axiosInstance.post('/news/update', data, {
        headers: { 'Content-Type': 'application/json' }
    })
    return res.data
}
