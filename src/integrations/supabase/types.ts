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
      bookings: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          internal_notes: string | null
          message: string | null
          name: string
          preferred_at: string
          status: string
          topic: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name: string
          preferred_at: string
          status?: string
          topic?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          internal_notes?: string | null
          message?: string | null
          name?: string
          preferred_at?: string
          status?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          portal_code: string
          status: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          portal_code?: string
          status?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          portal_code?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      project_updates: {
        Row: {
          author: string | null
          body: string | null
          client_visible: boolean
          created_at: string
          id: string
          project_id: string
          title: string
        }
        Insert: {
          author?: string | null
          body?: string | null
          client_visible?: boolean
          created_at?: string
          id?: string
          project_id: string
          title: string
        }
        Update: {
          author?: string | null
          body?: string | null
          client_visible?: boolean
          created_at?: string
          id?: string
          project_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_updates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          client_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          name: string
          progress: number
          stage: string
          start_date: string | null
          status: string
          summary: string | null
          updated_at: string
        }
        Insert: {
          budget?: number | null
          client_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          name: string
          progress?: number
          stage?: string
          start_date?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Update: {
          budget?: number | null
          client_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          name?: string
          progress?: number
          stage?: string
          start_date?: string | null
          status?: string
          summary?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      tenants: {
        Row: { id: string; slug: string; name: string; created_at: string; updated_at: string }
        Insert: { id?: string; slug: string; name: string; created_at?: string; updated_at?: string }
        Update: { id?: string; slug?: string; name?: string; created_at?: string; updated_at?: string }
        Relationships: []
      }
      tenant_members: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          role: Database["public"]["Enums"]["tenant_role"]
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          user_id: string
          role?: Database["public"]["Enums"]["tenant_role"]
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          user_id?: string
          role?: Database["public"]["Enums"]["tenant_role"]
          created_at?: string
        }
        Relationships: []
      }
      agent_config: {
        Row: {
          id: string
          tenant_id: string
          attribution_tag: string | null
          agent_wallet: string | null
          erc8004_url: string | null
          erc8004_agent_id: string | null
          telegram_bot_username: string | null
          primary_track: string
          other_wallets: Json
          own_contracts: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          attribution_tag?: string | null
          agent_wallet?: string | null
          erc8004_url?: string | null
          erc8004_agent_id?: string | null
          telegram_bot_username?: string | null
          primary_track?: string
          other_wallets?: Json
          own_contracts?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          attribution_tag?: string | null
          agent_wallet?: string | null
          erc8004_url?: string | null
          erc8004_agent_id?: string | null
          telegram_bot_username?: string | null
          primary_track?: string
          other_wallets?: Json
          own_contracts?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      counterparties: {
        Row: {
          id: string
          tenant_id: string
          wallet_address: string
          label: string | null
          telegram_user_id: string | null
          independence_status: string
          first_seen_on_celo: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          wallet_address: string
          label?: string | null
          telegram_user_id?: string | null
          independence_status?: string
          first_seen_on_celo?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          wallet_address?: string
          label?: string | null
          telegram_user_id?: string | null
          independence_status?: string
          first_seen_on_celo?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: []
      }
      till_jobs: {
        Row: {
          id: string
          tenant_id: string
          telegram_chat_id: string | null
          telegram_user_id: string | null
          payer_wallet: string | null
          counterparty_id: string | null
          counterparty_wallet: string
          asset: Database["public"]["Enums"]["till_asset"]
          amount_atomic: string
          amount_display: string | null
          status: Database["public"]["Enums"]["till_job_status"]
          intent_raw: string | null
          authorization_payload: Json | null
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          telegram_chat_id?: string | null
          telegram_user_id?: string | null
          payer_wallet?: string | null
          counterparty_id?: string | null
          counterparty_wallet: string
          asset: Database["public"]["Enums"]["till_asset"]
          amount_atomic: string
          amount_display?: string | null
          status?: Database["public"]["Enums"]["till_job_status"]
          intent_raw?: string | null
          authorization_payload?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          telegram_chat_id?: string | null
          telegram_user_id?: string | null
          payer_wallet?: string | null
          counterparty_id?: string | null
          counterparty_wallet?: string
          asset?: Database["public"]["Enums"]["till_asset"]
          amount_atomic?: string
          amount_display?: string | null
          status?: Database["public"]["Enums"]["till_job_status"]
          intent_raw?: string | null
          authorization_payload?: Json | null
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      till_transactions: {
        Row: {
          id: string
          tenant_id: string
          job_id: string | null
          tx_hash: string
          asset: Database["public"]["Enums"]["till_asset"]
          amount_atomic: string
          amount_display: string | null
          from_wallet: string
          to_wallet: string
          path: string
          attribution_tag: string | null
          attribution_verified: boolean
          fee_currency: string | null
          celoscan_url: string | null
          block_number: number | null
          confirmed_at: string | null
          raw: Json
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          job_id?: string | null
          tx_hash: string
          asset: Database["public"]["Enums"]["till_asset"]
          amount_atomic: string
          amount_display?: string | null
          from_wallet: string
          to_wallet: string
          path?: string
          attribution_tag?: string | null
          attribution_verified?: boolean
          fee_currency?: string | null
          celoscan_url?: string | null
          block_number?: number | null
          confirmed_at?: string | null
          raw?: Json
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          job_id?: string | null
          tx_hash?: string
          asset?: Database["public"]["Enums"]["till_asset"]
          amount_atomic?: string
          amount_display?: string | null
          from_wallet?: string
          to_wallet?: string
          path?: string
          attribution_tag?: string | null
          attribution_verified?: boolean
          fee_currency?: string | null
          celoscan_url?: string | null
          block_number?: number | null
          confirmed_at?: string | null
          raw?: Json
          created_at?: string
        }
        Relationships: []
      }
      attribution_events: {
        Row: {
          id: string
          tenant_id: string
          tx_hash: string
          codes: Json
          schema_id: number | null
          verified: boolean
          verified_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          tenant_id: string
          tx_hash: string
          codes?: Json
          schema_id?: number | null
          verified?: boolean
          verified_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          tenant_id?: string
          tx_hash?: string
          codes?: Json
          schema_id?: number | null
          verified?: boolean
          verified_at?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      ensure_default_till_tenant: {
        Args: { _user_id: string; _slug?: string; _name?: string }
        Returns: string
      }
      is_tenant_member: { Args: { _tenant_id: string }; Returns: boolean }
      has_tenant_role: {
        Args: {
          _tenant_id: string
          _role: Database["public"]["Enums"]["tenant_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "staff"
      tenant_role: "owner" | "admin" | "operator" | "viewer"
      till_job_status:
        | "pending"
        | "awaiting_signature"
        | "submitting"
        | "confirmed"
        | "failed"
        | "rejected"
      till_asset: "cNGN" | "USDC" | "USDT" | "USAT" | "OTHER"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      app_role: ["admin", "staff"],
      tenant_role: ["owner", "admin", "operator", "viewer"],
      till_job_status: [
        "pending",
        "awaiting_signature",
        "submitting",
        "confirmed",
        "failed",
        "rejected",
      ],
      till_asset: ["cNGN", "USDC", "USDT", "USAT", "OTHER"],
    },
  },
} as const
