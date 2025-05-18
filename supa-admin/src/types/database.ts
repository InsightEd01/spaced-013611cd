
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string;
          name: string;
          region: string;
          latitude: number;
          longitude: number;
          subscription_plan: string;
          status: 'active' | 'inactive' | 'suspended';
          created_at: string;
          updated_at: string;
          supa_admin_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          region: string;
          latitude?: number;
          longitude?: number;
          subscription_plan: string;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
          supa_admin_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          region?: string;
          latitude?: number;
          longitude?: number;
          subscription_plan?: string;
          status?: 'active' | 'inactive' | 'suspended';
          created_at?: string;
          updated_at?: string;
          supa_admin_id?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          school_id: string;
          plan: string;
          status: 'active' | 'trial' | 'expired';
          start_date: string;
          end_date: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          school_id: string;
          plan: string;
          status?: 'active' | 'trial' | 'expired';
          start_date: string;
          end_date: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          school_id?: string;
          plan?: string;
          status?: 'active' | 'trial' | 'expired';
          start_date?: string;
          end_date?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          action: string;
          supa_admin_id: string;
          target_school_id: string | null;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          supa_admin_id: string;
          target_school_id?: string | null;
          details: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          supa_admin_id?: string;
          target_school_id?: string | null;
          details?: Json;
          created_at?: string;
        };
      };
      teachers: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          school_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          school_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          school_id?: string;
          created_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          class_name: string;
          school_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          class_name: string;
          school_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          class_name?: string;
          school_id?: string;
          created_at?: string;
        };
      };
      class_teachers: {
        Row: {
          class_id: string;
          teacher_id: string;
          created_at: string;
        };
        Insert: {
          class_id: string;
          teacher_id: string;
          created_at?: string;
        };
        Update: {
          class_id?: string;
          teacher_id?: string;
          created_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          student_number: string;
          first_name: string;
          last_name: string;
          class_id: string | null;
          school_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_number: string;
          first_name: string;
          last_name: string;
          class_id?: string | null;
          school_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          student_number?: string;
          first_name?: string;
          last_name?: string;
          class_id?: string | null;
          school_id?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
