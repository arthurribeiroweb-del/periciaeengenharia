import React, { useMemo, useState } from "react"; // keep
import { motion } from "framer-motion";
import { ShieldCheck, SearchCheck, ClipboardCheck, FileCheck2, Building2, Scale, Camera, Phone, Mail, MapPin, MessageCircle, ChevronRight, BadgeCheck, Construction } from "lucide-react";

// === CONFIGURAÇÕES (edite aqui) ===
const COMPANY = {
  nome: "AB ENGENHARIA Diagnóstica",
  cidade: "Pará / Brasil",
  whatsDDD: "+55",
  whatsNumero: "559481646040", // <- EDITAR: telefone com DDI/DDD (apenas dígitos)
  email: "arengenharia.pro@gmail.com", // <- EDITAR
  instagram: "https://instagram.com/abengenhariapa", // <- opcional
  site: "https://www.periciaeengenharia.com.br", // <- opcional
  engenheira: {
    nome: "Eng. Amanda Brandão",
    crea: "CREA-PA 1518378579", // <- EDITAR CREA
    especialidades: [
      "Engenharia Diagnóstica",
      "Inspeções Prediais",
      "Perícias e Assistência Técnica",
      "Avaliações de Imóveis (ABNT NBR 14.653)"
    ],
    foto: "", // url opcional de foto profissional
  },
};

// UTM helper
function useUtmParams() {
  return useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","fbclid"];
    const picked = keys.filter(k => params.get(k));
    if (!picked.length) return "";
    return " " + picked.map(k => `${k}=${params.get(k)}`).join(" ");
  }, []);
}

function buildWhatsLink(msg) {
  const base = `https://wa.me/${COMPANY.whatsNumero}`;
  const texto = encodeURIComponent(msg);
  return `${base}?text=${texto}`;
}

const badges = [
  { icon: <BadgeCheck className="w-5 h-5"/>, label: "CREA Ativo" },
  { icon: <Camera className="w-5 h-5"/>, label: "Registro Fotográfico" },
  { icon: <ClipboardCheck className="w-5 h-5"/>, label: "Checklists ABNT/IBAPE" },
  { icon: <ShieldCheck className="w-5 h-5"/>, label: "Imparcialidade Técnica" }
];

const servicos = [
  {
    modulo: "Vistorias e Entregas",
    titulo: "Vistoria de Imóvel Novo e Recebimento Condominial",
    publico: "Proprietários e Condomínios",
    entrega: "Laudo de Conformidade com vícios/documentação para exigir correções (ABNT NBR 15575)",
    icon: <SearchCheck className="w-6 h-6"/>,
    oneLiner: "Receba seu imóvel com segurança técnica: checklist completo e laudo assinado.",
    cta: "Quero vistoriar meu imóvel",
  },
  {
    modulo: "Inspeção Predial",
    titulo: "Check-up da Edificação",
    publico: "Síndicos, Empresas, Indústrias",
    entrega: "Relatório de Inspeção com classificação de criticidade e plano de manutenção (Diretrizes IBAPE)",
    icon: <Building2 className="w-6 h-6"/>,
    oneLiner: "Risco controlado e orçamento previsível para seu prédio.",
    cta: "Agendar inspeção predial",
  },
  {
    modulo: "Assistência e Perícia",
    titulo: "Suporte Técnico Judicial/Extrajudicial",
    publico: "Advogados e Escritórios",
    entrega: "Pareceres Técnicos, resposta a quesitos e acompanhamento pericial com cadeia de evidências",
    icon: <Scale className="w-6 h-6"/>,
    oneLiner: "Laudos sólidos para decisões sólidas.",
    cta: "Falar sobre perícia",
  },
  {
    modulo: "Avaliação e Acompanhamento",
    titulo: "Avaliação de Imóveis e Acompanhamento de Obra",
    publico: "Investidores e Proprietários",
    entrega: "Laudo de Avaliação (ABNT NBR 14.653) e fiscalização técnica da execução",
    icon: <FileCheck2 className="w-6 h-6"/>,
    oneLiner: "Valor justo e obra sob controle.",
    cta: "Solicitar avaliação",
  },
];

function Section({ id, children, className = "" }) {
  return (
    <section id={id} className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>{children}</section>
  );
}

export default function LandingAB() { /* v2 */
  const [form, setForm] = useState({ nome: "", email: "", telefone: "", mensagem: "" , consent: false});
  const utm = useUtmParams();

  const mensagemWhats = `Olá, ${COMPANY.engenheira.nome}! Sou ${form.nome || "(Seu nome)"}. Preciso de: [selecione: Vistoria de Imóvel Novo | Inspeção Predial | Assistência/Perícia | Avaliação]. Telefone: ${form.telefone}. ${form.mensagem}` + utm;
  const whatsHref = buildWhatsLink(mensagemWhats);

  function onSubmit(e) {
    e.preventDefault();
    // Abre WhatsApp com o texto do formulário + UTM
    window.open(whatsHref, "_blank");
  }

  function downloadCSV() {
    const headers = ["Módulo","Serviço","Público-Alvo","Entrega/Benefício"]; 
    const rows = servicos.map(s => [s.modulo, s.titulo, s.publico, s.entrega]);
    const csv = [headers.join(";"), ...rows.map(r => r.map(v => '"'+(v||"").replaceAll('"','""')+'"').join(";"))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "servicos_ab_engenharia.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0" style={{backgroundColor:"var(--color-background-light)", color:"var(--color-text-main)"}}>
      <style>{`:root{--color-primary-dark:#1C3B5E;--color-action-success:#2ECC71;--color-text-main:#34495E;--color-background-light:#FFFFFF;}`}</style>
      {/* HERO */}
      <div className="text-white" style={{backgroundColor:"var(--color-primary-dark)"}}>
        <Section className="pt-14 pb-10">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Engenharia Diagnóstica: Laudos, Perícias e Inspeções para a segurança do seu patrimônio.
              </motion.h1>
              <p className="mt-4 text-lg text-neutral-300">
                Especialista em Vistorias de Imóveis, Inspeção Predial, Assistência Técnica Judicial e Avaliação de Imóveis — atuação em {COMPANY.cidade}.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {badges.map((b,i)=> (
                  <span key={i} className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-sm">
                    {b.icon}
                    {b.label}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={whatsHref} target="_blank" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-white font-semibold shadow-lg hover:opacity-90" style={{backgroundColor:"var(--color-action-success)"}}>
                  <MessageCircle className="w-5 h-5 mr-2"/> Fale com a Engenheira
                </a>
                <a href="#contato" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold ring-1 ring-white/15">
                  Solicitar Orçamento <ChevronRight className="w-5 h-5 ml-1"/>
                </a>
              </div>
              <div className="mt-6 text-sm text-neutral-400">
                {COMPANY.engenheira.nome} • {COMPANY.engenheira.crea}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 shadow-2xl">
                <h3 className="text-lg font-semibold mb-4">Problemas que resolvemos</h3>
                <ul className="space-y-3 text-neutral-200">
                  <li className="flex gap-3"><ShieldCheck className="w-5 h-5 shrink-0 mt-1"/>Você precisa de segurança ao receber um imóvel?</li>
                  <li className="flex gap-3"><Building2 className="w-5 h-5 shrink-0 mt-1"/>Seu condomínio exige um check-up predial?</li>
                  <li className="flex gap-3"><Scale className="w-5 h-5 shrink-0 mt-1"/>Seu advogado necessita de um laudo técnico para um processo?</li>
                </ul>
                <div className="mt-5 p-4 rounded-2xl" style={{backgroundColor:"rgba(46,204,113,0.15)", boxShadow:"inset 0 0 0 1px rgba(46,204,113,0.30)"}}>
                  <p className="text-sm text-green-200"><strong>Proposta de valor:</strong> Análise técnica imparcial com documentação robusta (checklists ABNT/IBAPE, registro fotográfico e laudo assinado no CREA) para decisões seguras e válidas.</p>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </div>

      {/* SERVIÇOS */}
      <Section id="servicos" className="py-14">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded" style={{backgroundColor:"var(--color-primary-dark)"}}/>
          <h2 className="text-2xl sm:text-3xl font-bold">Nossos Serviços</h2>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
          {servicos.map((s, i) => (
            <div key={i} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-lg transition">
              <div className="flex items-center gap-3 mb-3">
                <span className="p-2 rounded-2xl bg-neutral-100">{s.icon}</span>
                <div>
                  <p className="text-xs uppercase tracking-wide text-neutral-500">{s.modulo}</p>
                  <h3 className="font-semibold leading-snug">{s.titulo}</h3>
                </div>
              </div>
              <p className="text-sm text-neutral-600 mb-2"><strong>Público:</strong> {s.publico}</p>
              <p className="text-sm text-neutral-700">{s.entrega}</p>
              <div className="mt-4 text-sm text-neutral-600">{s.oneLiner}</div>
              <div className="mt-5">
                <a href={buildWhatsLink(`Olá, ${COMPANY.engenheira.nome}! Tenho interesse em: ${s.titulo}.`)} target="_blank" className="inline-flex items-center gap-2 text-green-700 font-semibold">
                  {s.cta} <ChevronRight className="w-4 h-4"/>
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button onClick={downloadCSV} className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-white" style={{backgroundColor:"var(--color-primary-dark)"}}>
            <ClipboardCheck className="w-4 h-4"/> Exportar serviços (CSV)
          </button>
          <span className="text-sm text-neutral-500">Inclui ABNT NBR 15575, Diretrizes IBAPE e NBR 14.653 quando aplicável.</span>
        </div>
      </Section>

      {/* METODOLOGIA / DIFERENCIAIS */}
      <Section id="metodologia" className="py-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded" style={{backgroundColor:"var(--color-primary-dark)"}}/>
          <h2 className="text-2xl sm:text-3xl font-bold">Metodologia & Diferenciais</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><SearchCheck className="w-5 h-5"/> Análise in loco detalhada</h3>
            <p className="text-sm text-neutral-700">Vistoria técnica minuciosa com medições e registro fotográfico padronizado.</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><ClipboardCheck className="w-5 h-5"/> Checklists e Normas (ABNT/IBAPE)</h3>
            <p className="text-sm text-neutral-700">Aderência às normas aplicáveis (ex.: ABNT NBR 15575, Diretrizes IBAPE, NBR 14.653).</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2"><FileCheck2 className="w-5 h-5"/> Laudos Documentados</h3>
            <p className="text-sm text-neutral-700">Entrega de laudos assinados com ART, memorial fotográfico e recomendações de priorização.</p>
          </div>
        </div>
        <div className="mt-6 rounded-3xl border border-neutral-200 p-6" style={{backgroundColor:"var(--color-background-light)"}}>
          <p className="text-sm text-neutral-700"><strong>Compliance:</strong> linguagem técnica, imparcialidade e transparência. Laudo assinado por engenheiro com ART/CREA. Não prometemos resultados jurídicos; fornecemos evidências técnicas de qualidade pericial.</p>
        </div>
      </Section>

      {/* CTA INTERMEDIÁRIO */}
      <Section className="py-8">
        <div className="rounded-3xl text-white p-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4" style={{backgroundColor:"var(--color-primary-dark)"}}>
          <div>
            <h3 className="text-xl font-semibold">Não corra riscos com seu patrimônio.</h3>
            <p className="text-neutral-300">Solicite um orçamento ou consultoria técnica agora.</p>
          </div>
          <div className="flex gap-3">
            <a href={whatsHref} target="_blank" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-action-success)"}}>
              <MessageCircle className="w-5 h-5"/> WhatsApp
            </a>
            <a href="#contato" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold ring-1 ring-white/20">
              Formulário
            </a>
          </div>
        </div>
      </Section>

      {/* CONTATO */}
      <Section id="contato" className="py-14">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Fale com a Engenheira</h2>
            <p className="text-neutral-700 mb-6">Atendimento técnico para proprietários, síndicos, construtoras e advogados. Envie sua demanda — retornamos rapidamente.</p>

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome</label>
                <input required autoComplete="name" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-neutral-900" placeholder="Seu nome"/>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">E-mail</label>
                  <input type="email" autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-neutral-900" placeholder="voce@exemplo.com"/>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <input required type="tel" inputMode="tel" autoComplete="tel" value={form.telefone} onChange={e=>setForm({...form,telefone:e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-neutral-900" placeholder="(xx) xxxxx-xxxx"/>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Mensagem</label>
                <textarea required value={form.mensagem} onChange={e=>setForm({...form,mensagem:e.target.value})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white px-3 py-3 h-32 outline-none focus:ring-2 focus:ring-neutral-900" placeholder="Descreva brevemente sua necessidade técnica"/>
              </div>
              <label className="flex items-start gap-2 text-sm text-neutral-700">
                <input type="checkbox" checked={form.consent} onChange={e=>setForm({...form,consent:e.target.checked})} required className="mt-1"/>
                <span>
                  Concordo com o tratamento dos meus dados para fins de contato e proposta (LGPD). <span className="text-neutral-500">Podemos enviar comunicações relacionadas ao serviço.</span>
                </span>
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="submit" className="inline-flex items-center justify-center rounded-2xl px-5 py-3 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-primary-dark)"}}>
                  Enviar no WhatsApp <ChevronRight className="w-5 h-5 ml-1"/>
                </button>
                <a href={`mailto:${COMPANY.email}?subject=${encodeURIComponent("Contato — Engenharia Diagnóstica")}&body=${encodeURIComponent(mensagemWhats)}`} className="inline-flex items-center justify-center rounded-2xl px-5 py-3 bg-white ring-1 ring-neutral-300 text-neutral-900 font-semibold">
                  Enviar por E-mail
                </a>
              </div>
              <p className="text-xs text-neutral-500">Tempo médio de resposta no horário comercial: 15–45 min.</p>
            </form>
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-6 h-fit">
            <h3 className="font-semibold mb-4">Dados da Profissional</h3>
            <ul className="space-y-2 text-sm text-neutral-700">
              <li className="flex items-center gap-2"><BadgeCheck className="w-4 h-4"/> {COMPANY.engenheira.nome}</li>
              <li className="flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> {COMPANY.engenheira.crea}</li>
              <li className="flex items-center gap-2"><ClipboardCheck className="w-4 h-4"/> {COMPANY.engenheira.especialidades.join(" • ")}</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4"/> {COMPANY.cidade}</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4"/> <a className="underline" href="tel:+559481646040">Ligar agora</a></li>
              <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4"/> <a className="underline" href={buildWhatsLink("Olá! Vim pelo site e gostaria de informações.")} target="_blank">WhatsApp</a></li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4"/> <a className="underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a></li>
              {COMPANY.site && <li className="flex items-center gap-2"><Construction className="w-4 h-4"/> <a className="underline" href={COMPANY.site} target="_blank">{COMPANY.site}</a></li>}
            </ul>
            <div className="mt-6 rounded-2xl p-4 text-xs" style={{backgroundColor:"var(--color-background-light)", color:"#5f6b7a"}}>
              <p><strong>Atenção:</strong> Os laudos seguem metodologia pericial, com ART quando aplicável. A contratação não garante êxito jurídico; fornece embasamento técnico imparcial.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* STICKY CTA MOBILE */}
      <div className="fixed md:hidden bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-neutral-200 p-3 flex items-center justify-between gap-3">
        <a href={whatsHref} className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-3 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-action-success)"}}>WhatsApp</a>
        <a href="#contato" className="flex-1 inline-flex items-center justify-center rounded-xl px-4 py-3 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-primary-dark)"}}>Orçamento</a>
      </div>

      {/* FAQ (opcional) */}
      <Section id="faq" className="py-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-1.5 h-6 rounded" style={{backgroundColor:"var(--color-primary-dark)"}}/>
          <h2 className="text-2xl sm:text-3xl font-bold">Perguntas Frequentes</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <h4 className="font-semibold mb-2">Quais normas seguem os laudos?</h4>
            <p className="text-sm text-neutral-700">Aplicamos ABNT NBR 15575 (desempenho), Diretrizes IBAPE para Inspeção Predial e ABNT NBR 14.653 para avaliações, além de outras normas correlatas.</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <h4 className="font-semibold mb-2">Atendem somente em {COMPANY.cidade}?</h4>
            <p className="text-sm text-neutral-700">Base em {COMPANY.cidade}. Avaliamos deslocamentos para municípios próximos mediante agenda e custos logísticos.</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <h4 className="font-semibold mb-2">Em quanto tempo recebo o laudo?</h4>
            <p className="text-sm text-neutral-700">De acordo com o escopo e a complexidade. Estimativa informada na proposta, com priorização de pontos críticos.</p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-5">
            <h4 className="font-semibold mb-2">Oferecem orçamento sem compromisso?</h4>
            <p className="text-sm text-neutral-700">Sim. Envie WhatsApp ou formulário com sua necessidade e retornamos rapidamente com orientações iniciais.</p>
          </div>
        </div>
      </Section>

      {/* RODAPÉ */}
      <footer className="border-t border-neutral-200" style={{backgroundColor:"var(--color-background-light)"}}>
        <Section className="py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <p className="font-semibold">Pronto para começar?</p>
              <p className="text-neutral-600">Converse com a Engenheira agora mesmo.</p>
            </div>
            <div className="flex gap-3">
              <a href={whatsHref} target="_blank" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-action-success)"}}>
                <MessageCircle className="w-5 h-5"/> WhatsApp
              </a>
              <a href="#contato" className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-white font-semibold hover:opacity-90" style={{backgroundColor:"var(--color-primary-dark)"}}>
                Solicitar Orçamento
              </a>
            </div>
          </div>
          <div className="mt-6 text-xs text-neutral-500">
            © {new Date().getFullYear()} {COMPANY.nome}. Todos os direitos reservados. • {COMPANY.engenheira.crea}
          </div>
        </Section>
      </footer>

      {/* JSON-LD Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: COMPANY.nome,
        areaServed: COMPANY.cidade,
        url: COMPANY.site,
        telephone: COMPANY.whatsNumero,
        email: COMPANY.email,
        sameAs: [COMPANY.instagram, COMPANY.site].filter(Boolean),
        founder: COMPANY.engenheira.nome,
        employee: [{"@type":"Person", name: COMPANY.engenheira.nome, hasCredential: COMPANY.engenheira.crea}],
        serviceType: servicos.map(s=>s.titulo),
      }) }} />
    </div>
  );
}
