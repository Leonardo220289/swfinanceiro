import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type TableName = "categorias" | "meios_pagamento" | "produtos" | "contatos" | "colaboradores" | "lancamentos" | "reembolsos";

export function useTable<T = any>(table: TableName, orderBy: string = "created_at", asc = false) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const channelIdRef = useRef<string>(`rt-${table}-${Math.random().toString(36).slice(2, 10)}`);

  const reload = useCallback(async () => {
    setLoading(true);
    const { data, error } = await (supabase as any).from(table).select("*").order(orderBy, { ascending: asc });
    if (!error) setData((data || []) as T[]);
    setLoading(false);
  }, [table, orderBy, asc]);

  useEffect(() => {
    reload();
    const ch = supabase.channel(channelIdRef.current).on(
      "postgres_changes",
      { event: "*", schema: "public", table },
      () => reload()
    ).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [table, reload]);

  return { data, loading, reload };
}
