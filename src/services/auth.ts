import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_BASE = 'https://sfismobile.antaq.gov.br/AntaqService/Services.asmx/'; // igual ao util.js PRD/DES que vocês usam

export type Usuario = {
    IDUsuario: number;
    NOLoginUsuario: string;
    EEFuncionario: string;
    NRMatricula: string;
    servidor?: {
        IDPerfilFiscalizacao?: string; // "1" = fiscalização
        NOUsuario?: string;
        SGUnidade?: string;
        // ...outros campos do XML/JSON
    };
    // ...demais campos
};

async function parseResponse(data: any): Promise<Usuario> {
    // 1) Primeiro tenta o padrão ASMX JSON: { d: {...usuario...} }
    if (data?.d) return data.d as Usuario;

    // 2) Se vier XML (SOAP), converte (você tem fast-xml-parser no projeto)
    try {
        const { XMLParser } = await import('fast-xml-parser');
        const parser = new XMLParser({ ignoreAttributes: false });
        const xml = typeof data === 'string' ? data : data?.toString?.() ?? '';
        const obj = parser.parse(xml);

        // Caminho típico no SOAP mostrado por você:
        // soap:Envelope > soap:Body > UsuarioAutenticarResponse > UsuarioAutenticarResult
        const result =
            obj?.['soap:Envelope']?.['soap:Body']?.UsuarioAutenticarResponse?.UsuarioAutenticarResult;

        if (result) {
            // mapeia campos relevantes ao shape Usuario
            return {
                IDUsuario: Number(result.IDUsuario),
                NOLoginUsuario: result.NOLoginUsuario,
                EEFuncionario: result.EEFuncionario,
                NRMatricula: result.NRMatricula,
                servidor: {
                    IDPerfilFiscalizacao: String(result?.servidor?.IDPerfilFiscalizacao ?? ''),
                    NOUsuario: result?.servidor?.NOUsuario,
                    SGUnidade: result?.servidor?.SGUnidade,
                },
            };
        }
    } catch {}

    throw new Error('Formato de resposta inesperado do serviço');
}

export async function autenticar(loginUsuario: string, senhaUsuario: string) {
    const resp = await axios.post(
        SERVICE_BASE + 'UsuarioAutenticar',
        { loginUsuario, senhaUsuario },
        { headers: { 'Content-Type': 'application/json' } }
    );

    const usuario = await parseResponse(resp.data);

    // persiste igual ao Cordova (arUsuario / arManterConectado)
    await AsyncStorage.setItem('arUsuario', JSON.stringify(usuario));
    // opcional: manter conectado com data de logoff, como no legado
    // await AsyncStorage.setItem('arManterConectado', JSON.stringify({ manterConectado: 'F', datalogoff: '' }));

    return usuario;
}
