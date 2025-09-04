import axios, { AxiosError } from "axios";
import { create } from "xmlbuilder2";
import { XMLParser } from "fast-xml-parser";

/** URL padrão – SEMPRE https */
const DEFAULT_SERVICE_URL = "https://sfismobile.antaq.gov.br/AntaqService/Services.asmx";

/** URL atual utilizada pelo cliente (pode ser trocada via setServiceUrl) */
let SERVICE_URL = sanitizeServiceUrl(DEFAULT_SERVICE_URL);

/** Parser XML → JSON mantendo tags/atributos úteis */
const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

/** --------------------------------------------------------
 *  Sanitização/normalização da URL (evita https://https://,
 *  adiciona protocolo se faltar, colapsa //, força https
 *  para domínios *.antaq.gov.br)
 *  ------------------------------------------------------ */
export function sanitizeServiceUrl(u: string): string {
  let s = (u || "").trim();

  // remover protocolos duplicados do começo (ex.: "https://https://")
  s = s.replace(/^(https?:\/\/)+/i, (m) => (m.includes("https://") ? "https://" : "http://"));

  // adicionar protocolo se faltar
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;

  // colapsar // extras após o host
  s = s.replace(/([^:]\/)\/+/g, "$1");

  // tentar ajustar via WHATWG URL (se disponível no RN)
  try {
    const uo = new URL(s);
    // para *.antaq.gov.br sempre forçar https
    if (/\.antaq\.gov\.br$/i.test(uo.hostname) && uo.protocol === "http:") {
      uo.protocol = "https:";
      s = uo.toString();
    }
    // remover barra final desnecessária
    if (uo.pathname.endsWith("/") && !/\.asmx\/$/i.test(uo.pathname)) {
      uo.pathname = uo.pathname.replace(/\/+$/, "");
      s = uo.toString();
    }
  } catch {
    // se a URL API não estiver disponível, seguimos com a versão "sanitizada" por regex
  }

  return s;
}

/** Seta a URL do serviço em runtime com sanitização */
export function setServiceUrl(next: string) {
  SERVICE_URL = sanitizeServiceUrl(next);
  console.log("[SOAP] SERVICE_URL ajustada para:", SERVICE_URL);
}

/** Retorna a URL atual (útil para debug/UI) */
export function getServiceUrl() {
  return SERVICE_URL;
}

/** --------------------------------------------------------
 *  Helpers de erro / retry
 *  ------------------------------------------------------ */
function explainAxiosError(err: unknown, tag = "ERR") {
  const ax = err as AxiosError;
  console.warn(`[${tag}] message:`, ax.message);
  // @ts-ignore
  if ((ax as any)?.cause) console.warn(`[${tag}] cause:`, (ax as any).cause);
  try {
    // @ts-ignore
    console.warn(`[${tag}] toJSON:`, JSON.stringify(ax.toJSON?.(), null, 2));
  } catch {}
  if (ax.response) {
    console.warn(`[${tag}] status:`, ax.response.status);
    console.warn(`[${tag}] headers:`, ax.response.headers);
    const data = ax.response.data as any;
    console.warn(`[${tag}] body:`, typeof data === "string" ? data.slice(0, 400) : data);
  }
}

function isNetworkErr(e: any) {
  const msg = String(e?.message || "").toLowerCase();
  return e?.code === "ERR_NETWORK" || msg.includes("network error") || msg.includes("network request failed");
}

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function withRetry<T>(fn: () => Promise<T>, opts = { tries: 3, delays: [250, 600] }) {
  let lastErr: any;
  for (let i = 0; i < opts.tries; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      const isNet = isNetworkErr(e);
      const isLast = i === opts.tries - 1;
      if (!isNet || isLast) throw e;
      const d = opts.delays[Math.min(i, opts.delays.length - 1)];
      console.warn(`[NET] Retry ${i + 1}/${opts.tries - 1} em ${d}ms…`);
      await sleep(d);
    }
  }
  throw lastErr;
}

/** --------------------------------------------------------
 *  Construção do envelope SOAP
 *  ------------------------------------------------------ */
function buildEnvelope(action: string, params?: Record<string, any>) {
  const root = create({ version: "1.0" })
      .ele("soap:Envelope", {
        "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
        "xmlns:tem": "http://tempori.org",
      })
      .ele("soap:Header")
      .up()
      .ele("soap:Body")
      .ele(`tem:${action}`);

  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v === null || v === undefined) root.ele(`tem:${k}`);
      else root.ele(`tem:${k}`).txt(String(v));
    }
  }
  return root.end();
}

/** --------------------------------------------------------
 *  POST SOAP com:
 *   - URL sanitizada
 *   - retry para ERR_NETWORK
 *   - fallback 1.2 → 1.1
 *   - suporte a AbortSignal (dev: Fast Refresh / unmount)
 *  ------------------------------------------------------ */
async function axiosSoapPost(action: string, xmlBody: string, signal?: AbortSignal): Promise<string> {
  let url = sanitizeServiceUrl(SERVICE_URL);

  const post12 = () =>
      axios.post<string>(url, xmlBody, {
        transformRequest: (v) => v,
        transitional: { forcedJSONParsing: false },
        responseType: "text",
        timeout: 30000,
        signal,
        headers: {
          "Content-Type": `application/soap+xml; charset=utf-8; action="http://tempori.org/${action}"`,
          Accept: "application/soap+xml",
        },
      });

  const post11 = () =>
      axios.post<string>(url, xmlBody, {
        transformRequest: (v) => v,
        transitional: { forcedJSONParsing: false },
        responseType: "text",
        timeout: 30000,
        signal,
        headers: {
          "Content-Type": "text/xml; charset=utf-8",
          SOAPAction: `"http://tempori.org/${action}"`,
          Accept: "text/xml",
        },
      });

  // 1) Tenta SOAP 1.2 com retry para problemas de rede
  try {
    const r12 = await withRetry(() => post12());
    console.log("[SOAP12] status:", r12.status);
    return r12.data;
  } catch (e12) {
    explainAxiosError(e12, "SOAP12");

    // Se foi erro de rede, tentar 1 tentativa curta em 1.1 às vezes ajuda
    if (isNetworkErr(e12)) {
      try {
        const r11net = await withRetry(() => post11(), { tries: 2, delays: [300] });
        console.log("[SOAP11] status:", r11net.status);
        return r11net.data;
      } catch (e11net) {
        explainAxiosError(e11net, "SOAP11(net)");
        throw e11net;
      }
    }

    // Se não foi rede (ex.: 415/500/etc.), tenta fallback normal para 1.1 sem retry
    try {
      const r11 = await post11();
      console.log("[SOAP11] status:", r11.status);
      return r11.data;
    } catch (e11) {
      explainAxiosError(e11, "SOAP11");
      throw e11;
    }
  }
}

/** --------------------------------------------------------
 *  API pública
 *  ------------------------------------------------------ */
export type SoapRequestOptions = {
  signal?: AbortSignal;   // para cancelamento seguro em dev/unmount
  urlOverride?: string;   // se quiser usar outra URL apenas nessa chamada
};

// @ts-ignore
export async function soapRequest(action: string, params?: Record<string, any>, opts?: SoapRequestOptions) {
  // override opcional de URL por chamada
  if (opts?.urlOverride) {
    const prev = SERVICE_URL;
    try {
      setServiceUrl(opts.urlOverride);
      // @ts-ignore
      const out = await soapRequest(action, params, { signal: opts.signal }); // chama recursivo sem override
      return out;
    } finally {
      SERVICE_URL = prev; // restaura URL global
    }
  }

  const xml = buildEnvelope(action, params);
  console.log("[SOAP] body >>>\n", xml);

  const raw = await axiosSoapPost(action, xml, opts?.signal);
  console.log("[SOAP] raw(xml) <<<\n", (raw || "").slice(0, 800));

  const parsed = parser.parse(raw);
  console.log("[SOAP] parsed(json) <<<\n", JSON.stringify(parsed, null, 2));
  return parsed;
}

function pick<T = any>(obj: any, paths: string[]): T | undefined {
  for (const p of paths) {
    const parts = p.split(".");
    let cur: any = obj,
        ok = true;
    for (const k of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, k)) cur = cur[k];
      else {
        ok = false;
        break;
      }
    }
    if (ok) return cur as T;
  }
  return undefined;
}

export function extractSoapResult(parsed: any, action: string): any {
  const responseTag = `${action}Response`;
  const resultTag = `${action}Result`;
  const candidates = [
    `Envelope.Body.${responseTag}.${resultTag}`,
    `Envelope.Body.tem:${responseTag}.tem:${resultTag}`,
    `soap:Envelope.soap:Body.${responseTag}.${resultTag}`,
    `soap:Envelope.soap:Body.tem:${responseTag}.tem:${resultTag}`,
    `${responseTag}.${resultTag}`,
  ];
  return pick(parsed, candidates);
}

/** Utilidade de conveniência para testes rápidos */
export async function getVersion(opts?: SoapRequestOptions) {
  const parsed = await soapRequest("GetVersion", undefined, opts);
  return String(extractSoapResult(parsed, "GetVersion") ?? "");
}