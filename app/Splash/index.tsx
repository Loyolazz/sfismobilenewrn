import { useEffect } from "react";
import { Image, ImageBackground, Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ensureLatestVersion } from "@/src/lib/version";
import styles from './styles';
import {extractSoapResult, soapRequest} from "@/src/api/antaq";

export default function Splash() {
    const router = useRouter();
    const version =
        Constants.expoConfig?.version ??
        (Constants.manifest as any)?.version ??
        "1.2.11";

    useEffect(() => {
        const ac = new AbortController();
        (async () => {
            try {
                const parsed = await soapRequest("GetVersion", undefined, { signal: ac.signal });
                const v = extractSoapResult(parsed, "GetVersion");
                console.log("Versão API =", v);
            } catch (e: any) {
                if (e?.name === "CanceledError" || e?.message === "canceled") {
                    console.log("Chamada cancelada (unmount/refresh)");
                } else {
                    console.warn("Falha GetVersion:", e?.message || String(e));
                }
            }
        })();
        return () => ac.abort();
    }, []);

    useEffect(() => {
        async function init() {
            const ok = await ensureLatestVersion();
            if (ok) {
                router.replace("/Login");
            }
        }
        init();
    }, [router]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require("../../assets/background/fundo-release.png")}
                resizeMode="cover"
                style={styles.background}
            >
                <LinearGradient
                    colors={["rgba(8,41,60,0.85)", "rgba(8,41,60,0.92)"]}
                    style={StyleSheet.absoluteFillObject}
                />

                <View style={styles.center}>
                    <Image
                        source={require("../../assets/icon/logo-navbar@1,5x.png")}
                        resizeMode="contain"
                        style={styles.logo}
                    />
                    <Text style={styles.versionTop}>{version}</Text>
                </View>

                <View style={styles.versionContainer}>
                    <Text style={styles.versionBottom}>{version}</Text>
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

