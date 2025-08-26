import axios from "axios";
import { create } from "xmlbuilder2";
import { XMLParser } from "fast-xml-parser";

// DES
const SERVICE_URL = "https://sfismobile.antaq.gov.br/AntaqService/Services.asmx";

// HMG TRAINEE
// const SERVICE_URL = "https://10.111.2.68/AntaqServiceTRN/Services.asmx";

// MAQUINA CRISPIMM
// const SERVICE_URL = 'http://10.212.134.8/AntaqService/Services.asmx/';

// PRD NOVO;
// const SERVICE_URL = "https://web3.antaq.gov.br/AntaqService/Services.asmx";

const parser = new XMLParser({ ignoreAttributes: false, removeNSPrefix: true });

function buildEnvelope(action: string, params?: Record<string, string>) {
  const root = create({ version: "1.0" })
    .ele("soap:Envelope", {
      "xmlns:soap": "http://www.w3.org/2003/05/soap-envelope",
      "xmlns:tem": "http://tempori.org",
    })
    .ele("soap:Body")
    .ele(`tem:${action}`);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      root.ele(`tem:${key}`).txt(value);
    }
  }

  return root.end();
}

export async function soapRequest(
  action: string,
  params?: Record<string, string>
) {
  const xml = buildEnvelope(action, params);
  const { data } = await axios.post(SERVICE_URL, xml, {
    headers: { "Content-Type": "application/soap+xml; charset=utf-8" },
  });
  return parser.parse(data);
}
