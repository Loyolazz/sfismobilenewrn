import { XMLParser } from 'fast-xml-parser';

export type MensagemPush = {
  IDMensagemPush: number;
  DSTituloMensagemPush: string;
  DSMensagemPush: string;
  DTEnvio: string;
  STAtivo: string;
  TPDestinatario: string;
};

export async function listarMensagensPush(idPerfil: number): Promise<MensagemPush[]> {
  const envelope = `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:tem="http://tempori.org">
    <soap:Header/>
    <soap:Body>
      <tem:ListarMensagensPush>
        <tem:IDPerfilFiscalizacao>${idPerfil}</tem:IDPerfilFiscalizacao>
      </tem:ListarMensagensPush>
    </soap:Body>
  </soap:Envelope>`;

  const response = await fetch('https://sfismobile.antaq.gov.br/AntaqService/Services.asmx?op=ListarMensagensPush', {
    method: 'POST',
    headers: { 'Content-Type': 'application/soap+xml; charset=utf-8' },
    body: envelope,
  });
  const text = await response.text();

  const parser = new XMLParser({ ignoreAttributes: false });
  const json = parser.parse(text);
  const result = json['soap:Envelope']?.['soap:Body']?.ListarMensagensPushResponse?.ListarMensagensPushResult?.MensagemPush;
  if (!result) return [];
  return Array.isArray(result) ? result : [result];
}
