import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Switch,
    Text,
    TextInput,
    View,
    StyleSheet,
    // Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as Application from "expo-application";

// API (segue o padrão soapRequest ≥ {servidor, ‘token’})
import { usuarioAutenticar } from "@/src/api/usuarioAutenticar";

// Sessão segura (14 dias) – use o seu session.ts
import { saveSession, loadSession } from "@/src/services/session";

export default function LoginScreen() {
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [keepConnected, setKeepConnected] = useState(false);
    const [checking, setChecking] = useState(true);
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState<string | null>(null);

    const version = [
        Constants.expoConfig?.version ?? Application.nativeApplicationVersion ?? "dev",
        Application.nativeBuildVersion ? `(${Application.nativeBuildVersion})` : ""
    ].filter(Boolean).join(" ");

    // 1) Autologin se existir sessão válida
    useEffect(() => {
        (async () => {
            try {
                const s = await loadSession(); // a sua função deve invalidar se expirou
                if (s?.token) {
                    router.replace("/HomeFiscalizacao");
                    return;
                }
            } catch (e) {
                // silencioso
            } finally {
                setChecking(false);
            }
        })();
    }, [router]);

    // 2) Handler Entrar
    async function onEntrar() {
        setErro(null);
        setLoading(true);
        try {
            if (!usuario || !senha) {
                setErro("Preencha usuário e senha.");
                return;
            }
            const { token, servidor } = await usuarioAutenticar(usuario, senha);

            // mantém conectado 14 dias
            if (keepConnected) {
                await saveSession({ token, usuario: servidor }, true, 14);
            }

            router.replace("/HomeFiscalizacao"); // substitui a rota atual (pós-login)
        } catch (e: any) {
            setErro(
                e?.message?.toString?.() ??
                "Falha ao autenticar. Verifique suas credenciais."
            );
        } finally {
            setLoading(false);
        }
    }

    if (checking) {
        return (
            <View style={[styles.background, styles.center]}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.background}>
            <LinearGradient
                colors={["#0B3B52", "#071F2B"]}
                style={StyleSheet.absoluteFillObject}
            />

            <KeyboardAvoidingView
                style={styles.flex1}
                behavior={Platform.select({ ios: "padding", android: undefined }) || undefined}
            >
                <View style={styles.container}>
                    {/* Descomente se tiver um logo */}
                    {/* <Image
            source={require("../../assets/icon/logo.png")}
            resizeMode="contain"
            style={styles.logo}
          /> */}

                    <Text style={styles.title}>Entrar</Text>

                    <View style={styles.form}>
                        <TextInput
                            placeholder="Usuário / Matrícula"
                            placeholderTextColor="#9FB3C1"
                            value={usuario}
                            onChangeText={setUsuario}
                            style={styles.input}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="#9FB3C1"
                            value={senha}
                            onChangeText={setSenha}
                            style={styles.input}
                            secureTextEntry
                            returnKeyType="go"
                            onSubmitEditing={onEntrar}
                        />

                        <View style={styles.row}>
                            <Text style={styles.keepText}>MANTER CONECTADO (14 dias)</Text>
                            <Switch value={keepConnected} onValueChange={setKeepConnected} />
                        </View>

                        {erro ? <Text style={styles.error}>{erro}</Text> : null}

                        <Pressable
                            onPress={onEntrar}
                            disabled={loading || !usuario || !senha}
                            style={({ pressed }) => [
                                styles.button,
                                (loading || !usuario || !senha) && styles.buttonDisabled,
                                pressed && !(loading || !usuario || !senha) && styles.buttonPressed,
                            ]}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Entrar</Text>
                            )}
                        </Pressable>
                    </View>

                    <Text style={styles.version}>v{version}</Text>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#071F2B" },
    flex1: { flex: 1 },
    center: { alignItems: "center", justifyContent: "center" },

    container: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
    },

    logo: { width: 176, height: 96, marginBottom: -4 },

    title: {
        color: "#E6F1F5",
        fontSize: 22,
        fontWeight: "700",
        letterSpacing: 0.3,
        marginBottom: -4,
    },

    form: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 14,
        padding: 20,
        backgroundColor: "rgba(255,255,255,0.06)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.16)",
        gap: 12,
    },

    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 12,
        color: "#FFFFFF",
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
    },

    row: {
        marginTop: 4,
        marginBottom: 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    keepText: {
        color: "rgba(230,241,245,0.9)",
        fontSize: 12,
        letterSpacing: 0.3,
    },

    error: {
        color: "#FCA5A5",
        backgroundColor: "rgba(239,68,68,0.08)",
        borderColor: "rgba(239,68,68,0.32)",
        borderWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 10,
        fontSize: 12.5,
    },

    button: {
        height: 50,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0EA5E9",
        marginTop: 6,
    },

    buttonPressed: { opacity: 0.9 },
    buttonDisabled: { opacity: 0.6 },

    buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

    version: { color: "rgba(230,241,245,0.8)", marginTop: 8 },
});
