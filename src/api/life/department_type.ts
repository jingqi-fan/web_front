export interface Departments {
    id?: number;
    departmentName: string;
    departmentType: number;
    departmentIntroduction?: string;
    deleted?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface AddDepartmentReq {
    departmentName: string;
    departmentType: number;
    departmentIntroduction?: string;
}

export interface DepartmentPageRes {
    totalCount: number;
    departmentsList: Department[];
}