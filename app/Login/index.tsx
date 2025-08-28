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
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import * as Application from "expo-application";

// API (segue o padrão soapRequest ≥ {servidor, ‘token’})
import { usuarioAutenticar } from "@/src/api/usuarioAutenticar";

// Sessão segura (14 dias) – use o seu session.ts
import { saveSession, loadSession } from "@/src/services/session";
import styles from './styles';
import Icon from '@/src/components/Icon';
import theme from '@/src/theme';

export default function LoginScreen() {
    const router = useRouter();

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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

            // Confirma no console que o login ocorreu com sucesso
            console.log("Token recebido:", token);
            //console.log("Informações do usuário:", servidor);

            // salva sessão com ou sem manter conectado
            await saveSession({ token, usuario: servidor }, keepConnected, 14);

            router.replace({ pathname: "/HomeFiscalizacao", params: { showReleases: '1' } }); // substitui a rota atual (pós-login)
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
        <SafeAreaView style={styles.background}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
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
                        <View style={styles.inputGroup}>
                            <View style={{ marginRight: 8 }}>
                                <Icon name="person" size={24} color="#9FB3C1" />
                            </View>
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
                        </View>

                        <View style={styles.inputGroup}>
                            <TextInput
                                placeholder="Senha"
                                placeholderTextColor="#9FB3C1"
                                value={senha}
                                onChangeText={setSenha}
                                style={styles.input}
                                secureTextEntry={!showPassword}
                                returnKeyType="go"
                                onSubmitEditing={onEntrar}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                accessibilityRole="button"
                                accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                style={{ marginLeft: 8 }}
                            >
                                <Icon
                                    name={showPassword ? 'visibility-off' : 'visibility'}
                                    size={24}
                                    color="#9FB3C1"
                                />
                            </Pressable>
                        </View>

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
        </SafeAreaView>
    );
}

