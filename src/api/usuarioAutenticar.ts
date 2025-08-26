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
    loginUsuario: usuario,
    senhaUsuario: senha,
  });

  // Exibe toda a resposta da API para conferência
  console.log("Resposta completa de UsuarioAutenticar:", parsed);

  // Mesmo caminho usado no getVersion.ts, só que para UsuarioAutenticar:
  const result =
      parsed?.Envelope?.Body?.UsuarioAutenticarResponse?.UsuarioAutenticarResult;

  // Mostra o resultado normalizado extraído da resposta
  console.log("Resultado extraído:", result);

  // Alguns ambientes retornam os campos já na raiz; outros aninham em <servidor>
  const servidor: Servidor =
      (result?.servidor as Servidor) ?? (result as Servidor) ?? {};

  // Detalha as informações do servidor retornadas pela API
  console.log("Dados do servidor:", servidor);

  // Gera um token consistente (usa Token se existir; senão algum identificador estável)
  const token = String(
      servidor.Token ??
      servidor.IDUsuario ??
      servidor.NOLoginUsuario ??
      "auth-ok"
  );

  // Confirma o token que será utilizado
  console.log("Token gerado:", token);

  return { servidor, token };
}
