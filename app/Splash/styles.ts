import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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

