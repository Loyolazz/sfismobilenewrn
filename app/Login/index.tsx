import { useState } from "react";
import {
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
    StyleSheet,
} from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { usuarioAutenticar } from "../../src/api/usuarioAutenticar";

export default function Login() {
    const router = useRouter();
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);

    const version =
        Constants.expoConfig?.version ??
        Constants.manifest?.version ??
        "1.0.0";

    async function onEntrar() {
        try {
            setLoading(true);
            await usuarioAutenticar(usuario, senha);
            router.replace("/HomeFiscalizacao");
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    return (
        <ImageBackground
            source={require("../../assets/background/fundo-release.png")}
            resizeMode="cover"
            style={styles.background}
        >
            <LinearGradient
                colors={["rgba(8,41,60,0.88)", "rgba(8,41,60,0.95)"]}
                style={StyleSheet.absoluteFillObject}
            />

            <KeyboardAvoidingView
                style={styles.flex1}
                behavior={Platform.select({ ios: "padding", android: undefined }) || undefined}
            >
                <View style={styles.content}>
                    <Image
                        source={require("../../assets/icon/logo.png")}
                        resizeMode="contain"
                        style={styles.logo}
                    />

                    <View style={styles.form}>
                        <Text style={styles.title}>Entrar</Text>

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

                        <Pressable
                            onPress={onEntrar}
                            disabled={loading || !usuario || !senha}
                            style={({ pressed }) => [
                                styles.button,
                                (loading || !usuario || !senha) && styles.buttonDisabled,
                                pressed && !(loading || !usuario || !senha) && styles.buttonPressed,
                            ]}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? "Validando..." : "Entrar"}
                            </Text>
                        </Pressable>
                    </View>

                    <Text style={styles.version}>{version}</Text>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#08293C" },
    flex1: { flex: 1 },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        alignItems: "center",
        justifyContent: "center",
        gap: 24,
    },
    logo: { width: 176, height: 96, marginBottom: -4 },
    form: {
        width: "100%",
        maxWidth: 420,
        borderRadius: 12,
        padding: 20,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
        gap: 12,
    },
    title: { color: "#fff", fontSize: 20, fontWeight: "600" },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 12,
        color: "#fff",
        backgroundColor: "rgba(255,255,255,0.1)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.2)",
    },
    button: {
        height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0ea5e9",
        marginTop: 8,
    },
    buttonPressed: { opacity: 0.9 },
    buttonDisabled: { opacity: 0.6 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    version: { color: "rgba(255,255,255,0.8)" },
});
