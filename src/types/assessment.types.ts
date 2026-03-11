import { UserLite, UUID } from "./common";

export interface AssessmentCategory {
    uuid: UUID;
    name: string;
    description: string;
    is_active: boolean;
    creator: UserLite;
}

export interface AssessmentCategoryInput {
    uuid?: UUID;
    name: string;
    description: string;
    is_active: boolean;
}

export interface CreateAssessmentInput {
    uuid? :UUID;
    evaluatee_nik?: string;
    period?: string;
    note?: string | null;
    assessment_uuid?: UUID;
    category_uuid?: UUID;
    score?: number;
    bonus_salary?: number | null;
}

export interface AssessmentInput {
    uuid? :UUID;
    evaluatee_nik?: string;
    period?: string;
    note?: string | null;
    assessment_uuid?: UUID;
    category_uuid?: UUID;
    score?: number;
    bonus_salary?: number | null;
}

export interface UpdateAssessmentInput {
    uuid?: UUID;
    evaluatee_nik?: string;
    period?: string;
    note?: string | null;
    assessment_details: AssessmentScoreDetail[];
}

export interface Assessment {
    uuid: UUID;
    evaluatee_name: string;
    evaluatee_nik: string;
    evaluator_name: string;
    categories: string;
    period: string;
    note: string;
    created_at: string;
    category_uuid?: UUID;
    score?: number;
    bonus_salary?: number;
    assessment_details: AssessmentScoreDetail[];
}

export interface AssessmentScoreDetail {
    category_uuid?: UUID;
    category_name?: string;
    score: number;
    bonus_salary: number | string;
}

export interface AssessmentDetail {
    uuid: UUID;
    period: string;
    note: string | null;
    evaluatee: {
        name: string;
        nik: string;
        photo: string | null;
    };
    evaluator: {
        name: string;
        nik: string;
        photo: string | null;
    };
    scores: AssessmentScoreDetail[];
    created_at: string;
}

export interface EmployeeAssessmentTracking {
    nik: string;
    name: string;
    photo?: string | null;
    is_assessed: boolean;
    assessment_data: Assessment | null; 
}