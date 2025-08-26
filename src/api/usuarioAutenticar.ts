import { soapRequest } from "./antaq";

/** Estrutura típica que volta do serviço (ajuste/estenda se necessário) */
export type Servidor = {
  IDUsuario?: string | number;
  NOLoginUsuario?: string;
  EEFuncionario?: string;
  NRMatricula?: string;
  STAtivo?: string | null;
  Token?: string;
  [k: string]: any;
};

export type AuthResult = {
  servidor: Servidor;
  token: string;
};

/**
 * Autentica usando o serviço SOAP e retorna um objeto normalizado
 * no padrão do projeto (usando soapRequest de ./antaq).
 */
export async function usuarioAutenticar(
    usuario: string,
    senha: string
): Promise<AuthResult> {
  const parsed = await soapRequest("UsuarioAutenticar", {
    pUsuario: usuario,
    pSenha: senha,
  });

  // Mesmo caminho usado no getVersion.ts, só que para UsuarioAutenticar:
  const result =
      parsed?.Envelope?.Body?.UsuarioAutenticarResponse?.UsuarioAutenticarResult;

  // Alguns ambientes retornam os campos já na raiz; outros aninham em <servidor>
  const servidor: Servidor =
      (result?.servidor as Servidor) ?? (result as Servidor) ?? {};

  // Gera um token consistente (usa Token se existir; senão algum identificador estável)
  const token = String(
      servidor.Token ??
      servidor.IDUsuario ??
      servidor.NOLoginUsuario ??
      "auth-ok"
  );

  return { servidor, token };
}
