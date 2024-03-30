
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      businesses: {
        Row: {
          created_at: string
          id: number
          name: string
          plan: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string
          plan?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          plan?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "businesses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          billingFrequency: Database["public"]["Enums"]["billing_frequency"]
          business_id: number
          classCount: number
          coverImgSrc: string
          created_at: string
          description: string
          id: number
          name: string | null
          note1: string
          note2: string
          price: number
          priceDescription: string
          scheduledDays: string[]
          teacher: string
        }
        Insert: {
          billingFrequency?: Database["public"]["Enums"]["billing_frequency"]
          business_id: number
          classCount?: number
          coverImgSrc?: string
          created_at?: string
          description?: string
          id?: number
          name?: string | null
          note1?: string
          note2?: string
          price?: number
          priceDescription?: string
          scheduledDays?: string[]
          teacher?: string
        }
        Update: {
          billingFrequency?: Database["public"]["Enums"]["billing_frequency"]
          business_id?: number
          classCount?: number
          coverImgSrc?: string
          created_at?: string
          description?: string
          id?: number
          name?: string | null
          note1?: string
          note2?: string
          price?: number
          priceDescription?: string
          scheduledDays?: string[]
          teacher?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      sms_templates: {
        Row: {
          business_id: number | null
          created_at: string
          id: number
          template: Json | null
          title: string | null
        }
        Insert: {
          business_id?: number | null
          created_at?: string
          id?: number
          template?: Json | null
          title?: string | null
        }
        Update: {
          business_id?: number | null
          created_at?: string
          id?: number
          template?: Json | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sms_templates_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          active: boolean
          birthday: string | null
          business_id: number | null
          created_at: string
          email: string
          id: number
          name: string
          note1: string
          note2: string
          parent_phone_number: string | null
          phone_number: string
          preferred_notification_type:
            | Database["public"]["Enums"]["preferred_notification_type"]
            | null
          school: string
        }
        Insert: {
          active?: boolean
          birthday?: string | null
          business_id?: number | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          note1?: string
          note2?: string
          parent_phone_number?: string | null
          phone_number?: string
          preferred_notification_type?:
            | Database["public"]["Enums"]["preferred_notification_type"]
            | null
          school?: string
        }
        Update: {
          active?: boolean
          birthday?: string | null
          business_id?: number | null
          created_at?: string
          email?: string
          id?: number
          name?: string
          note1?: string
          note2?: string
          parent_phone_number?: string | null
          phone_number?: string
          preferred_notification_type?:
            | Database["public"]["Enums"]["preferred_notification_type"]
            | null
          school?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      students_classes_map: {
        Row: {
          class_id: number
          created_at: string
          id: number
          student_id: number
        }
        Insert: {
          class_id: number
          created_at?: string
          id?: number
          student_id: number
        }
        Update: {
          class_id?: number
          created_at?: string
          id?: number
          student_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_classes_map_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_classes_map_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_student_and_courses_int8: {
        Args: {
          business_id_param: number
          name_param: string
          email_param: string
          phonenumber_param: string
          school_param: string
          note1_param: string
          note2_param: string
          course_ids_param: number[]
        }
        Returns: number
      }
      edit_student_and_courses:
        | {
            Args: {
              student_id_param: number
              business_id_param: number
              name_param: string
              email_param: string
              phonenumber_param: string
              school_param: string
              note1_param: string
              note2_param: string
              new_course_ids_param: number[]
            }
            Returns: undefined
          }
        | {
            Args: {
              student_id_param: string
              business_id_param: string
              name_param: string
              email_param: string
              phonenumber_param: string
              school_param: string
              note1_param: string
              note2_param: string
              new_course_ids_param: string[]
            }
            Returns: undefined
          }
      edit_student_and_courses_int8: {
        Args: {
          student_id_param: number
          business_id_param: number
          name_param: string
          email_param: string
          phonenumber_param: string
          school_param: string
          note1_param: string
          note2_param: string
          new_course_ids_param: number[]
        }
        Returns: undefined
      }
    }
    Enums: {
      billing_frequency: "MONTHLY" | "WEEKLY" | "DAILY"
      notification_type: "KAKAOTALK" | "SMS" | "CALL" | "EMAIL"
      preferred_notification_type: "SMS" | "KAKAO" | "EMAIL"
      scheduledDays:
        | "MONDAY"
        | "TUESDAY"
        | "WEDNESDAY"
        | "THURSDAY"
        | "FRIDAY"
        | "SATURDAY"
        | "SUNDAY"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: {
          bucketid: string
          name: string
          owner: string
          metadata: Json
        }
        Returns: undefined
      }
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
