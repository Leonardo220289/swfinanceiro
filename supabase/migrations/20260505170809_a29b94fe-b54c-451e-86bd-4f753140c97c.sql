-- ENUM helper status
CREATE TYPE public.lancamento_status AS ENUM ('LANCADO','PAGO','VENCIDO','CANCELADO');

CREATE TABLE public.categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  tipo text NOT NULL CHECK (tipo IN ('ENTRADA','SAIDA')),
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.meios_pagamento (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL UNIQUE,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo text NOT NULL UNIQUE,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.contatos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cnpj text,
  emails text,
  categoria_id uuid REFERENCES public.categorias(id) ON DELETE SET NULL,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE SET NULL,
  meio_pagamento_id uuid REFERENCES public.meios_pagamento(id) ON DELETE SET NULL,
  vencimento_padrao text,
  modelo_cobranca text,
  vigencia_contrato date,
  observacao text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.colaboradores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.lancamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contato_id uuid REFERENCES public.contatos(id) ON DELETE SET NULL,
  categoria_id uuid REFERENCES public.categorias(id) ON DELETE SET NULL,
  produto_id uuid REFERENCES public.produtos(id) ON DELETE SET NULL,
  meio_pagamento_id uuid REFERENCES public.meios_pagamento(id) ON DELETE SET NULL,
  descricao text,
  numero_nf text,
  vencimento_contrato text,
  vencimento_bancario date,
  competencia date NOT NULL,
  valor numeric(14,2) NOT NULL,
  status public.lancamento_status NOT NULL DEFAULT 'LANCADO',
  nfs_boleto text,
  observacao text,
  origem text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_lancamentos_competencia ON public.lancamentos(competencia);
CREATE INDEX idx_lancamentos_status ON public.lancamentos(status);

CREATE TABLE public.reembolsos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  colaborador_id uuid REFERENCES public.colaboradores(id) ON DELETE SET NULL,
  competencia date NOT NULL,
  km numeric(14,2) NOT NULL DEFAULT 0,
  alimentacao numeric(14,2) NOT NULL DEFAULT 0,
  outros numeric(14,2) NOT NULL DEFAULT 0,
  total numeric(14,2) GENERATED ALWAYS AS (km + alimentacao + outros) STORED,
  observacao text,
  pago boolean NOT NULL DEFAULT false,
  data_pagamento date,
  lancamento_id uuid REFERENCES public.lancamentos(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- updated_at triggers
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER trg_contatos_upd BEFORE UPDATE ON public.contatos
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER trg_lancamentos_upd BEFORE UPDATE ON public.lancamentos
  FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

-- RLS (open access for now - no login)
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meios_pagamento ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lancamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reembolsos ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT unnest(ARRAY['categorias','meios_pagamento','produtos','contatos','colaboradores','lancamentos','reembolsos']) LOOP
    EXECUTE format('CREATE POLICY "open_all" ON public.%I FOR ALL USING (true) WITH CHECK (true)', t);
  END LOOP;
END $$;

-- Seeds
INSERT INTO public.categorias (nome, tipo, descricao) VALUES
  ('Receita Fixa','ENTRADA','Recebível mensal de contratos - Assessorias'),
  ('Receita Variável','ENTRADA','Recebível por serviços pontuais - Consultorias'),
  ('Receita Fixa + Variável','ENTRADA','Contratos mensais + serviços pontuais'),
  ('Despesa Fixa','SAIDA','Pagamento recorrente mensal (fora mão de obra)'),
  ('Despesa Variável','SAIDA','Pagamento mensal eventual (fora mão de obra)'),
  ('Custo','SAIDA','Pagamento a prestadores PJ e CLT (salário)'),
  ('Imposto','SAIDA','Tributos sobre vendas e folha');

INSERT INTO public.meios_pagamento (nome) VALUES
  ('Boleto'),('PIX'),('Transferência'),('Cartão de Crédito'),('Dinheiro');

INSERT INTO public.produtos (codigo, descricao) VALUES
  ('AET - CONSULT.','Análise Ergonômica do Trabalho pontual'),
  ('AEP - CONSULT.','Avaliação ergonômica preliminar pontual'),
  ('INV. PSICO - CONSULT.','Inventário de riscos psicossociais pontual'),
  ('TREINA / PALESTRAS - CONSULT.','Treinamentos ou palestras pontuais'),
  ('AET + CHECKUP SAÚDE - CONSULT.','AET + check up saúde pontual'),
  ('COMBO A - ASSE.','Combo A - Assessoria'),
  ('COMBO B - ASSE.','Combo B - Assessoria'),
  ('COMBO C - ASSE.','Combo C - Assessoria'),
  ('COMBO D - ASSE.','Combo D - Assessoria'),
  ('COMBO E - ASSE.','Combo E - Assessoria'),
  ('COMBO F - ASSE.','Combo F - Assessoria'),
  ('COMBO G - ASSE.','Combo G - Assessoria'),
  ('COMBO H - ASSE.','Combo H - Assessoria'),
  ('PERÍCIA','Ergonomia Forense');