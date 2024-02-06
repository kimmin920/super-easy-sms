import { Database } from './supabase';
import type { User } from '@supabase/gotrue-js/src/lib/types';

export type CourseType = Database['public']['Tables']['classes']['Row'];

export type StudentType = Database['public']['Tables']['students']['Row'];

export type SMSTemplateType =
  Database['public']['Tables']['sms_templates']['Row'];

export type StudentClassMapBaseType =
  Database['public']['Tables']['students_classes_map']['Row'];

export interface StudentClassMapType {
  studentId: StudentClassMapBaseType['student_id'];
  courseId: StudentClassMapBaseType['class_id'];
}

export interface StudentWithCourse extends StudentType {
  courses: CourseType[];
  courseIds?: number[];
}

export type BusinessType = Database['public']['Tables']['businesses']['Row'];

export interface SupabaseUserType extends User {
  user_metadata: {
    avatar_url: string;
    email: string;
    email_verified: boolean;
    full_name: string;
    iss: string;
    name: string;
    phone_verified: boolean;
    picture: string;
    provider_id: string;
    sub: string;
  };
}

export type BusinessFormType = Pick<BusinessType, 'name' | 'plan'>;
