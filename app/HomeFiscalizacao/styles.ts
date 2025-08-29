import { StyleSheet, Dimensions, type ColorValue } from 'react-native';
import theme from '@/src/theme';

const { width } = Dimensions.get('window');

export const GAP = (theme?.spacing?.md as number) ?? 16;
export const CARD_SIZE = Math.floor((width - GAP * 3) / 2);

// Gradiente do "home old" tipado como tupla
export const CARD_GRADIENT: readonly [ColorValue, ColorValue] = [
    theme?.colors?.primaryDark ?? '#0A2647',
    theme?.colors?.primary ?? '#1E3A59',
];

const styles = StyleSheet.create({
    /* ---------- base ---------- */
    safeArea: {
        flex: 1,
        backgroundColor: theme?.colors?.background ?? '#EEF2F7',
    },
    scroll: { flex: 1 },
    scrollContent: {
        paddingTop: 0, // cola no header
    },

    /* ---------- header ---------- */
    header: {
        height: 56,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        paddingHorizontal: GAP,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },

    /* ---------- saudação FULL-BLEED ---------- */
    greetingBox: {
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        paddingHorizontal: GAP,
        paddingTop: GAP,
        paddingBottom: GAP * 1.1,
        marginTop: 0, // encostado no header
        // sem radius no topo para parecer uma faixa contínua
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    greetingText: { fontSize: 20, color: '#fff' },
    greetingStrong: { fontWeight: '700' },
    greetingSub: { color: '#fff', marginTop: 4, fontSize: 14, opacity: 0.9 },

    /* ---------- seção com padding lateral (grid + versão) ---------- */
    section: {
        paddingHorizontal: GAP,
    },

    /* ---------- grid ---------- */
    grid: {
        paddingTop: GAP,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    tileWrapper: {
        width: CARD_SIZE,
        marginBottom: GAP,
    },
    tile: {
        width: '100%',
        height: CARD_SIZE, // quadrado
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        // sombra sutil
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 4,
    },
    tileIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(255,255,255,0.12)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    tileText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },

    /* ---------- rodapé ---------- */
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#8B98A9',
        paddingVertical: 16,
    },

    /* ---------- drawer (já existente) ---------- */
    drawerSafe: { flex: 1 },
    drawerContent: { paddingBottom: 24 },
    userSection: {
        paddingTop: 52,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        paddingVertical: 30,
        alignItems: 'center',
    },
    userAvatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff', marginBottom: 8 },
    userName: { color: '#fff', fontSize: 18, fontWeight: '600' },
    userInfo: { color: '#ddd', fontSize: 14 },
    userExtra: { color: '#ddd', fontSize: 12, marginTop: 2 },

    logout: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 16 },
    logoutText: { color: theme?.colors?.primaryDark ?? '#0A2647', fontWeight: '600' },
});

export default styles;
