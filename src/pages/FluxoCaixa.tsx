import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, CheckCircle2, ArrowDownCircle, ArrowUpCircle, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/hooks/useTable";
import { formatBRL, formatDateBR } from "@/lib/format";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

type Lanc = any;

const STATUS_OPTIONS = [
  { value: "LANCADO", label: "Lançado" },
  { value: "PAGO", label: "Pago" },
  { value: "VENCIDO", label: "Vencido" },
  { value: "CANCELADO", label: "Cancelado" },
];

const blank = {
  id: undefined as string | undefined,
  contato_id: "",
  categoria_id: "",
  produto_id: "",
  meio_pagamento_id: "",
  descricao: "",
  numero_nf: "",
  vencimento_contrato: "",
  vencimento_bancario: "",
  competencia: new Date().toISOString().slice(0, 10),
  valor: "",
  status: "LANCADO",
  observacao: "",
};

const FluxoCaixa = () => {
  const { data: lancamentos } = useTable<Lanc>("lancamentos", "competencia");
  const { data: contatos } = useTable<any>("contatos", "nome", true);
  const { data: categorias } = useTable<any>("categorias", "nome", true);
  const { data: produtos } = useTable<any>("produtos", "codigo", true);
  const { data: meios } = useTable<any>("meios_pagamento", "nome", true);

  const [filterMonth, setFilterMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [filterCategoria, setFilterCategoria] = useState<string>("ALL");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const filtered = useMemo(() => {
    return lancamentos.filter((l) => {
      const matchMonth = !filterMonth || (l.competencia || "").startsWith(filterMonth);
      const matchStatus = filterStatus === "ALL" || l.status === filterStatus;
      const matchCat = filterCategoria === "ALL" || l.categoria_id === filterCategoria;
      return matchMonth && matchStatus && matchCat;
    });
  }, [lancamentos, filterMonth, filterStatus, filterCategoria]);

  const catMap = useMemo(() => Object.fromEntries(categorias.map((c: any) => [c.id, c])), [categorias]);
  const contatoMap = useMemo(() => Object.fromEntries(contatos.map((c: any) => [c.id, c])), [contatos]);
  const prodMap = useMemo(() => Object.fromEntries(produtos.map((c: any) => [c.id, c])), [produtos]);
  const meioMap = useMemo(() => Object.fromEntries(meios.map((c: any) => [c.id, c])), [meios]);

  const kpis = useMemo(() => {
    let entradasPagas = 0, entradasPrev = 0, saidasPagas = 0, saidasPrev = 0, vencidos = 0;
    filtered.forEach((l) => {
      const cat = catMap[l.categoria_id];
      const tipo = cat?.tipo;
      const v = Number(l.valor) || 0;
      if (tipo === "ENTRADA") {
        if (l.status === "PAGO") entradasPagas += v; else if (l.status !== "CANCELADO") entradasPrev += v;
      } else if (tipo === "SAIDA") {
        if (l.status === "PAGO") saidasPagas += v; else if (l.status !== "CANCELADO") saidasPrev += v;
      }
      if (l.status === "VENCIDO") vencidos += v;
    });
    return {
      entradasPagas, entradasPrev, saidasPagas, saidasPrev, vencidos,
      saldoRealizado: entradasPagas - saidasPagas,
      saldoProjetado: entradasPagas + entradasPrev - saidasPagas - saidasPrev,
    };
  }, [filtered, catMap]);

  const chartData = useMemo(() => {
    const byDay: Record<string, { day: string; entradas: number; saidas: number }> = {};
    filtered.forEach((l) => {
      const d = (l.vencimento_bancario || l.competencia || "").slice(0, 10);
      if (!d) return;
      if (!byDay[d]) byDay[d] = { day: d, entradas: 0, saidas: 0 };
      const tipo = catMap[l.categoria_id]?.tipo;
      const v = Number(l.valor) || 0;
      if (tipo === "ENTRADA") byDay[d].entradas += v; else if (tipo === "SAIDA") byDay[d].saidas += v;
    });
    return Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day))
      .map((d) => ({ ...d, day: d.day.slice(8, 10) + "/" + d.day.slice(5, 7) }));
  }, [filtered, catMap]);

  const openNew = () => { setForm(blank); setOpen(true); };
  const openEdit = (l: any) => {
    setForm({
      id: l.id,
      contato_id: l.contato_id || "",
      categoria_id: l.categoria_id || "",
      produto_id: l.produto_id || "",
      meio_pagamento_id: l.meio_pagamento_id || "",
      descricao: l.descricao || "",
      numero_nf: l.numero_nf || "",
      vencimento_contrato: l.vencimento_contrato || "",
      vencimento_bancario: l.vencimento_bancario || "",
      competencia: l.competencia || "",
      valor: String(l.valor ?? ""),
      status: l.status || "LANCADO",
      observacao: l.observacao || "",
    });
    setOpen(true);
  };

  const handleContatoChange = (id: string) => {
    const c = contatoMap[id];
    setForm((f) => ({
      ...f,
      contato_id: id,
      categoria_id: c?.categoria_id || f.categoria_id,
      produto_id: c?.produto_id || f.produto_id,
      meio_pagamento_id: c?.meio_pagamento_id || f.meio_pagamento_id,
      vencimento_contrato: c?.vencimento_padrao || f.vencimento_contrato,
    }));
  };

  const save = async () => {
    if (!form.categoria_id || !form.competencia || !form.valor) {
      toast.error("Preencha categoria, competência e valor");
      return;
    }
    const payload: any = {
      contato_id: form.contato_id || null,
      categoria_id: form.categoria_id,
      produto_id: form.produto_id || null,
      meio_pagamento_id: form.meio_pagamento_id || null,
      descricao: form.descricao || null,
      numero_nf: form.numero_nf || null,
      vencimento_contrato: form.vencimento_contrato || null,
      vencimento_bancario: form.vencimento_bancario || null,
      competencia: form.competencia,
      valor: Number(form.valor),
      status: form.status,
      observacao: form.observacao || null,
    };
    const q = form.id
      ? supabase.from("lancamentos").update(payload).eq("id", form.id)
      : supabase.from("lancamentos").insert(payload);
    const { error } = await q;
    if (error) toast.error(error.message);
    else { toast.success("Lançamento salvo"); setOpen(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este lançamento?")) return;
    const { error } = await supabase.from("lancamentos").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Excluído");
  };

  const togglePago = async (l: any) => {
    const novo = l.status === "PAGO" ? "LANCADO" : "PAGO";
    const { error } = await supabase.from("lancamentos").update({ status: novo }).eq("id", l.id);
    if (error) toast.error(error.message);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Fluxo de Caixa" subtitle="Controle de entradas e saídas" />
      <main className="container mx-auto px-6 py-8 space-y-6">
        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <KpiBox label="Entradas pagas" value={kpis.entradasPagas} color="text-blue-600" icon={<ArrowDownCircle className="h-4 w-4" />} />
          <KpiBox label="A receber" value={kpis.entradasPrev} color="text-blue-400" />
          <KpiBox label="Saídas pagas" value={kpis.saidasPagas} color="text-red-600" icon={<ArrowUpCircle className="h-4 w-4" />} />
          <KpiBox label="A pagar" value={kpis.saidasPrev} color="text-red-400" />
          <KpiBox label="Saldo realizado" value={kpis.saldoRealizado} color={kpis.saldoRealizado >= 0 ? "text-green-600" : "text-red-600"} />
          <KpiBox label="Saldo projetado" value={kpis.saldoProjetado} color={kpis.saldoProjetado >= 0 ? "text-green-600" : "text-red-600"} />
        </div>

        {/* Filtros */}
        <Card className="p-4 flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <Label>Mês (competência)</Label>
            <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label>Status</Label>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos</SelectItem>
                {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label>Categoria</Label>
            <Select value={filterCategoria} onValueChange={setFilterCategoria}>
              <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todas</SelectItem>
                {categorias.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={() => { setFilterStatus("ALL"); setFilterCategoria("ALL"); }}>Limpar</Button>
          <div className="ml-auto">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Novo lançamento</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} lançamento</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <Label>Contato (cliente / fornecedor)</Label>
                    <Select value={form.contato_id} onValueChange={handleContatoChange}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {contatos.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Categoria *</Label>
                    <Select value={form.categoria_id} onValueChange={(v) => setForm({ ...form, categoria_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {categorias.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome} ({c.tipo})</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Produto / Conta</Label>
                    <Select value={form.produto_id} onValueChange={(v) => setForm({ ...form, produto_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {produtos.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.codigo}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Meio de pagamento</Label>
                    <Select value={form.meio_pagamento_id} onValueChange={(v) => setForm({ ...form, meio_pagamento_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {meios.map((p: any) => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Valor (R$) *</Label>
                    <Input type="number" step="0.01" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Competência *</Label>
                    <Input type="date" value={form.competencia} onChange={(e) => setForm({ ...form, competencia: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Vencimento bancário</Label>
                    <Input type="date" value={form.vencimento_bancario} onChange={(e) => setForm({ ...form, vencimento_bancario: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <Label>Vencimento contrato</Label>
                    <Input value={form.vencimento_contrato} onChange={(e) => setForm({ ...form, vencimento_contrato: e.target.value })} placeholder="Ex.: 15, ENTREGA DOC..." />
                  </div>
                  <div className="space-y-1">
                    <Label>Nº NF</Label>
                    <Input value={form.numero_nf} onChange={(e) => setForm({ ...form, numero_nf: e.target.value })} />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label>Descrição</Label>
                    <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <Label>Observação</Label>
                    <Textarea value={form.observacao} onChange={(e) => setForm({ ...form, observacao: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                  <Button onClick={save}>Salvar</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Gráfico */}
        {chartData.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Entradas vs Saídas no período</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis tickFormatter={(v) => `R$ ${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatBRL(v)} />
                  <Legend />
                  <Bar dataKey="entradas" fill="hsl(217 91% 60%)" name="Entradas" />
                  <Bar dataKey="saidas" fill="hsl(0 84% 60%)" name="Saídas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Tabela */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competência</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Pgto</TableHead>
                <TableHead>Vencim.</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  Nenhum lançamento neste período.
                </TableCell></TableRow>
              )}
              {filtered.map((l) => {
                const cat = catMap[l.categoria_id];
                return (
                  <TableRow key={l.id}>
                    <TableCell>{formatDateBR(l.competencia)}</TableCell>
                    <TableCell className="max-w-[220px] truncate">{contatoMap[l.contato_id]?.nome || "—"}</TableCell>
                    <TableCell>
                      {cat ? (
                        <Badge variant={cat.tipo === "ENTRADA" ? "default" : "destructive"}>{cat.nome}</Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{prodMap[l.produto_id]?.codigo || "—"}</TableCell>
                    <TableCell>{meioMap[l.meio_pagamento_id]?.nome || "—"}</TableCell>
                    <TableCell>{formatDateBR(l.vencimento_bancario)}</TableCell>
                    <TableCell className="text-right font-medium">
                      <span className={cat?.tipo === "ENTRADA" ? "text-blue-600" : "text-red-600"}>
                        {formatBRL(Number(l.valor))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={l.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="icon" variant="ghost" onClick={() => togglePago(l)} title="Marcar pago/lançado">
                        <CheckCircle2 className={`h-4 w-4 ${l.status === "PAGO" ? "text-green-600" : ""}`} />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => openEdit(l)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => remove(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

const KpiBox = ({ label, value, color, icon }: { label: string; value: number; color?: string; icon?: React.ReactNode }) => (
  <Card className="p-4">
    <div className="flex items-center gap-2 text-xs text-muted-foreground">{icon}{label}</div>
    <div className={`text-xl font-bold mt-1 ${color || ""}`}>{formatBRL(value)}</div>
  </Card>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { v: any; l: string }> = {
    PAGO: { v: "default", l: "Pago" },
    LANCADO: { v: "secondary", l: "Lançado" },
    VENCIDO: { v: "destructive", l: "Vencido" },
    CANCELADO: { v: "outline", l: "Cancelado" },
  };
  const s = map[status] || map.LANCADO;
  return <Badge variant={s.v}>{s.l}</Badge>;
};

export default FluxoCaixa;
