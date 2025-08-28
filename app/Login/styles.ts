import { StyleSheet } from 'react-native';
import theme from '@/src/theme';

const { colors } = theme;

export default StyleSheet.create({
    background: { flex: 1, backgroundColor: colors.primaryDark },
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
        color: colors.textOnPrimary,
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

    inputGroup: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 12,
        backgroundColor: "rgba(255,255,255,0.10)",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.22)",
        flexDirection: "row",
        alignItems: "center",
    },

    input: {
        flex: 1,
        color: colors.surface,
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
        backgroundColor: colors.accent,
        marginTop: 6,
    },

    buttonPressed: { opacity: 0.9 },
    buttonDisabled: { opacity: 0.6 },

    buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

    version: { color: "rgba(230,241,245,0.8)", marginTop: 8 },
});

