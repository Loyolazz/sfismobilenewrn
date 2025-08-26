import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <StatusBar style="light" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: "#0F3C52" },
                    animation: Platform.select({ android: "fade", ios: "fade" }),
                }}
            >
                <Stack.Screen name="Splash/index" options={{}} />
                <Stack.Screen name="Login/index" options={{}} />
                <Stack.Screen name="HomeFiscalizacao/index" options={{}} />
            </Stack>
        </SafeAreaProvider>
    );
}
