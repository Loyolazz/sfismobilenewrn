import { StyleSheet } from "react-native";
import theme from "@/src/theme";

export default StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },
    flex1: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.colors.surface,
        textAlign: "center",
        marginBottom: 24,
    },
    form: {
        marginTop: 16,
    },
    inputGroup: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.surface,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
        height: 50,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginVertical: 12,
    },
    keepText: {
        fontSize: 12,
        color: theme.colors.text,
    },
    error: {
        color: theme.colors.error,
        textAlign: "center",
        marginBottom: 12,
    },
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        marginTop: 16,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    version: {
        marginTop: 32,
        fontSize: 12,
        textAlign: "center",
        color: "#ccc",
    },
});