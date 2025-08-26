import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

export default function RootLayout() {
    return (
        <>
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
                {/* Você pode adicionar Home aqui depois */}
            </Stack>
        </>
    );
}
