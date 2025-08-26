import { soapRequest } from "./antaq";

export async function getVersion(): Promise<string> {
  const parsed = await soapRequest("GetVersion");
  return parsed.Envelope.Body.GetVersionResponse.GetVersionResult;
}
