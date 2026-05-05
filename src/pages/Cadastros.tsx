import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTable } from "@/hooks/useTable";
import { toast } from "sonner";

type EntityKey = "contatos" | "produtos" | "categorias" | "meios_pagamento" | "colaboradores";

const Cadastros = () => {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader title="Cadastros" subtitle="Gerencie clientes, produtos, categorias e mais" />
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="contatos">
          <TabsList>
            <TabsTrigger value="contatos">Contatos</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="categorias">Categorias</TabsTrigger>
            <TabsTrigger value="meios_pagamento">Meios de Pgto</TabsTrigger>
            <TabsTrigger value="colaboradores">Colaboradores</TabsTrigger>
          </TabsList>
          <TabsContent value="contatos"><ContatosTab /></TabsContent>
          <TabsContent value="produtos"><SimpleCrud entity="produtos" fields={[{ k: "codigo", l: "Código *", required: true }, { k: "descricao", l: "Descrição", textarea: true }]} cols={[{ k: "codigo", l: "Código" }, { k: "descricao", l: "Descrição" }]} /></TabsContent>
          <TabsContent value="categorias"><SimpleCrud entity="categorias" fields={[{ k: "nome", l: "Nome *", required: true }, { k: "tipo", l: "Tipo *", required: true, select: ["ENTRADA", "SAIDA"] }, { k: "descricao", l: "Descrição", textarea: true }]} cols={[{ k: "nome", l: "Nome" }, { k: "tipo", l: "Tipo" }, { k: "descricao", l: "Descrição" }]} /></TabsContent>
          <TabsContent value="meios_pagamento"><SimpleCrud entity="meios_pagamento" fields={[{ k: "nome", l: "Nome *", required: true }]} cols={[{ k: "nome", l: "Nome" }]} /></TabsContent>
          <TabsContent value="colaboradores"><SimpleCrud entity="colaboradores" fields={[{ k: "nome", l: "Nome *", required: true }]} cols={[{ k: "nome", l: "Nome" }]} /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

interface FieldDef { k: string; l: string; required?: boolean; textarea?: boolean; select?: string[] }
interface ColDef { k: string; l: string }

const SimpleCrud = ({ entity, fields, cols }: { entity: EntityKey; fields: FieldDef[]; cols: ColDef[] }) => {
  const { data } = useTable<any>(entity, fields[0].k, true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const openNew = () => { setForm({}); setOpen(true); };
  const openEdit = (row: any) => { setForm({ ...row }); setOpen(true); };

  const save = async () => {
    for (const f of fields) {
      if (f.required && !form[f.k]) { toast.error(`Preencha: ${f.l}`); return; }
    }
    const payload: any = {};
    fields.forEach((f) => { payload[f.k] = form[f.k] || null; });
    const q = form.id
      ? supabase.from(entity).update(payload).eq("id", form.id)
      : supabase.from(entity).insert(payload);
    const { error } = await q;
    if (error) toast.error(error.message); else { toast.success("Salvo"); setOpen(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir?")) return;
    const { error } = await supabase.from(entity).delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Excluído");
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Adicionar</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} registro</DialogTitle></DialogHeader>
            <div className="space-y-3">
              {fields.map((f) => (
                <div key={f.k} className="space-y-1">
                  <Label>{f.l}</Label>
                  {f.select ? (
                    <Select value={form[f.k] || ""} onValueChange={(v) => setForm({ ...form, [f.k]: v })}>
                      <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                      <SelectContent>
                        {f.select.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  ) : f.textarea ? (
                    <Textarea value={form[f.k] || ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                  ) : (
                    <Input value={form[f.k] || ""} onChange={(e) => setForm({ ...form, [f.k]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {cols.map((c) => <TableHead key={c.k}>{c.l}</TableHead>)}
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 && (
            <TableRow><TableCell colSpan={cols.length + 1} className="text-center text-muted-foreground py-8">Nenhum registro.</TableCell></TableRow>
          )}
          {data.map((r: any) => (
            <TableRow key={r.id}>
              {cols.map((c) => <TableCell key={c.k} className="max-w-xs truncate">{r[c.k] || "—"}</TableCell>)}
              <TableCell className="text-right">
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

const ContatosTab = () => {
  const { data: contatos } = useTable<any>("contatos", "nome", true);
  const { data: categorias } = useTable<any>("categorias", "nome", true);
  const { data: produtos } = useTable<any>("produtos", "codigo", true);
  const { data: meios } = useTable<any>("meios_pagamento", "nome", true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<any>({});

  const openNew = () => { setForm({}); setOpen(true); };
  const openEdit = (r: any) => { setForm({ ...r }); setOpen(true); };

  const save = async () => {
    if (!form.nome) { toast.error("Nome obrigatório"); return; }
    const payload = {
      nome: form.nome,
      cnpj: form.cnpj || null,
      emails: form.emails || null,
      categoria_id: form.categoria_id || null,
      produto_id: form.produto_id || null,
      meio_pagamento_id: form.meio_pagamento_id || null,
      vencimento_padrao: form.vencimento_padrao || null,
      modelo_cobranca: form.modelo_cobranca || null,
      observacao: form.observacao || null,
    };
    const q = form.id
      ? supabase.from("contatos").update(payload).eq("id", form.id)
      : supabase.from("contatos").insert(payload);
    const { error } = await q;
    if (error) toast.error(error.message); else { toast.success("Salvo"); setOpen(false); }
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir contato?")) return;
    const { error } = await supabase.from("contatos").delete().eq("id", id);
    if (error) toast.error(error.message); else toast.success("Excluído");
  };

  const catMap = Object.fromEntries(categorias.map((c: any) => [c.id, c.nome]));
  const prodMap = Object.fromEntries(produtos.map((c: any) => [c.id, c.codigo]));

  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew} className="gap-2"><Plus className="h-4 w-4" /> Novo contato</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{form.id ? "Editar" : "Novo"} contato</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2"><Label>Nome / Razão social *</Label><Input value={form.nome || ""} onChange={(e) => setForm({ ...form, nome: e.target.value })} /></div>
              <div className="space-y-1"><Label>CNPJ</Label><Input value={form.cnpj || ""} onChange={(e) => setForm({ ...form, cnpj: e.target.value })} /></div>
              <div className="space-y-1"><Label>E-mails</Label><Input value={form.emails || ""} onChange={(e) => setForm({ ...form, emails: e.target.value })} /></div>
              <div className="space-y-1">
                <Label>Categoria padrão</Label>
                <Select value={form.categoria_id || ""} onValueChange={(v) => setForm({ ...form, categoria_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{categorias.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Produto padrão</Label>
                <Select value={form.produto_id || ""} onValueChange={(v) => setForm({ ...form, produto_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{produtos.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.codigo}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Meio de pagamento padrão</Label>
                <Select value={form.meio_pagamento_id || ""} onValueChange={(v) => setForm({ ...form, meio_pagamento_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{meios.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1"><Label>Vencimento padrão</Label><Input value={form.vencimento_padrao || ""} onChange={(e) => setForm({ ...form, vencimento_padrao: e.target.value })} placeholder="Ex.: 15, ENTREGA DOC..." /></div>
              <div className="space-y-1 col-span-2"><Label>Modelo de cobrança</Label><Input value={form.modelo_cobranca || ""} onChange={(e) => setForm({ ...form, modelo_cobranca: e.target.value })} /></div>
              <div className="space-y-1 col-span-2"><Label>Observação</Label><Textarea value={form.observacao || ""} onChange={(e) => setForm({ ...form, observacao: e.target.value })} /></div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={save}>Salvar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Vencim.</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contatos.length === 0 && (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Nenhum contato.</TableCell></TableRow>
          )}
          {contatos.map((r: any) => (
            <TableRow key={r.id}>
              <TableCell className="max-w-xs truncate">{r.nome}</TableCell>
              <TableCell>{r.cnpj || "—"}</TableCell>
              <TableCell>{catMap[r.categoria_id] || "—"}</TableCell>
              <TableCell>{prodMap[r.produto_id] || "—"}</TableCell>
              <TableCell>{r.vencimento_padrao || "—"}</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default Cadastros;
