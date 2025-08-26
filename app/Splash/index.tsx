import { useEffect } from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { LinearGradient } from "../../src/lib/nativewind-interop";
import { ensureLatestVersion } from "../../src/lib/version";

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
            className="flex-1 bg-[#08293C]"
        >
            <LinearGradient
                colors={["rgba(8,41,60,0.85)", "rgba(8,41,60,0.92)"]}
                className="absolute inset-0"
            />

            <View className="flex-1 items-center justify-center gap-4">
                <Image
                    source={require("../../assets/icon/logo-navbar@1,5x.png")}
                    resizeMode="contain"
                    className="w-52 h-28"
                />
                <Text className="text-white/90 text-sm">{version}</Text>
            </View>

            <View className="absolute bottom-4 inset-x-0 items-center">
                <Text className="text-white/80 text-xs">{version}</Text>
            </View>
        </ImageBackground>
    );
}
