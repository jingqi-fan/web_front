export interface News {
    id: number
    title: string
    description: string
    date: string
    author: string
    image: string
    category: string
    tags: string
    views: number
}

export interface NewsDTO extends Omit<News, 'id'> {}

export interface Result<T = any> {
    code: number
    msg: string
    data: T
}
