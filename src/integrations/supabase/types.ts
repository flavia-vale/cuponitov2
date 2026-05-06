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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      affiliate_accounts: {
        Row: {
          active: boolean | null
          api_token: string | null
          created_at: string | null
          extra_config: Json
          id: string
          name: string
          provider_id: string | null
          publisher_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          api_token?: string | null
          created_at?: string | null
          extra_config?: Json
          id?: string
          name: string
          provider_id?: string | null
          publisher_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          api_token?: string | null
          created_at?: string | null
          extra_config?: Json
          id?: string
          name?: string
          provider_id?: string | null
          publisher_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_accounts_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "integration_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_authors: {
        Row: {
          avatar_url: string
          bio: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string
          bio?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          avatar_url?: string
          bio?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color_hex: string
          created_at: string
          description: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      banner_clicks: {
        Row: {
          banner_url: string
          created_at: string
          id: string
          link_url: string
          post_id: string
        }
        Insert: {
          banner_url: string
          created_at?: string
          id?: string
          link_url: string
          post_id: string
        }
        Update: {
          banner_url?: string
          created_at?: string
          id?: string
          link_url?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "banner_clicks_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string
          cover_image: string
          created_at: string
          cta_config: Json | null
          excerpt: string
          featured: boolean
          id: string
          images_json: Json | null
          meta_description: string
          meta_title: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_post_status"]
          title: string
          updated_at: string
          views_count: number
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          cover_image?: string
          created_at?: string
          cta_config?: Json | null
          excerpt?: string
          featured?: boolean
          id?: string
          images_json?: Json | null
          meta_description?: string
          meta_title?: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string
          cover_image?: string
          created_at?: string
          cta_config?: Json | null
          excerpt?: string
          featured?: boolean
          id?: string
          images_json?: Json | null
          meta_description?: string
          meta_title?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_post_status"]
          title?: string
          updated_at?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          id: string
          title: string
          meta_description: string
          slug: string
          cover_url: string
          category: string
          content: string
          images_json: Json
          related_post_ids: string[]
          author: string
          keywords: string
          status: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title?: string
          meta_description?: string
          slug: string
          cover_url?: string
          category?: string
          content?: string
          images_json?: Json
          related_post_ids?: string[]
          author?: string
          keywords?: string
          status?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          meta_description?: string
          slug?: string
          cover_url?: string
          category?: string
          content?: string
          images_json?: Json
          related_post_ids?: string[]
          author?: string
          keywords?: string
          status?: boolean
          created_at?: string
        }
        Relationships: []
      }
      coupons: {
        Row: {
          awin_promotion_id: string | null
          category: string
          code: string | null
          created_at: string
          description: string
          discount: string
          expiry: string | null
          expiry_text: string
          id: string
          is_featured: boolean
          is_flash: boolean
          link: string
          publisher_id: string | null
          start_date: string | null
          status: boolean
          store: string
          store_id: string | null
          success_rate: number
          terms: string | null
          title: string
          type: string | null
          updated_at: string
        }
        Insert: {
          awin_promotion_id?: string | null
          category?: string
          code?: string | null
          created_at?: string
          description?: string
          discount?: string
          expiry?: string | null
          expiry_text?: string
          id?: string
          is_featured?: boolean
          is_flash?: boolean
          link?: string
          publisher_id?: string | null
          start_date?: string | null
          status?: boolean
          store: string
          store_id?: string | null
          success_rate?: number
          terms?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Update: {
          awin_promotion_id?: string | null
          category?: string
          code?: string | null
          created_at?: string
          description?: string
          discount?: string
          expiry?: string | null
          expiry_text?: string
          id?: string
          is_featured?: boolean
          is_flash?: boolean
          link?: string
          publisher_id?: string | null
          start_date?: string | null
          status?: boolean
          store?: string
          store_id?: string | null
          success_rate?: number
          terms?: string | null
          title?: string
          type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupons_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_categories: {
        Row: {
          color_hex: string
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          color_hex?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          color_hex?: string
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      coupon_sources: {
        Row: {
          allowed_paths: string[]
          created_at: string
          enabled: boolean
          id: string
          keywords: string[]
          last_error: string | null
          last_scan_at: string | null
          last_status: string
          marketplace_slug: string
          metadata: Json
          name: string
          next_scan_at: string
          risk_level: number
          scan_interval_minutes: number
          selectors: Json
          source_type: string
          source_url: string
          updated_at: string
        }
        Insert: {
          allowed_paths?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          keywords?: string[]
          last_error?: string | null
          last_scan_at?: string | null
          last_status?: string
          marketplace_slug: string
          metadata?: Json
          name: string
          next_scan_at?: string
          risk_level?: number
          scan_interval_minutes?: number
          selectors?: Json
          source_type?: string
          source_url: string
          updated_at?: string
        }
        Update: {
          allowed_paths?: string[]
          created_at?: string
          enabled?: boolean
          id?: string
          keywords?: string[]
          last_error?: string | null
          last_scan_at?: string | null
          last_status?: string
          marketplace_slug?: string
          metadata?: Json
          name?: string
          next_scan_at?: string
          risk_level?: number
          scan_interval_minutes?: number
          selectors?: Json
          source_type?: string
          source_url?: string
          updated_at?: string
        }
        Relationships: []
      }
      coupon_evidence: {
        Row: {
          confidence_score: number
          content_hash: string
          coupon_id: string | null
          created_at: string
          description: string
          evidence_type: string
          expires_at: string | null
          extracted_payload: Json
          id: string
          marketplace_slug: string
          normalized_code: string
          observed_at: string
          raw_code: string
          source_id: string | null
          source_type: string
          source_url: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          confidence_score?: number
          content_hash?: string
          coupon_id?: string | null
          created_at?: string
          description?: string
          evidence_type?: string
          expires_at?: string | null
          extracted_payload?: Json
          id?: string
          marketplace_slug: string
          normalized_code?: string
          observed_at?: string
          raw_code?: string
          source_id?: string | null
          source_type?: string
          source_url: string
          status?: string
          title?: string
          updated_at?: string
        }
        Update: {
          confidence_score?: number
          content_hash?: string
          coupon_id?: string | null
          created_at?: string
          description?: string
          evidence_type?: string
          expires_at?: string | null
          extracted_payload?: Json
          id?: string
          marketplace_slug?: string
          normalized_code?: string
          observed_at?: string
          raw_code?: string
          source_id?: string | null
          source_type?: string
          source_url?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_evidence_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_evidence_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "coupon_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_submissions: {
        Row: {
          code: string
          coupon_id: string | null
          created_at: string
          description: string
          evidence_url: string
          expires_at: string | null
          id: string
          ip_hash: string
          metadata: Json
          min_order_value: number | null
          moderation_notes: string
          normalized_code: string
          screenshot_url: string
          source_url: string
          spam_score: number
          status: string
          store_slug: string
          submitter_email: string
          submitter_user_id: string | null
          title: string
          trust_score: number
          updated_at: string
          user_agent_hash: string
        }
        Insert: {
          code?: string
          coupon_id?: string | null
          created_at?: string
          description?: string
          evidence_url?: string
          expires_at?: string | null
          id?: string
          ip_hash?: string
          metadata?: Json
          min_order_value?: number | null
          moderation_notes?: string
          normalized_code?: string
          screenshot_url?: string
          source_url?: string
          spam_score?: number
          status?: string
          store_slug: string
          submitter_email?: string
          submitter_user_id?: string | null
          title?: string
          trust_score?: number
          updated_at?: string
          user_agent_hash?: string
        }
        Update: {
          code?: string
          coupon_id?: string | null
          created_at?: string
          description?: string
          evidence_url?: string
          expires_at?: string | null
          id?: string
          ip_hash?: string
          metadata?: Json
          min_order_value?: number | null
          moderation_notes?: string
          normalized_code?: string
          screenshot_url?: string
          source_url?: string
          spam_score?: number
          status?: string
          store_slug?: string
          submitter_email?: string
          submitter_user_id?: string | null
          title?: string
          trust_score?: number
          updated_at?: string
          user_agent_hash?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_submissions_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
        ]
      }
      coupon_validation_events: {
        Row: {
          coupon_id: string | null
          created_at: string
          event_type: string
          evidence_id: string | null
          id: string
          message: string
          metadata: Json
          score_delta: number
          signal_source: string
          submission_id: string | null
          success: boolean | null
          validation_status: string
        }
        Insert: {
          coupon_id?: string | null
          created_at?: string
          event_type: string
          evidence_id?: string | null
          id?: string
          message?: string
          metadata?: Json
          score_delta?: number
          signal_source?: string
          submission_id?: string | null
          success?: boolean | null
          validation_status?: string
        }
        Update: {
          coupon_id?: string | null
          created_at?: string
          event_type?: string
          evidence_id?: string | null
          id?: string
          message?: string
          metadata?: Json
          score_delta?: number
          signal_source?: string
          submission_id?: string | null
          success?: boolean | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "coupon_validation_events_coupon_id_fkey"
            columns: ["coupon_id"]
            isOneToOne: false
            referencedRelation: "coupons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_validation_events_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "coupon_evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupon_validation_events_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "coupon_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_providers: {
        Row: {
          active: boolean
          auth_type: string
          base_url: string
          created_at: string
          id: string
          name: string
          notes: string
          slug: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          auth_type?: string
          base_url?: string
          created_at?: string
          id?: string
          name: string
          notes?: string
          slug: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          auth_type?: string
          base_url?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      lomadee_store_filters: {
        Row: {
          account_id: string
          created_at: string
          enabled: boolean
          id: string
          lomadee_store_id: string
          store_logo: string
          store_name: string
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          lomadee_store_id: string
          store_logo?: string
          store_name?: string
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          lomadee_store_id?: string
          store_logo?: string
          store_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lomadee_store_filters_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          awin_promotion_id: string
          code: string | null
          created_at: string | null
          description: string | null
          discount: string | null
          expiry: string | null
          id: string
          link: string
          publisher_id: string
          status: boolean | null
          store_name: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          awin_promotion_id: string
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount?: string | null
          expiry?: string | null
          id?: string
          link: string
          publisher_id: string
          status?: boolean | null
          store_name?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          awin_promotion_id?: string
          code?: string | null
          created_at?: string | null
          description?: string | null
          discount?: string | null
          expiry?: string | null
          id?: string
          link?: string
          publisher_id?: string
          status?: boolean | null
          store_name?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          description: string | null
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      stores: {
        Row: {
          active: boolean | null
          awin_advertiser_id: string | null
          brand_color: string
          created_at: string
          description: string
          fallback_color: string
          icon_emoji: string
          id: string
          is_featured: boolean
          logo_url: string | null
          meta_description: string
          name: string
          slug: string
          store_id: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          awin_advertiser_id?: string | null
          brand_color?: string
          created_at?: string
          description?: string
          fallback_color?: string
          icon_emoji?: string
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          meta_description?: string
          name: string
          slug: string
          store_id: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          awin_advertiser_id?: string | null
          brand_color?: string
          created_at?: string
          description?: string
          fallback_color?: string
          icon_emoji?: string
          id?: string
          is_featured?: boolean
          logo_url?: string | null
          meta_description?: string
          name?: string
          slug?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          account_id: string
          error_message: string | null
          finished_at: string | null
          id: string
          meta: Json
          records_inserted: number
          records_skipped: number
          records_updated: number
          started_at: string
          status: string
        }
        Insert: {
          account_id: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json
          records_inserted?: number
          records_skipped?: number
          records_updated?: number
          started_at?: string
          status?: string
        }
        Update: {
          account_id?: string
          error_message?: string | null
          finished_at?: string | null
          id?: string
          meta?: Json
          records_inserted?: number
          records_skipped?: number
          records_updated?: number
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_logs_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_schedules: {
        Row: {
          account_id: string
          created_at: string
          enabled: boolean
          id: string
          interval_hours: number
          last_run_at: string | null
          next_run_at: string
          state: Json
          updated_at: string
        }
        Insert: {
          account_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          interval_hours?: number
          last_run_at?: string | null
          next_run_at?: string
          state?: Json
          updated_at?: string
        }
        Update: {
          account_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          interval_hours?: number
          last_run_at?: string | null
          next_run_at?: string
          state?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sync_schedules_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "affiliate_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_blog_views: { Args: { post_id: string }; Returns: undefined }
    }
    Enums: {
      blog_post_status: "draft" | "published" | "scheduled"
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
    Enums: {
      blog_post_status: ["draft", "published", "scheduled"],
    },
  },
} as const
