import { soapRequest } from "./antaq";

export async function getVersion(): Promise<string> {
  const parsed = await soapRequest("GetVersion");

  // Loga a resposta completa da API para depuração
  console.log("Resposta completa de GetVersion:", parsed);

  const version = parsed.Envelope.Body.GetVersionResponse.GetVersionResult;

  // Mostra a versão retornada pela API
  console.log("Versão da API:", version);

  return version;
}
