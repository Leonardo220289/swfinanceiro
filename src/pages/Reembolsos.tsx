import { useMemo, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/hooks/useTable";
import { formatBRL, formatDateBR } from "@/lib/format";
import { toast } from "sonner";

const blank = {
  id: undefined as string | undefined,
  colaborador_id: "",
  competencia: new Date().toISOString().slice(0, 10),
  km: "",
  alimentacao: "",
  outros: "",
  observacao: "",
};

const Reembolsos = () => {
  const { data: reembolsos } = useTable<any>("reembolsos", "competencia");
  const { data: colabs } = useTable<any>("colaboradores", "nome", true);
  const { data: categorias } = useTable<any>("categorias", "nome", true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blank);

  const colabMap = useMemo(() => Object.fromEntries(colabs.map((c: any) => [c.id, c])), [colabs]);

  const openNew = () => { setForm(blank); setOpen(true); };
  const openEdit = (r: any) => {
    setForm({
      id: r.id,
      colaborador_id: r.colaborador_id || "",
      competencia: r.competencia,
      km: String(r.km ?? ""),
      alimentacao: String(r.alimentacao ?? ""),
      outros: String(r.outros ?? ""),
      observacao: r.observacao || "",
    });
    setOpen(true);
  };

  const save = async () => {
    if (!form.colaborador_id || !form.competencia) {
      toast.error("Selecione colaborador e competência"); return;
    }
    const payload: any = {
      colaborador_id: form.colaborador_id,
      competencia: form.competencia,
      km: Number(form.km || 0),
      alimentacao: Number(form.alimentacao || 0),
      outros: Number(form.outros || 0),
      observacao: form.observacao || null,
    };
    const q = form.id
      ? supabase.from("reembolsos").update(payload).eq("id", form.id)
      : supabase.from("reembolsos").insert(payload);
    const { error } = await q;
    if (error) toast.error(error.message); else { toast.success("Reembolso salvo"); setOpen(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir reembolso?")) return;
    const { error } = await supabase.from("reembolsos").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Excluído");
  };

  const sendToFluxo = async (r: any) => {
    if (r.lancamento_id) { toast.info("Já enviado ao Fluxo de Caixa"); return; }
    const cat = categorias.find((c: any) => c.nome === "Custo") || categorias.find((c: any) => c.tipo === "SAIDA");
    if (!cat) { toast.error("Crie a categoria 'Custo' antes de enviar"); return; }
    const colab = colabMap[r.colaborador_id];
    const { data: ins, error } = await supabase.from("lancamentos").insert({
      categoria_id: cat.id,
      competencia: r.competencia,
      valor: r.total,
      status: "LANCADO",
      descricao: `Reembolso - ${colab?.nome || ""}`,
      observacao: r.observacao,
    }).select("id").single();
    if (error) { toast.error(error.message); return; }
    await supabase.from("reembolsos").update({ lancamento_id: ins!.id, pago: true, data_pagamento: new Date().toISOString().slice(0,10) }).eq("id", r.id);
    toast.success("Enviado ao Fluxo de Caixa");
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Reembolsos" subtitle="Controle de reembolsos da equipe" />
      <main className="container mx-auto px-6 py-8 space-y-6">
        <div className="flex justify-end">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Novo reembolso</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} reembolso</DialogTitle></DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 col-span-2">
                  <Label>Colaborador *</Label>
                  <Select value={form.colaborador_id} onValueChange={(v) => setForm({ ...form, colaborador_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      {colabs.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Competência *</Label>
                  <Input type="date" value={form.competencia} onChange={(e) => setForm({ ...form, competencia: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>KM (R$)</Label>
                  <Input type="number" step="0.01" value={form.km} onChange={(e) => setForm({ ...form, km: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Alimentação (R$)</Label>
                  <Input type="number" step="0.01" value={form.alimentacao} onChange={(e) => setForm({ ...form, alimentacao: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Outros (R$)</Label>
                  <Input type="number" step="0.01" value={form.outros} onChange={(e) => setForm({ ...form, outros: e.target.value })} />
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

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competência</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead className="text-right">KM</TableHead>
                <TableHead className="text-right">Alim.</TableHead>
                <TableHead className="text-right">Outros</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reembolsos.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  Nenhum reembolso cadastrado.
                </TableCell></TableRow>
              )}
              {reembolsos.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>{formatDateBR(r.competencia)}</TableCell>
                  <TableCell>{colabMap[r.colaborador_id]?.nome || "—"}</TableCell>
                  <TableCell className="text-right">{formatBRL(Number(r.km))}</TableCell>
                  <TableCell className="text-right">{formatBRL(Number(r.alimentacao))}</TableCell>
                  <TableCell className="text-right">{formatBRL(Number(r.outros))}</TableCell>
                  <TableCell className="text-right font-semibold">{formatBRL(Number(r.total))}</TableCell>
                  <TableCell>
                    {r.lancamento_id ? <span className="text-green-600 text-sm">Enviado ao caixa</span> : <span className="text-muted-foreground text-sm">Pendente</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="icon" variant="ghost" title="Enviar ao Fluxo de Caixa" onClick={() => sendToFluxo(r)} disabled={!!r.lancamento_id}>
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </main>
    </div>
  );
};

export default Reembolsos;
