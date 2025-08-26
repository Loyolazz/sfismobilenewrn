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
} from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "../../src/lib/nativewind-interop";
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
            className="flex-1 bg-[#08293C]"
        >
            <LinearGradient
                colors={["rgba(8,41,60,0.88)", "rgba(8,41,60,0.95)"]}
                className="absolute inset-0"
            />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.select({ ios: "padding", android: undefined }) || undefined}
            >
                <View className="flex-1 px-6 items-center justify-center gap-6">
                    <Image
                        source={require("../../assets/icon/logo.png")}
                        resizeMode="contain"
                        className="w-44 h-24 -mb-1"
                    />

                    <View className="w-full max-w-[420px] rounded-xl p-5 bg-white/10 border border-white/20 gap-3">
                        <Text className="text-white text-[20px] font-semibold">Entrar</Text>

                        <TextInput
                            placeholder="Usuário / Matrícula"
                            placeholderTextColor="#9FB3C1"
                            value={usuario}
                            onChangeText={setUsuario}
                            className="h-12 rounded-xl px-3 text-white bg-white/10 border border-white/20"
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Senha"
                            placeholderTextColor="#9FB3C1"
                            value={senha}
                            onChangeText={setSenha}
                            className="h-12 rounded-xl px-3 text-white bg-white/10 border border-white/20"
                            secureTextEntry
                            returnKeyType="go"
                            onSubmitEditing={onEntrar}
                        />

                        <Pressable
                            onPress={onEntrar}
                            disabled={loading || !usuario || !senha}
                            className={`h-12 rounded-xl items-center justify-center bg-sky-500 mt-2 ${
                                loading || !usuario || !senha ? "opacity-60" : "active:opacity-90"
                            }`}
                        >
                            <Text className="text-white text-base font-bold">
                                {loading ? "Validando..." : "Entrar"}
                            </Text>
                        </Pressable>
                    </View>

                    <Text className="text-white/80">{version}</Text>
                </View>
            </KeyboardAvoidingView>
        </ImageBackground>
    );
}
