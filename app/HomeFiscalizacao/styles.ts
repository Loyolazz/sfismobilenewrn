import { StyleSheet, Dimensions, type ColorValue } from 'react-native';
import theme from '@/src/theme';

const { width } = Dimensions.get('window');

export const GAP = (theme?.spacing?.md as number) ?? 16;
export const CARD_SIZE = Math.floor((width - GAP * 3) / 2);

/* ---------- Gradientes (tuplas para o LinearGradient) ---------- */
export const CARD_GRADIENT: readonly [ColorValue, ColorValue] = [
    theme?.colors?.primaryDark ?? '#0A2647',
    theme?.colors?.primary ?? '#1E3A59',
];

export const DRAWER_BANNER_GRADIENT: readonly [ColorValue, ColorValue] = [
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
        marginTop: 0,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    greetingText: { fontSize: 20, color: '#fff' },
    greetingStrong: { fontWeight: '700' },
    greetingSub: { color: '#fff', marginTop: 4, fontSize: 14, opacity: 0.9 },

    /* ---------- seção com padding lateral (grid + versão) ---------- */
    section: { paddingHorizontal: GAP },

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

    /* ===================== Drawer — NOVO VISUAL ===================== */
    drawerSafe: { flex: 1, backgroundColor: '#F6F8FB' },
    drawerScrollContent: { paddingBottom: 24 },

    // Banner (gradiente + sombra)
    drawerBanner: {
        marginHorizontal: 16,
        marginTop: 12,
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
    },
    drawerBannerTop: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        alignItems: 'flex-end',
    },
    drawerLogo: { width: 92, height: 28, opacity: 0.95 },

    drawerHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    drawerAvatar: {
        width: 64, height: 64, borderRadius: 32,
        borderWidth: 2, borderColor: '#fff',
        backgroundColor: '#fff', marginRight: 12,
    },
    drawerAvatarFallback: {
        width: 64, height: 64, borderRadius: 32,
        backgroundColor: '#fff',
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#fff',
        marginRight: 12,
    },
    drawerHeaderText: { flex: 1, minWidth: 0 },
    drawerName: { color: '#fff', fontSize: 18, fontWeight: '700' },
    drawerEmail: { color: 'rgba(255,255,255,0.9)', fontSize: 13, marginTop: 2 },

    drawerChipsRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10, gap: 8 },
    drawerChip: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        paddingHorizontal: 10, paddingVertical: 6,
        backgroundColor: '#E5EEF9',
        borderRadius: 999,
    },
    drawerChipText: { color: '#0A2647', fontSize: 12, fontWeight: '600' },

    // Card da lista de itens
    drawerListCard: {
        marginTop: 14,
        marginHorizontal: 16,
        backgroundColor: '#fff',
        borderRadius: 14,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 2,
    },

    // Rodapé
    drawerFooter: { paddingHorizontal: 16, paddingTop: 12 },
    logoutPill: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        alignSelf: 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderColor: '#D7E1EE',
        width: '100%',
        borderRadius: 999,
        borderWidth: 1,
        paddingBottom: 10,
        marginBottom: 20,
    },
    logoutPillText: { color: theme?.colors?.primaryDark ?? '#0A2647', fontWeight: '700' },

    /* ---------- Modal (Novidades) ---------- */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.35)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: GAP,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 14,
        width: '100%',
        padding: GAP,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
        color: theme?.colors?.primaryDark ?? '#0A2647',
    },
    modalItem: { fontSize: 14, marginBottom: 6, color: '#2C3E50' },
    modalButton: {
        marginTop: 12,
        alignSelf: 'flex-end',
        paddingHorizontal: 16,
        paddingVertical: 10,
        backgroundColor: theme?.colors?.primaryDark ?? '#0A2647',
        borderRadius: 8,
    },
    modalButtonText: { color: '#fff', fontWeight: '600' },
});

export default styles;
