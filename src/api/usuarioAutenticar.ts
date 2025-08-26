import { soapRequest } from "./antaq";

export async function usuarioAutenticar(
  usuario: string,
  senha: string
): Promise<string> {
  const parsed = await soapRequest("UsuarioAutenticar", {
    pUsuario: usuario,
    pSenha: senha,
  });
  return parsed.Envelope.Body.UsuarioAutenticarResponse.UsuarioAutenticarResult;
}
