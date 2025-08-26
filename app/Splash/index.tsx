import { useEffect } from "react";
import { Image, ImageBackground, Text, View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { ensureLatestVersion } from "@/src/lib/version";

export default function Splash() {
    const router = useRouter();
    const version =
        Constants.expoConfig?.version ??
        Constants.manifest?.version ??
        "1.0.0";

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
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, backgroundColor: "#08293C" },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
    },
    logo: { width: 208, height: 112 },
    versionTop: { color: "rgba(255,255,255,0.9)", fontSize: 14 },
    versionContainer: {
        position: "absolute",
        bottom: 16,
        left: 0,
        right: 0,
        alignItems: "center",
    },
    versionBottom: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
});
