export interface Doctor {
    id?: number;
    doctorName: string;
    doctorTitle: number;
    doctorSpecialty?: string;
    departmentId: number;
    image?: string;
    phone?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface DoctorExtend extends Doctor {
    departmentName: string;
}

export interface DoctorListRes {
    totalCount: number;
    doctorsList: DoctorExtend[];
}