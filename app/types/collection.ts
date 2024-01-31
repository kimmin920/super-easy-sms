import { Database } from './supabase';

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
  courses: CourseType;
}
