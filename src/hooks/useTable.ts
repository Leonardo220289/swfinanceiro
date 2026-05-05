import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type TableName = "categorias" | "meios_pagamento" | "produtos" | "contatos" | "colaboradores" | "lancamentos" | "reembolsos";

export function useTable<T = any>(table: TableName, orderBy: string = "created_at", asc = false) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from(table).select("*").order(orderBy, { ascending: asc });
    if (!error) setData((data || []) as T[]);
    setLoading(false);
  }, [table, orderBy, asc]);

  useEffect(() => {
    reload();
    const ch = supabase.channel(`rt-${table}`).on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      () => reload()
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table, reload]);

  return { data, loading, reload };
}
