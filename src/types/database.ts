
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          region: string
          subscription_plan: 'basic' | 'premium'
          created_at: string
          supa_admin_id: string
        }
        Insert: {
          id?: string
          name: string
          region: string
          subscription_plan?: 'basic' | 'premium'
          created_at?: string
          supa_admin_id: string
        }
        Update: {
          id?: string
          name?: string
          region?: string
          subscription_plan?: 'basic' | 'premium'
          created_at?: string
          supa_admin_id?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          school_id: string
          plan: string
          status: 'active' | 'expired' | 'suspended'
          renewal_date: string
          created_at: string
        }
        Insert: {
          id?: string
          school_id: string
          plan: string
          status?: 'active' | 'expired' | 'suspended'
          renewal_date: string
          created_at?: string
        }
        Update: {
          id?: string
          school_id?: string
          plan?: string
          status?: 'active' | 'expired' | 'suspended'
          renewal_date?: string
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          action: string
          supa_admin_id: string
          target_school_id: string
          timestamp: string
          details: Json | null
        }
        Insert: {
          id?: string
          action: string
          supa_admin_id: string
          target_school_id: string
          timestamp?: string
          details?: Json | null
        }
        Update: {
          id?: string
          action?: string
          supa_admin_id?: string
          target_school_id?: string
          timestamp?: string
          details?: Json | null
        }
      }
      teachers: {
        Row: {
          id: string
          user_id: string
          name: string
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          school_id?: string
          created_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          class_name: string
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          class_name: string
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          class_name?: string
          school_id?: string
          created_at?: string
        }
      }
      class_teachers: {
        Row: {
          class_id: string
          teacher_id: string
          created_at: string
        }
        Insert: {
          class_id: string
          teacher_id: string
          created_at?: string
        }
        Update: {
          class_id?: string
          teacher_id?: string
          created_at?: string
        }
      }
      students: {
        Row: {
          id: string
          student_number: string
          first_name: string
          last_name: string
          class_id: string | null
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          student_number: string
          first_name: string
          last_name: string
          class_id?: string | null
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          student_number?: string
          first_name?: string
          last_name?: string
          class_id?: string | null
          school_id?: string
          created_at?: string
        }
      }
      subjects: {
        Row: {
          id: string
          subject_name: string
          school_id: string
          created_at: string
        }
        Insert: {
          id?: string
          subject_name: string
          school_id: string
          created_at?: string
        }
        Update: {
          id?: string
          subject_name?: string
          school_id?: string
          created_at?: string
        }
      }
      student_subjects: {
        Row: {
          student_id: string
          subject_id: string
          created_at: string
        }
        Insert: {
          student_id: string
          subject_id: string
          created_at?: string
        }
        Update: {
          student_id?: string
          subject_id?: string
          created_at?: string
        }
      }
      assessments: {
        Row: {
          id: string
          subject_id: string
          assessment_type: 'test' | 'exam'
          assessment_name: string
          date: string
          max_score: number
          created_at: string
        }
        Insert: {
          id?: string
          subject_id: string
          assessment_type: 'test' | 'exam'
          assessment_name: string
          date: string
          max_score: number
          created_at?: string
        }
        Update: {
          id?: string
          subject_id?: string
          assessment_type?: 'test' | 'exam'
          assessment_name?: string
          date?: string
          max_score?: number
          created_at?: string
        }
      }
      assessment_scores: {
        Row: {
          assessment_id: string
          student_id: string
          score: number
          created_at: string
        }
        Insert: {
          assessment_id: string
          student_id: string
          score: number
          created_at?: string
        }
        Update: {
          assessment_id?: string
          student_id?: string
          score?: number
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          teacher_id: string
          class_id: string
          title: string
          content: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          teacher_id: string
          class_id: string
          title: string
          content: string
          date: string
          created_at?: string
        }
        Update: {
          id?: string
          teacher_id?: string
          class_id?: string
          title?: string
          content?: string
          date?: string
          created_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          class_id: string
          date: string
          status: 'present' | 'absent' | 'late'
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          class_id: string
          date: string
          status: 'present' | 'absent' | 'late'
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          class_id?: string
          date?: string
          status?: 'present' | 'absent' | 'late'
          created_at?: string
        }
      }
      feedback: {
        Row: {
          id: string
          student_id: string
          type: 'complaint' | 'suggestion'
          content: string
          date: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          type: 'complaint' | 'suggestion'
          content: string
          date?: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          type?: 'complaint' | 'suggestion'
          content?: string
          date?: string
          created_at?: string
        }
      }
    }
  }
}
