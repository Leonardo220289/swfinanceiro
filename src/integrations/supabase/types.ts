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
      categorias: {
        Row: {
          ativo: boolean
          created_at: string
          descricao: string | null
          id: string
          nome: string
          tipo: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome: string
          tipo: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          descricao?: string | null
          id?: string
          nome?: string
          tipo?: string
        }
        Relationships: []
      }
      colaboradores: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      contatos: {
        Row: {
          ativo: boolean
          categoria_id: string | null
          cnpj: string | null
          created_at: string
          emails: string | null
          id: string
          meio_pagamento_id: string | null
          modelo_cobranca: string | null
          nome: string
          observacao: string | null
          produto_id: string | null
          updated_at: string
          vencimento_padrao: string | null
          vigencia_contrato: string | null
        }
        Insert: {
          ativo?: boolean
          categoria_id?: string | null
          cnpj?: string | null
          created_at?: string
          emails?: string | null
          id?: string
          meio_pagamento_id?: string | null
          modelo_cobranca?: string | null
          nome: string
          observacao?: string | null
          produto_id?: string | null
          updated_at?: string
          vencimento_padrao?: string | null
          vigencia_contrato?: string | null
        }
        Update: {
          ativo?: boolean
          categoria_id?: string | null
          cnpj?: string | null
          created_at?: string
          emails?: string | null
          id?: string
          meio_pagamento_id?: string | null
          modelo_cobranca?: string | null
          nome?: string
          observacao?: string | null
          produto_id?: string | null
          updated_at?: string
          vencimento_padrao?: string | null
          vigencia_contrato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contatos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_meio_pagamento_id_fkey"
            columns: ["meio_pagamento_id"]
            isOneToOne: false
            referencedRelation: "meios_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contatos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      lancamentos: {
        Row: {
          categoria_id: string | null
          competencia: string
          contato_id: string | null
          created_at: string
          descricao: string | null
          id: string
          meio_pagamento_id: string | null
          nfs_boleto: string | null
          numero_nf: string | null
          observacao: string | null
          origem: string | null
          produto_id: string | null
          status: Database["public"]["Enums"]["lancamento_status"]
          updated_at: string
          valor: number
          vencimento_bancario: string | null
          vencimento_contrato: string | null
        }
        Insert: {
          categoria_id?: string | null
          competencia: string
          contato_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          meio_pagamento_id?: string | null
          nfs_boleto?: string | null
          numero_nf?: string | null
          observacao?: string | null
          origem?: string | null
          produto_id?: string | null
          status?: Database["public"]["Enums"]["lancamento_status"]
          updated_at?: string
          valor: number
          vencimento_bancario?: string | null
          vencimento_contrato?: string | null
        }
        Update: {
          categoria_id?: string | null
          competencia?: string
          contato_id?: string | null
          created_at?: string
          descricao?: string | null
          id?: string
          meio_pagamento_id?: string | null
          nfs_boleto?: string | null
          numero_nf?: string | null
          observacao?: string | null
          origem?: string | null
          produto_id?: string | null
          status?: Database["public"]["Enums"]["lancamento_status"]
          updated_at?: string
          valor?: number
          vencimento_bancario?: string | null
          vencimento_contrato?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lancamentos_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_contato_id_fkey"
            columns: ["contato_id"]
            isOneToOne: false
            referencedRelation: "contatos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_meio_pagamento_id_fkey"
            columns: ["meio_pagamento_id"]
            isOneToOne: false
            referencedRelation: "meios_pagamento"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lancamentos_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      meios_pagamento: {
        Row: {
          ativo: boolean
          created_at: string
          id: string
          nome: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      produtos: {
        Row: {
          ativo: boolean
          codigo: string
          created_at: string
          descricao: string | null
          id: string
        }
        Insert: {
          ativo?: boolean
          codigo: string
          created_at?: string
          descricao?: string | null
          id?: string
        }
        Update: {
          ativo?: boolean
          codigo?: string
          created_at?: string
          descricao?: string | null
          id?: string
        }
        Relationships: []
      }
      reembolsos: {
        Row: {
          alimentacao: number
          colaborador_id: string | null
          competencia: string
          created_at: string
          data_pagamento: string | null
          id: string
          km: number
          lancamento_id: string | null
          observacao: string | null
          outros: number
          pago: boolean
          total: number | null
        }
        Insert: {
          alimentacao?: number
          colaborador_id?: string | null
          competencia: string
          created_at?: string
          data_pagamento?: string | null
          id?: string
          km?: number
          lancamento_id?: string | null
          observacao?: string | null
          outros?: number
          pago?: boolean
          total?: number | null
        }
        Update: {
          alimentacao?: number
          colaborador_id?: string | null
          competencia?: string
          created_at?: string
          data_pagamento?: string | null
          id?: string
          km?: number
          lancamento_id?: string | null
          observacao?: string | null
          outros?: number
          pago?: boolean
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reembolsos_colaborador_id_fkey"
            columns: ["colaborador_id"]
            isOneToOne: false
            referencedRelation: "colaboradores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reembolsos_lancamento_id_fkey"
            columns: ["lancamento_id"]
            isOneToOne: false
            referencedRelation: "lancamentos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lancamento_status: "LANCADO" | "PAGO" | "VENCIDO" | "CANCELADO"
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
      lancamento_status: ["LANCADO", "PAGO", "VENCIDO", "CANCELADO"],
    },
  },
} as const
