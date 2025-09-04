import axios from "axios";
import { create } from "xmlbuilder2";
import { XMLParser } from "fast-xml-parser";

const DEFAULT_URL = "https://sfismobile.antaq.gov.br/AntaqService/Services.asmx";
let SERVICE_URL = DEFAULT_URL;

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

// --- URL ---

function sanitizeUrl(u: string): string {
  let s = (u || "").trim();
  s = s.replace(/^(https?:\/\/)+/i, (m) => (m.includes("https://") ? "https://" : "http://")); // remove duplicado
  if (!/^https?:\/\//i.test(s)) s = "https://" + s;
  s = s.replace(/([^:]\/)\/+/g, "$1"); // colapsa //
  try {
    const uo = new URL(s);
    if (/\.antaq\.gov\.br$/i.test(uo.hostname)) uo.protocol = "https:"; // força https pra ANTAQ
    s = uo.toString();
  } catch { /* ok */ }
  return s;
}

function validateUrl(u: string): string {
  const s = sanitizeUrl(u);
  let url: URL;
  try { url = new URL(s); } catch { throw new Error(`URL inválida: ${u}`); }
  const host = url.hostname;
  const hostOk =
      host === "localhost" ||
      /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ||      // IPv4
      /^\[?[a-fA-F0-9:]+\]?$/.test(host) ||        // IPv6
      host.includes(".");                          // domínio
  if (!hostOk) throw new Error(`Host inválido: ${host}`);
  return url.toString();
}

export function setServiceUrl(next: string) {
  SERVICE_URL = validateUrl(next);
  console.log("[SOAP] URL =", SERVICE_URL);
}

export function getServiceUrl() {
  return SERVICE_URL;
}

// --- util ---

function isNetworkErr(e: any) {
  const msg = String(e?.message || "").toLowerCase();
  return e?.code === "ERR_NETWORK" || msg.includes("network error") || msg.includes("network request failed");
}

function isCanceledErr(e: any) {
  const msg = String(e?.message || "").toLowerCase().trim();
  return e?.code === "ERR_CANCELED" || e?.name === "CanceledError" || msg === "canceled";
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function withRetry<T>(fn: () => Promise<T>, tries = 3, delays = [250, 600]) {
  let err: any;
  for (let i = 0; i < tries; i++) {
    try { return await fn(); } catch (e) {
      err = e;
      if (isCanceledErr(e)) throw e;                 // não retenta cancelado
      if (!isNetworkErr(e) || i === tries - 1) throw e;
      const d = delays[Math.min(i, delays.length - 1)];
      console.warn(`[NET] retry ${i + 1}/${tries - 1} em ${d}ms…`);
      await sleep(d);
    }
  }
  throw err;
}

// --- SOAP core ---

function buildEnvelope(action: string, params?: Record<string, any>) {
  const root = create({ version: "1.0" })
      .ele("soap:Envelope", {
        "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
        "xmlns:tem": "http://tempori.org",
      })
      .ele("soap:Header").up()
      .ele("soap:Body")
      .ele(`tem:${action}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      v == null ? root.ele(`tem:${k}`) : root.ele(`tem:${k}`).txt(String(v));
    }
  }
  return root.end();
}

async function post12(url: string, action: string, xml: string, signal?: AbortSignal) {
  return axios.post<string>(url, xml, {
    transformRequest: (v) => v,
    transitional: { forcedJSONParsing: false },
    responseType: "text",
    timeout: 30000,
    signal,
    headers: {
      "Content-Type": `application/soap+xml; charset=utf-8; action="http://tempori.org/${action}"`,
      "Accept": "application/soap+xml",
    },
  });
}

async function post11(url: string, action: string, xml: string, signal?: AbortSignal) {
  return axios.post<string>(url, xml, {
    transformRequest: (v) => v,
    transitional: { forcedJSONParsing: false },
    responseType: "text",
    timeout: 30000,
    signal,
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": `"http://tempori.org/${action}"`,
      "Accept": "text/xml",
    },
  });
}

async function axiosSoapPost(action: string, xmlBody: string, signal?: AbortSignal): Promise<string> {
  const url = validateUrl(SERVICE_URL);

  // 1) SOAP 1.2 com retry só para erro de rede
  try {
    const r12 = await withRetry(() => post12(url, action, xmlBody, signal));
    return r12.data;
  } catch (e12) {
    if (isCanceledErr(e12)) throw e12; // nada de fallback se cancelou
    // 2) Fallback simples para SOAP 1.1 (sem retry)
    const r11 = await post11(url, action, xmlBody, signal);
    return r11.data;
  }
}

// --- API pública ---

export type SoapRequestOptions = { signal?: AbortSignal };

export async function soapRequest(action: string, params?: Record<string, any>, opts?: SoapRequestOptions) {
  const xml = buildEnvelope(action, params);
  const raw = await axiosSoapPost(action, xml, opts?.signal);
  return parser.parse(raw);
}

// helper para extrair `${Action}Result`
function pick(obj: any, paths: string[]): any {
  for (const p of paths) {
    const parts = p.split(".");
    let cur = obj, ok = true;
    for (const k of parts) {
      if (cur && Object.prototype.hasOwnProperty.call(cur, k)) cur = cur[k]; else { ok = false; break; }
    }
    if (ok) return cur;
  }
  return undefined;
}

export function extractSoapResult(parsed: any, action: string) {
  const R = `${action}Response`, X = `${action}Result`;
  return pick(parsed, [
    `Envelope.Body.${R}.${X}`,
    `Envelope.Body.tem:${R}.tem:${X}`,
    `${R}.${X}`,
  ]);
}

// atalho de teste
export async function getVersion(opts?: SoapRequestOptions) {
  const parsed = await soapRequest("GetVersion", undefined, opts);
  return String(extractSoapResult(parsed, "GetVersion") ?? "");
}
