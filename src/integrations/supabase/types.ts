export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      content_reports: {
        Row: {
          admin_notes: string | null
          created_at: string
          description: string | null
          id: string
          marketplace_prompt_id: string
          reason: string
          reporter_id: string
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          marketplace_prompt_id: string
          reason: string
          reporter_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          description?: string | null
          id?: string
          marketplace_prompt_id?: string
          reason?: string
          reporter_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_reports_marketplace_prompt_id_fkey"
            columns: ["marketplace_prompt_id"]
            isOneToOne: false
            referencedRelation: "marketplace_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      license_types: {
        Row: {
          attribution_required: boolean
          commercial_use: boolean
          created_at: string
          description: string | null
          id: string
          modification_allowed: boolean
          name: string
          redistribution_allowed: boolean
        }
        Insert: {
          attribution_required?: boolean
          commercial_use?: boolean
          created_at?: string
          description?: string | null
          id?: string
          modification_allowed?: boolean
          name: string
          redistribution_allowed?: boolean
        }
        Update: {
          attribution_required?: boolean
          commercial_use?: boolean
          created_at?: string
          description?: string | null
          id?: string
          modification_allowed?: boolean
          name?: string
          redistribution_allowed?: boolean
        }
        Relationships: []
      }
      marketplace_prompts: {
        Row: {
          commission_rate: number
          created_at: string
          currency: string
          id: string
          is_featured: boolean
          is_for_sale: boolean
          is_verified: boolean
          license_type: string
          price: number
          prompt_id: string
          sales_count: number
          seller_id: string
          updated_at: string
        }
        Insert: {
          commission_rate?: number
          created_at?: string
          currency?: string
          id?: string
          is_featured?: boolean
          is_for_sale?: boolean
          is_verified?: boolean
          license_type?: string
          price?: number
          prompt_id: string
          sales_count?: number
          seller_id: string
          updated_at?: string
        }
        Update: {
          commission_rate?: number
          created_at?: string
          currency?: string
          id?: string
          is_featured?: boolean
          is_for_sale?: boolean
          is_verified?: boolean
          license_type?: string
          price?: number
          prompt_id?: string
          sales_count?: number
          seller_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_marketplace_prompts_prompt_id"
            columns: ["prompt_id"]
            isOneToOne: true
            referencedRelation: "prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          is_verified_purchase: boolean
          marketplace_prompt_id: string
          rating: number
          reviewer_id: string
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean
          marketplace_prompt_id: string
          rating: number
          reviewer_id: string
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          is_verified_purchase?: boolean
          marketplace_prompt_id?: string
          rating?: number
          reviewer_id?: string
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_reviews_marketplace_prompt_id_fkey"
            columns: ["marketplace_prompt_id"]
            isOneToOne: false
            referencedRelation: "marketplace_prompts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "marketplace_reviews_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "marketplace_transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_transactions: {
        Row: {
          amount: number
          buyer_id: string
          commission_amount: number
          created_at: string
          currency: string
          id: string
          marketplace_prompt_id: string
          payment_method: string | null
          payment_status: string
          seller_id: string
          stripe_payment_intent_id: string | null
          transaction_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          buyer_id: string
          commission_amount: number
          created_at?: string
          currency?: string
          id?: string
          marketplace_prompt_id: string
          payment_method?: string | null
          payment_status?: string
          seller_id: string
          stripe_payment_intent_id?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          commission_amount?: number
          created_at?: string
          currency?: string
          id?: string
          marketplace_prompt_id?: string
          payment_method?: string | null
          payment_status?: string
          seller_id?: string
          stripe_payment_intent_id?: string | null
          transaction_date?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_transactions_marketplace_prompt_id_fkey"
            columns: ["marketplace_prompt_id"]
            isOneToOne: false
            referencedRelation: "marketplace_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      prompt_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      prompts: {
        Row: {
          category: string | null
          content: string
          created_at: string
          description: string | null
          id: string
          is_public: boolean
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          credits: number
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_tnd: number
        }
        Insert: {
          created_at?: string
          credits: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_tnd: number
        }
        Update: {
          created_at?: string
          credits?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_tnd?: number
        }
        Relationships: []
      }
      user_credits: {
        Row: {
          created_at: string
          id: string
          total_credits: number
          updated_at: string
          used_credits: number
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_credits?: number
          updated_at?: string
          used_credits?: number
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string
          id: string
          marketplace_prompt_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          marketplace_prompt_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          marketplace_prompt_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_marketplace_prompt_id_fkey"
            columns: ["marketplace_prompt_id"]
            isOneToOne: false
            referencedRelation: "marketplace_prompts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_subscriptions: {
        Row: {
          amount_paid_tnd: number
          created_at: string
          credits_purchased: number
          id: string
          payment_method: string | null
          payment_status: string
          plan_id: string
          transaction_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid_tnd: number
          created_at?: string
          credits_purchased: number
          id?: string
          payment_method?: string | null
          payment_status?: string
          plan_id: string
          transaction_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid_tnd?: number
          created_at?: string
          credits_purchased?: number
          id?: string
          payment_method?: string | null
          payment_status?: string
          plan_id?: string
          transaction_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_profile_owner: {
        Args: { profile_user_id: string }
        Returns: boolean
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
